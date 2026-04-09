package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.CronMailDto;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.CronMail;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.CronMailService;
import com.bzdata.gestimospringbackend.Services.PrintService;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.CronMailRepository;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CronMailServiceImpl implements CronMailService {

  static final int DEFAULT_DAY_OF_MONTH = 1;
  static final int DEFAULT_EXECUTION_HOUR = 8;
  static final int DEFAULT_EXECUTION_MINUTE = 0;
  static final DateTimeFormatter PERIOD_LABEL_FORMATTER = DateTimeFormatter.ofPattern(
    "MMMM uuuu",
    Locale.FRANCE
  );
  static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    "dd/MM/uuuu 'a' HH:mm",
    Locale.FRANCE
  );

  final CronMailRepository cronMailRepository;
  final GestimoWebMapperImpl gestimoWebMapperImpl;
  final AppelLoyerService appelLoyerService;
  final PrintService printService;
  final BailLocationRepository bailLocationRepository;
  final AgenceImmobiliereRepository agenceImmobiliereRepository;
  final JavaMailSender mailSender;

  @Value("${spring.mail.username:}")
  String mailFrom;

  @Override
  @Transactional(readOnly = true)
  public CronMailDto getConfigurationByAgence(Long idAgence) {
    validateAgenceId(idAgence);

    CronMail configuration = cronMailRepository
      .findTopByIdAgenceOrderByIdDesc(idAgence)
      .orElseGet(() -> buildDefaultConfiguration(idAgence));

    return gestimoWebMapperImpl.fromCronMail(configuration);
  }

  @Override
  public CronMailDto saveConfiguration(CronMailDto dto) {
    validateConfiguration(dto);

    CronMail configuration = cronMailRepository
      .findTopByIdAgenceOrderByIdDesc(dto.getIdAgence())
      .orElseGet(CronMail::new);

    configuration.setIdAgence(dto.getIdAgence());
    configuration.setManagerEmail(dto.getManagerEmail().trim());
    configuration.setDayOfMonth(normalizeDayOfMonth(dto.getDayOfMonth()));
    configuration.setExecutionHour(normalizeHour(dto.getExecutionHour()));
    configuration.setExecutionMinute(normalizeMinute(dto.getExecutionMinute()));
    configuration.setEnabled(dto.isEnabled());
    configuration.setNextExecutionAt(
      configuration.isEnabled()
        ? computeNextExecution(configuration, LocalDateTime.now())
        : null
    );
    synchronizeLegacyColumns(configuration);

    CronMail savedConfiguration = cronMailRepository.save(configuration);
    return gestimoWebMapperImpl.fromCronMail(savedConfiguration);
  }

  @Override
  public boolean runNow(Long idAgence) {
    validateAgenceId(idAgence);
    CronMail configuration = cronMailRepository
      .findTopByIdAgenceOrderByIdDesc(idAgence)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucune planification n'a ete trouvee pour cette agence.",
          ErrorCodes.AGENCE_NOT_VALID
        )
      );

    return executeConfiguration(configuration, LocalDateTime.now(), true);
  }

  @Override
  public int processDueConfigurations() {
    LocalDateTime now = LocalDateTime.now();
    List<CronMail> enabledConfigurations = cronMailRepository.findAllByEnabledTrueOrderByIdDesc();

    Map<Long, CronMail> latestConfigurationsByAgency = new LinkedHashMap<>();
    enabledConfigurations.forEach(configuration -> {
      if (configuration.getIdAgence() == null) {
        return;
      }

      latestConfigurationsByAgency.putIfAbsent(configuration.getIdAgence(), configuration);
    });

    int processedCount = 0;
    for (CronMail configuration : latestConfigurationsByAgency.values()) {
      if (!isConfigurationDue(configuration, now)) {
        continue;
      }

      if (executeConfiguration(configuration, now, false)) {
        processedCount++;
      }
    }

    return processedCount;
  }

  private CronMail buildDefaultConfiguration(Long idAgence) {
    CronMail configuration = new CronMail();
    configuration.setIdAgence(idAgence);
    configuration.setDayOfMonth(DEFAULT_DAY_OF_MONTH);
    configuration.setExecutionHour(DEFAULT_EXECUTION_HOUR);
    configuration.setExecutionMinute(DEFAULT_EXECUTION_MINUTE);
    configuration.setEnabled(false);
    configuration.setLegacyDone(false);
    return configuration;
  }

  private boolean executeConfiguration(
    CronMail configuration,
    LocalDateTime executionTime,
    boolean manualExecution
  ) {
    try {
      Long idAgence = configuration.getIdAgence();
      YearMonth targetPeriod = resolveTargetPeriod(executionTime);
      String targetPeriodCode = targetPeriod.toString();
      int generatedCount = appelLoyerService.generateAppelsForPeriod(
        targetPeriodCode,
        idAgence
      );
      long eligibleBauxCount = countEligibleBaux(idAgence, targetPeriod);

      sendSummaryMail(
        configuration,
        targetPeriod,
        generatedCount,
        eligibleBauxCount,
        executionTime
      );

      configuration.setLastExecutionAt(executionTime.withSecond(0).withNano(0));
      configuration.setLastExecutionPeriod(targetPeriodCode);
      configuration.setNextExecutionAt(
        configuration.isEnabled()
          ? computeExecutionForNextMonth(configuration, executionTime)
          : null
      );
      synchronizeLegacyColumns(configuration);
      cronMailRepository.save(configuration);

      log.info(
        "Planification appel de loyer executee pour l'agence {} sur la periode {} ({} appel(s) cree(s), manuel={})",
        idAgence,
        targetPeriodCode,
        generatedCount,
        manualExecution
      );
      return true;
    } catch (Exception exception) {
      log.error(
        "Erreur lors de l'execution de la planification de l'agence {}",
        configuration.getIdAgence(),
        exception
      );
      return false;
    }
  }

  private void sendSummaryMail(
    CronMail configuration,
    YearMonth targetPeriod,
    int generatedCount,
    long eligibleBauxCount,
    LocalDateTime executionTime
  ) {
    if (!StringUtils.hasText(configuration.getManagerEmail())) {
      return;
    }

    MimeMessage mimeMessage = mailSender.createMimeMessage();
    String agenceLabel = agenceImmobiliereRepository
      .findById(configuration.getIdAgence())
      .map(AgenceImmobiliere::getNomAgence)
      .filter(StringUtils::hasText)
      .orElse("Agence");
    String targetPeriodCode = targetPeriod.toString();
    String nextExecutionLabel = configuration.isEnabled()
      ? DATE_TIME_FORMATTER.format(computeExecutionForNextMonth(configuration, executionTime))
      : "Planification desactivee";
    byte[] attachmentBytes = generatePeriodAttachment(targetPeriodCode, configuration.getIdAgence());
    String body = String.format(
      "Bonjour,%n%n" +
      "L'appel de loyer mensuel de l'agence %s vient d'etre prepare pour la periode de %s.%n%n" +
      "Nombre de baux eligibles : %d%n" +
      "Nombre de nouveaux appels crees : %d%n" +
      "Date et heure d'execution : %s%n" +
      "Prochaine execution planifiee : %s%n%n" +
      "Vous trouverez en piece jointe l'etat des appels de loyer de la periode %s.%n%n" +
      "Cordialement,%nGestimo",
      agenceLabel,
      targetPeriod.format(PERIOD_LABEL_FORMATTER),
      eligibleBauxCount,
      generatedCount,
      DATE_TIME_FORMATTER.format(executionTime.withSecond(0).withNano(0)),
      nextExecutionLabel,
      targetPeriod.format(PERIOD_LABEL_FORMATTER)
    );

    try {
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
      helper.setTo(configuration.getManagerEmail().trim());
      if (StringUtils.hasText(mailFrom)) {
        helper.setFrom(mailFrom.trim());
      }
      helper.setSubject(
        "Execution appel de loyer - " + agenceLabel + " - " + targetPeriodCode
      );
      helper.setText(body, false);
      helper.addAttachment(
        buildAttachmentName(targetPeriodCode),
        new ByteArrayResource(attachmentBytes)
      );
      mailSender.send(mimeMessage);
    } catch (Exception exception) {
      log.error(
        "Erreur lors de l'envoi du mail de synthese a {}",
        configuration.getManagerEmail(),
        exception
      );
      throw new IllegalStateException(
        "Impossible d'envoyer le mail de synthese de planification.",
        exception
      );
    }
  }

  private YearMonth resolveTargetPeriod(LocalDateTime executionTime) {
    return YearMonth.from(executionTime).plusMonths(1);
  }

  private byte[] generatePeriodAttachment(String periodCode, Long idAgence) {
    try {
      byte[] attachmentBytes = printService.quittancePeriodeString(periodCode, idAgence);
      if (attachmentBytes == null || attachmentBytes.length == 0) {
        throw new IllegalStateException(
          "Aucun document n'a ete genere pour la periode " + periodCode
        );
      }
      return attachmentBytes;
    } catch (Exception exception) {
      throw new IllegalStateException(
        "Impossible de generer la piece jointe de l'appel de loyer " + periodCode,
        exception
      );
    }
  }

  private String buildAttachmentName(String periodCode) {
    return "quittance-" + periodCode + ".pdf";
  }

  private long countEligibleBaux(Long idAgence, YearMonth period) {
    return bailLocationRepository
      .findAll()
      .stream()
      .filter(bail -> Objects.equals(bail.getIdAgence(), idAgence))
      .filter(BailLocation::isEnCoursBail)
      .filter(bail -> !bail.isArchiveBail())
      .filter(bail -> bail.getDateDebut() != null && bail.getDateFin() != null)
      .filter(bail -> {
        YearMonth start = YearMonth.from(bail.getDateDebut());
        YearMonth end = YearMonth.from(bail.getDateFin());
        return !period.isBefore(start) && !period.isAfter(end);
      })
      .count();
  }

  private boolean isConfigurationDue(CronMail configuration, LocalDateTime now) {
    return (
      configuration.isEnabled() &&
      configuration.getIdAgence() != null &&
      configuration.getNextExecutionAt() != null &&
      !configuration.getNextExecutionAt().isAfter(now)
    );
  }

  private LocalDateTime computeNextExecution(CronMail configuration, LocalDateTime reference) {
    LocalDateTime candidate = buildExecutionDateTime(
      YearMonth.from(reference),
      normalizeDayOfMonth(configuration.getDayOfMonth()),
      normalizeHour(configuration.getExecutionHour()),
      normalizeMinute(configuration.getExecutionMinute())
    );

    if (!candidate.isAfter(reference)) {
      return computeExecutionForNextMonth(configuration, reference);
    }

    return candidate;
  }

  private LocalDateTime computeExecutionForNextMonth(
    CronMail configuration,
    LocalDateTime reference
  ) {
    return buildExecutionDateTime(
      YearMonth.from(reference).plusMonths(1),
      normalizeDayOfMonth(configuration.getDayOfMonth()),
      normalizeHour(configuration.getExecutionHour()),
      normalizeMinute(configuration.getExecutionMinute())
    );
  }

  private LocalDateTime buildExecutionDateTime(
    YearMonth yearMonth,
    int dayOfMonth,
    int hour,
    int minute
  ) {
    int safeDay = Math.min(Math.max(dayOfMonth, 1), yearMonth.lengthOfMonth());
    return yearMonth.atDay(safeDay).atTime(hour, minute, 0, 0);
  }

  private void synchronizeLegacyColumns(CronMail configuration) {
    if (configuration == null) {
      return;
    }

    configuration.setLegacyDone(false);
    configuration.setLegacyNextDateMail(
      configuration.getNextExecutionAt() != null
        ? configuration.getNextExecutionAt().toLocalDate()
        : null
    );
  }

  private void validateConfiguration(CronMailDto dto) {
    if (dto == null) {
      throw new InvalidEntityException(
        "La configuration de planification est obligatoire.",
        ErrorCodes.AGENCE_NOT_VALID
      );
    }

    validateAgenceId(dto.getIdAgence());

    if (!StringUtils.hasText(dto.getManagerEmail())) {
      throw new InvalidEntityException(
        "L'email de la gerante est obligatoire.",
        ErrorCodes.AGENCE_NOT_VALID
      );
    }

    normalizeDayOfMonth(dto.getDayOfMonth());
    normalizeHour(dto.getExecutionHour());
    normalizeMinute(dto.getExecutionMinute());
  }

  private void validateAgenceId(Long idAgence) {
    if (idAgence == null || idAgence <= 0) {
      throw new InvalidEntityException(
        "L'agence cible est obligatoire.",
        ErrorCodes.AGENCE_NOT_VALID
      );
    }
  }

  private int normalizeDayOfMonth(Integer dayOfMonth) {
    int value = dayOfMonth == null ? DEFAULT_DAY_OF_MONTH : dayOfMonth;
    if (value < 1 || value > 28) {
      throw new InvalidEntityException(
        "Le jour d'execution doit etre compris entre 1 et 28.",
        ErrorCodes.AGENCE_NOT_VALID
      );
    }
    return value;
  }

  private int normalizeHour(Integer hour) {
    int value = hour == null ? DEFAULT_EXECUTION_HOUR : hour;
    if (value < 0 || value > 23) {
      throw new InvalidEntityException(
        "L'heure d'execution doit etre comprise entre 0 et 23.",
        ErrorCodes.AGENCE_NOT_VALID
      );
    }
    return value;
  }

  private int normalizeMinute(Integer minute) {
    int value = minute == null ? DEFAULT_EXECUTION_MINUTE : minute;
    if (value < 0 || value > 59) {
      throw new InvalidEntityException(
        "La minute d'execution doit etre comprise entre 0 et 59.",
        ErrorCodes.AGENCE_NOT_VALID
      );
    }
    return value;
  }
}
