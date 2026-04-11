package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.AnneeAppelLoyersDto;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyerDto;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyerRequestDto;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.PeriodeDto;
import com.bzdata.gestimospringbackend.DTOs.PourcentageAppelDto;
import com.bzdata.gestimospringbackend.DTOs.StatistiquePeriodeDto;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.Models.Operation;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Utils.SmsOrangeConfig;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.repository.AppelLoyerRepository;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementPrincipalRepository;
import com.bzdata.gestimospringbackend.repository.MontantLoyerBailRepository;
import com.bzdata.gestimospringbackend.repository.OperationRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.validator.AppelLoyerRequestValidator;
import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Cette classe permet la creation du service
 * d'appel de loyer
 *
 * @version 1.1
 * @Author Michel Bossoh
 */
@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppelLoyerServiceImpl implements AppelLoyerService {

  final EncaissementPrincipalRepository encaissementPrincipalRepository;
  final MontantLoyerBailRepository montantLoyerBailRepository;
  final BailLocationRepository bailLocationRepository;
  final AppelLoyerRepository appelLoyerRepository;
  final UtilisateurRepository utilisateurRepository;
  final GestimoWebMapperImpl gestimoWebMapper;
  final BienImmobilierRepository bienImmobilierRepository;
  final SmsOrangeConfig envoiSmsOrange;
  final OperationRepository operationRepository;
  final AgenceImmobiliereRepository agenceImmobiliereRepository;

  /**
   * Cette methode est utilisé pour enregister tous les appels loyers
   * de l'utilisateur durant la periode de contrat
   *
   * @param dto de l appelLoyrRequestDtio il comprend :
   *            Long idAgence;
   *            Long idBailLocation;
   *            double montantLoyerEnCours;
   * @return une liste de periodes ou les loyers sont appeler
   */

  @Override
  public List<String> save(AppelLoyerRequestDto dto) {
    List<String> errors = AppelLoyerRequestValidator.validate(dto);
    if (!errors.isEmpty()) {
      throw new InvalidEntityException(
        "Certain attributs de l'object appelloyer sont null.",
        ErrorCodes.APPELLOYER_NOT_VALID,
        errors
      );
    }
    BailLocation bailLocation = bailLocationRepository
      .findById(dto.getIdBailLocation())
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun BailMagasin has been found with Code " +
          dto.getIdBailLocation(),
          ErrorCodes.BAILLOCATION_NOT_FOUND
        )
      );

    LocalDate dateDebut = bailLocation.getDateDebut();
    LocalDate dateFin = bailLocation.getDateFin();
    YearMonth periodeDebut = YearMonth.from(dateDebut);
    YearMonth periodeFin = YearMonth.from(dateFin);
    Double montantBail = findMontantLoyerActif(bailLocation);

    List<AppelLoyer> appelLoyerList = buildMissingAppels(
      bailLocation,
      dto.getIdAgence(),
      montantBail > 0 ? montantBail : dto.getMontantLoyerEnCours(),
      periodeDebut,
      periodeFin
    );

    if (!appelLoyerList.isEmpty()) {
      appelLoyerRepository.saveAll(appelLoyerList);
    }

    return appelLoyerList
      .stream()
      .map(AppelLoyer::getPeriodeAppelLoyer)
      .collect(Collectors.toList());
  }

  @Override
  public boolean cloturerAppelDto(Long id) {
    if (id == null) {
      return false;
    }
    boolean exist = appelLoyerRepository.existsById(id);
    if (!exist) {
      throw new EntityNotFoundException(
        "Aucune Studio avec l'ID = " + id + " " + "n' ete trouve dans la BDD",
        ErrorCodes.BAILLOCATION_NOT_FOUND
      );
    }

    AppelLoyersFactureDto byId = findById(id);
    byId.setCloturer(true);
    appelLoyerRepository.save(gestimoWebMapper.fromAppelLoyerDto(byId));
    return true;
  }

  @Override
  public List<AppelLoyersFactureDto> findAll(Long idAgence) {
    return appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer -> Objects.equals(appelLoyer.getIdAgence(), idAgence))
      .filter(this::isVisibleForQuittanceManagement)
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
  }

  @Override
  public List<AppelLoyersFactureDto> findAllAppelLoyerByPeriode(
    String periodeAppelLoyer,
    Long idAgence
  ) {
    ensureMissingAppelsForActiveBails(idAgence);
    ensurePeriodExistsForActiveBails(idAgence, periodeAppelLoyer);
    return appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer ->
        appelLoyer.getPeriodeAppelLoyer().equals(periodeAppelLoyer) &&
        Objects.equals(appelLoyer.getIdAgence(), idAgence)
      )
      .filter(this::isVisibleForQuittanceManagement)
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
  }

  @Override
  public List<Integer> listOfDistinctAnnee(Long idAgence) {
    ensureMissingAppelsForActiveBails(idAgence);
    List<Integer> collectAnneAppelDistinct = appelLoyerRepository
      .findAll()
      .stream()
      .filter(agence -> Objects.equals(agence.getIdAgence(), idAgence))
      .filter(this::isVisibleForQuittanceManagement)
      .map(AppelLoyer::getAnneeAppelLoyer)
      .distinct()
      .sorted()
      .collect(Collectors.toList());
    return collectAnneAppelDistinct;
  }

  @Override
  public List<PeriodeDto> listOfPerodesByAnnee(Integer annee, Long idAgence) {
    ensureMissingAppelsForActiveBails(idAgence);
    List<PeriodeDto> collectPeriodeDistinct = appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer -> appelLoyer.getAnneeAppelLoyer() == annee)
      .filter(agence -> Objects.equals(agence.getIdAgence(), idAgence))
      .filter(this::isVisibleForQuittanceManagement)
      .map(gestimoWebMapper::fromPeriodeAppel)
      .distinct()
      .collect(Collectors.toList());

    return collectPeriodeDistinct;
  }

  @Override
  public List<AnneeAppelLoyersDto> listOfAppelLoyerByAnnee(
    Integer annee,
    Long idAgence
  ) {
    ensureMissingAppelsForActiveBails(idAgence);
    return appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer -> appelLoyer.getAnneeAppelLoyer() == annee)
      .filter(agence -> Objects.equals(agence.getIdAgence(), idAgence))
      .map(gestimoWebMapper::fromAppelLoyerForAnnee)
      .distinct()
      .collect(Collectors.toList());
  }

  @Override
  public AppelLoyersFactureDto findById(Long id) {
    if (id == null) {
      return null;
    }
    return appelLoyerRepository
      .findById(id)
      .map(gestimoWebMapper::fromAppelLoyer)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun Appel loyer has been found with Code " + id,
          ErrorCodes.APPELLOYER_NOT_FOUND
        )
      );
  }

  private void ensureMissingAppelsForActiveBails(Long idAgence) {
    if (idAgence == null) {
      return;
    }

    bailLocationRepository
      .findAll()
      .stream()
      .filter(bail -> Objects.equals(bail.getIdAgence(), idAgence))
      .filter(BailLocation::isEnCoursBail)
      .filter(bail -> !bail.isArchiveBail())
      .filter(bail ->
        appelLoyerRepository.findAllByBailLocationAppelLoyer(bail).isEmpty()
      )
      .forEach(this::createMissingAppelsForBail);
  }

  private void ensurePeriodExistsForActiveBails(
    Long idAgence,
    String periodeAppelLoyer
  ) {
    if (idAgence == null || periodeAppelLoyer == null || periodeAppelLoyer.isBlank()) {
      return;
    }

    YearMonth periodeDemandee;
    try {
      periodeDemandee = YearMonth.parse(periodeAppelLoyer);
    } catch (DateTimeParseException exception) {
      return;
    }

    bailLocationRepository
      .findAll()
      .stream()
      .filter(bail -> Objects.equals(bail.getIdAgence(), idAgence))
      .filter(BailLocation::isEnCoursBail)
      .filter(bail -> !bail.isArchiveBail())
      .filter(bail -> isWithinBailPeriod(bail, periodeDemandee))
      .forEach(bail -> createMissingAppelForPeriod(bail, periodeDemandee));
  }

  private void createMissingAppelsForBail(BailLocation bailLocation) {
    Double montantActuel = findMontantLoyerActif(bailLocation);

    if (montantActuel == null || montantActuel <= 0) {
      return;
    }

    List<AppelLoyer> appelsManquants = buildMissingAppels(
      bailLocation,
      bailLocation.getIdAgence(),
      montantActuel,
      YearMonth.from(bailLocation.getDateDebut()),
      YearMonth.from(bailLocation.getDateFin())
    );

    if (!appelsManquants.isEmpty()) {
      appelLoyerRepository.saveAll(appelsManquants);
    }
  }

  private void createMissingAppelForPeriod(
    BailLocation bailLocation,
    YearMonth periodeDemandee
  ) {
    Double montantActuel = findMontantLoyerActif(bailLocation);

    if (montantActuel == null || montantActuel <= 0) {
      return;
    }

    List<AppelLoyer> appelsManquants = buildMissingAppels(
      bailLocation,
      bailLocation.getIdAgence(),
      montantActuel,
      periodeDemandee,
      periodeDemandee
    );

    if (!appelsManquants.isEmpty()) {
      appelLoyerRepository.saveAll(appelsManquants);
    }
  }

  private List<AppelLoyer> buildMissingAppels(
    BailLocation bailLocation,
    Long idAgence,
    Double montantLoyer,
    YearMonth periodeDebut,
    YearMonth periodeFin
  ) {
    if (
      bailLocation == null ||
      periodeDebut == null ||
      periodeFin == null ||
      montantLoyer == null ||
      montantLoyer <= 0
    ) {
      return new ArrayList<>();
    }

    long totalMonths = ChronoUnit.MONTHS.between(periodeDebut, periodeFin);
    if (totalMonths < 0) {
      return new ArrayList<>();
    }

    Set<String> periodesExistantes = appelLoyerRepository
      .findAllByBailLocationAppelLoyer(bailLocation)
      .stream()
      .map(AppelLoyer::getPeriodeAppelLoyer)
      .filter(Objects::nonNull)
      .collect(Collectors.toSet());

    List<AppelLoyer> appels = new ArrayList<>();
    for (long offset = 0; offset <= totalMonths; offset++) {
      YearMonth periode = periodeDebut.plusMonths(offset);
      String codePeriode = periode.toString();
      if (periodesExistantes.contains(codePeriode)) {
        continue;
      }

      appels.add(buildAppelLoyer(bailLocation, idAgence, montantLoyer, periode));
    }

    return appels;
  }

  private AppelLoyer buildAppelLoyer(
    BailLocation bailLocation,
    Long idAgence,
    Double montantLoyer,
    YearMonth periode
  ) {
    AppelLoyer appelLoyer = new AppelLoyer();
    LocalDate start = periode.atDay(1);
    LocalDate datePaiementPrevu = periode.atDay(10);
    LocalDate end = periode.atEndOfMonth();

    DateTimeFormatter periodeFormatter = DateTimeFormatter.ofPattern(
      "MMMM uuuu",
      Locale.FRANCE
    );
    DateTimeFormatter moisFormatter = DateTimeFormatter.ofPattern(
      "MMMM",
      Locale.FRANCE
    );

    appelLoyer.setPeriodeLettre(periode.format(periodeFormatter));
    appelLoyer.setMoisUniquementLettre(periode.format(moisFormatter));
    appelLoyer.setMessageReduction("");
    appelLoyer.setIdAgence(idAgence);
    appelLoyer.setPeriodeAppelLoyer(periode.toString());
    appelLoyer.setStatusAppelLoyer("Impayé");
    appelLoyer.setDatePaiementPrevuAppelLoyer(datePaiementPrevu);
    appelLoyer.setDateDebutMoisAppelLoyer(start);
    appelLoyer.setDateFinMoisAppelLoyer(end);
    appelLoyer.setAnneeAppelLoyer(periode.getYear());
    appelLoyer.setMoisChiffreAppelLoyer(periode.getMonthValue());
    appelLoyer.setCloturer(false);
    appelLoyer.setSolderAppelLoyer(false);
    appelLoyer.setDescAppelLoyer("Appel groupé");
    appelLoyer.setSoldeAppelLoyer(montantLoyer);
    appelLoyer.setMontantLoyerBailLPeriode(montantLoyer);
    appelLoyer.setBailLocationAppelLoyer(bailLocation);
    return appelLoyer;
  }

  private Double findMontantLoyerActif(BailLocation bailLocation) {
    return montantLoyerBailRepository
      .findByBailLocation(bailLocation)
      .stream()
      .filter(MontantLoyerBail::isStatusLoyer)
      .map(MontantLoyerBail::getNouveauMontantLoyer)
      .findFirst()
      .orElse(0.0);
  }

  private boolean isWithinBailPeriod(
    BailLocation bailLocation,
    YearMonth periodeDemandee
  ) {
    if (
      bailLocation == null ||
      bailLocation.getDateDebut() == null ||
      bailLocation.getDateFin() == null
    ) {
      return false;
    }

    YearMonth periodeDebut = YearMonth.from(bailLocation.getDateDebut());
    YearMonth periodeFin = YearMonth.from(bailLocation.getDateFin());
    return (
      !periodeDemandee.isBefore(periodeDebut) &&
      !periodeDemandee.isAfter(periodeFin)
    );
  }

  @Override
  public List<AppelLoyerDto> findAllAppelLoyerByBailId(Long idBailLocation) {
    BailLocation bailLocation = bailLocationRepository
      .findById(idBailLocation)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun BailMagasin has been found with Code " + idBailLocation,
          ErrorCodes.BAILLOCATION_NOT_FOUND
        )
      );
    List<AppelLoyer> lesLoyers = appelLoyerRepository.findAllByBailLocationAppelLoyer(
      bailLocation
    );

    return lesLoyers
      .stream()
      // .filter(appelLoyer -> !appelLoyer.isCloturer())
      .filter(bail -> bail.getBailLocationAppelLoyer() == bailLocation)
      .map(AppelLoyerDto::fromEntity)
      .collect(Collectors.toList());
  }

  @Override
  public List<AppelLoyersFactureDto> findAllAppelLoyerImpayerByBailId(
    Long idBailLocation
  ) {
    BailLocation bailLocation = bailLocationRepository
      .findById(idBailLocation)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun BailMagasin has been found with Code " + idBailLocation,
          ErrorCodes.BAILLOCATION_NOT_FOUND
        )
      );
    List<AppelLoyer> lesLoyers = appelLoyerRepository.findAllByBailLocationAppelLoyer(
      bailLocation
    );
    // first date debut du mois
    Comparator<AppelLoyer> appelLoyerByDateDebutAppelLoyer = Comparator.comparing(
      AppelLoyer::getDateDebutMoisAppelLoyer
    );
    return lesLoyers
      .stream()
      .filter(bail ->
        bail.getBailLocationAppelLoyer() == bailLocation &&
        bail.isSolderAppelLoyer() == false
      )
      .sorted(appelLoyerByDateDebutAppelLoyer)
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
  }

  @Override
  public List<AppelLoyersFactureDto> findAllForRelance(Long idAgence) {
    ensureMissingAppelsForActiveBails(idAgence);
    YearMonth currentPeriod = YearMonth.now();

    return appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer -> Objects.equals(appelLoyer.getIdAgence(), idAgence))
      .filter(this::isVisibleForQuittanceManagement)
      .filter(appelLoyer -> !appelLoyer.isSolderAppelLoyer())
      .filter(appelLoyer -> {
        Double solde = appelLoyer.getSoldeAppelLoyer();
        return solde != null && solde > 0;
      })
      .filter(appelLoyer -> isBeforeCurrentPeriod(appelLoyer, currentPeriod))
      .sorted(
        Comparator
          .comparing(
            (AppelLoyer appelLoyer) -> extractYearMonth(appelLoyer),
            Comparator.nullsLast(Comparator.naturalOrder())
          )
          .thenComparing(AppelLoyer::getDateDebutMoisAppelLoyer, Comparator.nullsLast(Comparator.naturalOrder()))
          .thenComparing(AppelLoyer::getId, Comparator.nullsLast(Comparator.naturalOrder()))
      )
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
  }

  @Override
  public double soldeArrierer(Long idBailLocation) {
    return 0;
  }

  @Override
  public AppelLoyersFactureDto getFirstLoyerImpayerByBien(Long bien) {
    Bienimmobilier bienImmobilier = bienImmobilierRepository
      .findById(bien)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun Bien a été trouvé avec l'adresse " + bien,
          ErrorCodes.BIEN_IMMOBILIER_NOT_FOUND
        )
      );
    List<AppelLoyer> lesLoyers = appelLoyerRepository.findAll();

    return lesLoyers
      .stream()
      .filter(bienTrouver ->
        bienTrouver
          .getBailLocationAppelLoyer()
          .getBienImmobilierOperation()
          .equals(bienImmobilier) &&
        bienTrouver.getSoldeAppelLoyer() > 0
      )
      .sorted(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer))
      .map(gestimoWebMapper::fromAppelLoyer)
      .findFirst()
      .orElseThrow(null);
  }

  @Override
  public double impayeParPeriode(String periode, Long idAgence, Long chapitre) {
    if (chapitre == null || chapitre == 0) {
      List<Double> soldeImpaye = appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getPeriodeAppelLoyer().equals(periode) &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          period.getSoldeAppelLoyer() > 0 &&
          period.isCloturer() == false
        )
        .map(AppelLoyer::getSoldeAppelLoyer)
        .collect(Collectors.toList());
      return soldeImpaye.stream().mapToDouble(Double::doubleValue).sum();
    } else {
      List<Double> soldeImpaye = appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getPeriodeAppelLoyer().equals(periode) &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          period.getSoldeAppelLoyer() > 0 &&
          period.isCloturer() == false &&
          Objects.equals(
            period
            .getBailLocationAppelLoyer()
            .getBienImmobilierOperation()
            .getChapitre()
            .getId(),
            chapitre
          )
        )
        .map(AppelLoyer::getSoldeAppelLoyer)
        .collect(Collectors.toList());
      return soldeImpaye.stream().mapToDouble(Double::doubleValue).sum();
    }
  }

  @Override
  public double payeParPeriode(String periode, Long idAgence, Long chapitre) {
    // Calcul par appel : max(0, montantLoyerBailLPeriode - soldeAppelLoyer)
    // Évite un résultat négatif lorsque le solde dépasse le montant de base
    // (ex : réduction de loyer appliquée après un paiement partiel)
    if (chapitre == null || chapitre == 0) {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getPeriodeAppelLoyer().equals(periode) &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          !period.isCloturer()
        )
        .mapToDouble(appel ->
          Math.max(0, appel.getMontantLoyerBailLPeriode() - Math.max(0, appel.getSoldeAppelLoyer()))
        )
        .sum();
    } else {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getPeriodeAppelLoyer().equals(periode) &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          !period.isCloturer() &&
          Objects.equals(
            period
            .getBailLocationAppelLoyer()
            .getBienImmobilierOperation()
            .getChapitre()
            .getId(),
            chapitre
          )
        )
        .mapToDouble(appel ->
          Math.max(0, appel.getMontantLoyerBailLPeriode() - Math.max(0, appel.getSoldeAppelLoyer()))
        )
        .sum();
    }
  }

  @Override
  public double impayeParAnnee(int annee, Long idAgence, Long chapitre) {
    if (chapitre == 0 || chapitre == null) {
      List<Double> soldeImpaye = appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getAnneeAppelLoyer() == (annee) &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          period.getSoldeAppelLoyer() > 0 &&
          period.isCloturer() == false
        )
        .map(AppelLoyer::getSoldeAppelLoyer)
        .collect(Collectors.toList());
      return soldeImpaye.stream().mapToDouble(Double::doubleValue).sum();
    } else {
      List<Double> soldeImpaye = appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getAnneeAppelLoyer() == (annee) &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          period.getSoldeAppelLoyer() > 0 &&
          period
            .getBailLocationAppelLoyer()
            .getBienImmobilierOperation()
            .getChapitre()
            .getId() ==
          chapitre &&
          period.isCloturer() == false
        )
        .map(AppelLoyer::getSoldeAppelLoyer)
        .collect(Collectors.toList());
      return soldeImpaye.stream().mapToDouble(Double::doubleValue).sum();
    }
  }

  @Override
  public double payeParAnnee(int annee, Long idAgence, Long chapitre) {
    // Calcul par appel : max(0, montantLoyerBailLPeriode - soldeAppelLoyer)
    // Évite un résultat négatif lorsque le solde dépasse le montant de base
    if (chapitre == 0) {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getAnneeAppelLoyer() == annee &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          !period.isCloturer()
        )
        .mapToDouble(appel ->
          Math.max(0, appel.getMontantLoyerBailLPeriode() - Math.max(0, appel.getSoldeAppelLoyer()))
        )
        .sum();
    } else {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(period ->
          period.getAnneeAppelLoyer() == annee &&
          Objects.equals(period.getIdAgence(), idAgence) &&
          !period.isCloturer() &&
          Objects.equals(
            period
              .getBailLocationAppelLoyer()
              .getBienImmobilierOperation()
              .getChapitre()
              .getId(),
            chapitre
          )
        )
        .mapToDouble(appel ->
          Math.max(0, appel.getMontantLoyerBailLPeriode() - Math.max(0, appel.getSoldeAppelLoyer()))
        )
        .sum();
    }
  }

  @Override
  public Long nombreBauxImpaye(String periode, Long idAgence, Long chapitre) {
    if (chapitre == 0) {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(agence ->
          agence.getIdAgence() == idAgence &&
          Objects.equals(agence.getPeriodeAppelLoyer(), periode) &&
          !Objects.equals(agence.getStatusAppelLoyer(), "Soldé") &&
          agence.isCloturer() == false
        )
        .count();
    } else {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(agence ->
          agence.getIdAgence() == idAgence &&
          Objects.equals(agence.getPeriodeAppelLoyer(), periode) &&
          !Objects.equals(agence.getStatusAppelLoyer(), "Soldé") &&
          agence
            .getBailLocationAppelLoyer()
            .getBienImmobilierOperation()
            .getChapitre()
            .getId() ==
          chapitre &&
          agence.isCloturer() == false
        )
        .count();
    }
  }

  @Override
  public Long nombreBauxPaye(String periode, Long idAgence, Long chapitre) {
    if (chapitre == 0) {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(agence ->
          agence.getIdAgence() == idAgence &&
          Objects.equals(agence.getPeriodeAppelLoyer(), periode) &&
          Objects.equals(agence.getStatusAppelLoyer(), "Soldé") &&
          agence.isCloturer() == false
        )
        .count();
    } else {
      return appelLoyerRepository
        .findAll()
        .stream()
        .filter(agence ->
          agence.getIdAgence() == idAgence &&
          Objects.equals(agence.getPeriodeAppelLoyer(), periode) &&
          Objects.equals(agence.getStatusAppelLoyer(), "Soldé") &&
          agence
            .getBailLocationAppelLoyer()
            .getBienImmobilierOperation()
            .getChapitre()
            .getId() ==
          chapitre &&
          agence.isCloturer() == false
        )
        .count();
    }
  }

  @Override
  public double montantBeauxImpayer(
    String periode,
    Long idAgence,
    Long chapitre
  ) {
    return 0;
  }

  @Override
  public List<PeriodeDto> findAllPeriode(Long idAgence) {
    List<PeriodeDto> collectPeriodeDistinct = appelLoyerRepository
      .findAll()
      .stream()
      .filter(agence -> Objects.equals(agence.getIdAgence(), idAgence))
      .filter(this::isVisibleForQuittanceManagement)
      .map(gestimoWebMapper::fromPeriodeAppel)
      .sorted(Comparator.comparing(PeriodeDto::getPeriodeAppelLoyer))
      .distinct()
      .collect(Collectors.toList());
    return collectPeriodeDistinct;
  }

  @Override
  public boolean deleteAppelsByIdBail(Long idBail) {
    List<AppelLoyer> appelsloyer = appelLoyerRepository
      .findAll()
      .stream()
      .filter(bail ->
        Objects.equals(bail.getBailLocationAppelLoyer().getId(), idBail)
      )
      .collect(Collectors.toList());
    if (!appelsloyer.isEmpty()) {
      for (int index = 0; index < appelsloyer.size() - 1; index++) {
        System.out.println(appelsloyer.get(index));
        appelLoyerRepository.delete(appelsloyer.get(index));
      }
    } else {
      return false;
    }
    return true;
  }

  @Override
  public boolean sendSmsAppelLoyerGroupe(
    String periodeAppelLoyer,
    Long idAgence
  ) {
    List<AppelLoyer> appelLoyersFactureDtos = appelLoyerRepository
      .findAll()
      .stream()
      .filter(sold -> sold.isSolderAppelLoyer() == false)
      .filter(agen -> Objects.equals(agen.getIdAgence(), idAgence))
      .filter(perio -> perio.getPeriodeAppelLoyer().equals(periodeAppelLoyer))
      .collect(Collectors.toList());

    if (!appelLoyersFactureDtos.isEmpty()) {
      appelLoyersFactureDtos.forEach(ap -> {
        Utilisateur locataire = utilisateurRepository
          .findById(
            ap.getBailLocationAppelLoyer().getUtilisateurOperation().getId()
          )
          .orElse(null);
        try {
          String leTok = envoiSmsOrange.getTokenSmsOrange();
          AgenceImmobiliere agenceFound = agenceImmobiliereRepository
            .findById(ap.getIdAgence())
            .orElse(null);
          String message =
            "Bonjour, " +
            locataire.getGenre() +
            " " +
            locataire.getNom() +
            " votre agence " +
            agenceFound.getNomAgence().toUpperCase() +
            ", vous informe que le montant de " +
            ap.getSoldeAppelLoyer() +
            " F CFA correspondant au solde de votre loyer pour la periode de " +
            ap.getPeriodeLettre() +
            ", doit etre regler avant le " +
            ap.getDatePaiementPrevuAppelLoyer() +
            ". Merci de regulariser votre situation.";
          envoiSmsOrange.sendSms(
            leTok,
            message,
            "+2250000",
            locataire.getUsername(),
            "MAGISER"
          );
          System.out.println(
            "********************* Le toke toke est : " + leTok
          );
        } catch (Exception e) {
          System.err.println(e.getMessage());
        }
      });
      return true;
    }
    return false;
  }

  @Override
  public List<AppelLoyersFactureDto> reductionLoyerByPeriode(
    PourcentageAppelDto pourcentageAppelDto
  ) {
    List<AppelLoyersFactureDto> listAppels = findAllAppelLoyerByPeriode(
      pourcentageAppelDto.getPeriodeAppelLoyer(),
      pourcentageAppelDto.getIdAgence()
    );

    if (!listAppels.isEmpty()) {
      for (int i = 0; i < listAppels.size(); i++) {
        double montantApresReduction = 0.0;
        AppelLoyer appelLoyerTrouve = appelLoyerRepository
          .findById(listAppels.get(i).getId())
          .orElseThrow(null);
        montantApresReduction =
          listAppels.get(i).getMontantLoyerBailLPeriode() -
          listAppels.get(i).getMontantLoyerBailLPeriode() *
          pourcentageAppelDto.getTauxApplique() /
          100;

        appelLoyerTrouve.setAncienMontant(
          listAppels.get(i).getMontantLoyerBailLPeriode()
        );
        appelLoyerTrouve.setPourcentageReduction(
          pourcentageAppelDto.getTauxApplique()
        );
        appelLoyerTrouve.setMontantLoyerBailLPeriode(montantApresReduction);

        appelLoyerTrouve.setSoldeAppelLoyer(
          listAppels.get(i).getSoldeAppelLoyer() -
          listAppels.get(i).getMontantLoyerBailLPeriode() *
          pourcentageAppelDto.getTauxApplique() /
          100
        );
        appelLoyerTrouve.setMessageReduction(
          pourcentageAppelDto.getMessageReduction()
        );
        appelLoyerRepository.save(appelLoyerTrouve);
      }

      return listAppels;
    } else {
      return null;
    }
  }

  @Override
  public List<AppelLoyersFactureDto> modifierMontantLoyerAppel(
    Long currentIdMontantLoyerBail,
    double nouveauMontantLoyer,
    double ancienMontantLoyer,
    Long idBailLocation,
    Long idAgence,
    LocalDate datePriseEnCompDate
  ) {
    return null;
  }

  @Override
  public List<AppelLoyersFactureDto> listeDesloyerSuperieurAUnePeriode(
    String periode,
    Long idBail
  ) {
    AppelLoyersFactureDto appelLoyerTrouver = findByIdAndBail(periode, idBail);
    return appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer -> appelLoyer.getId() >= appelLoyerTrouver.getId())
      .filter(appelLoyer ->
        Objects.equals(appelLoyer.getBailLocationAppelLoyer().getId(), idBail)
      )
      .sorted(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer))
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
  }

  @Override
  public AppelLoyersFactureDto findByIdAndBail(String periode, Long idBail) {
    List<AppelLoyersFactureDto> factureLoyer = appelLoyerRepository
      .findAll()
      .stream()
      // .filter(appelLoyer -> !appelLoyer.isCloturer())
      .filter(appelLoyer -> appelLoyer.getPeriodeAppelLoyer().equals(periode))
      .filter(appelLoyer ->
        Objects.equals(appelLoyer.getBailLocationAppelLoyer().getId(), idBail)
      )
      .sorted(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer))
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
    return factureLoyer.get(0);
  }

  @Override
  public List<AppelLoyersFactureDto> supprimerLoyerPayer(
    Long idAppel,
    Long idBailLocation
  ) {
    List<AppelLoyersFactureDto> appelLoyerTrouver = appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer ->
        appelLoyer.getId() >= idAppel &&
        Objects.equals(
          appelLoyer.getBailLocationAppelLoyer().getId(),
          idBailLocation
        )
      )
      .sorted(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer))
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
    for (int i = 0; i < appelLoyerTrouver.size(); i++) {
      AppelLoyer appelLoyer = appelLoyerRepository
        .findById(appelLoyerTrouver.get(i).getId())
        .orElse(null);
      if (appelLoyer != null) {
        appelLoyer.setStatusAppelLoyer("Impayé");
        appelLoyer.setSolderAppelLoyer(false);
        appelLoyer.setSoldeAppelLoyer(appelLoyer.getMontantLoyerBailLPeriode());
        appelLoyerRepository.save(appelLoyer);

        if (appelLoyer != null && appelLoyer.isSolderAppelLoyer() == false) {
          List<EncaissementPrincipal> encaissementPrincipal = encaissementPrincipalRepository
            .findAll()
            .stream()
            .filter(encais ->
              encais.getAppelLoyerEncaissement().getId() == appelLoyer.getId()
            )
            .collect(Collectors.toList());
          if (encaissementPrincipal.size() > 0) {
            for (int j = 0; j < encaissementPrincipal.size(); j++) {
              encaissementPrincipalRepository.deleteById(
                encaissementPrincipal.get(j).getId()
              );
            }
          }
        }
      }
    }
    boolean sauve = miseAjourDesUnlockDesBaux(1L);
    return findAllAppelLoyerImpayerByBailId(idBailLocation);
  }

  @Override
  public AppelLoyersFactureDto findFirstAppelImpayerByBail(Long idBail) {
    List<AppelLoyersFactureDto> appelLoyerTrouver = appelLoyerRepository
      .findAll()
      .stream()
      .filter(appelLoyer ->
        appelLoyer.getBailLocationAppelLoyer().getId() == idBail &&
        appelLoyer.isSolderAppelLoyer() == false
      )
      .sorted(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer))
      .map(gestimoWebMapper::fromAppelLoyer)
      .collect(Collectors.toList());
    if (appelLoyerTrouver.size() > 0) {
      return appelLoyerTrouver.get(0);
    } else {
      return null;
    }
  }

  @Override
  public boolean miseAjourDesUnlockDesBaux(Long idAgence) {
    List<AppelLoyersFactureDto> findAllAgence = findAll(idAgence);

    if (findAllAgence.size() > 0) {
      for (int i = 0; i < findAllAgence.size(); i++) {
        AppelLoyer appelLoyer = appelLoyerRepository
          .findById(findAllAgence.get(i).getId())
          .orElse(null);

        if (appelLoyer != null) {
          appelLoyer.setUnLock(false);
          appelLoyerRepository.saveAndFlush(appelLoyer);
        }
      }

      List<Long> getAllIbOperationInAppel = getAllIbOperationInAppel(idAgence);

      if (getAllIbOperationInAppel.size() > 0) {
        for (int index = 0; index < getAllIbOperationInAppel.size(); index++) {
          AppelLoyersFactureDto findFirstAppelImpayerByBail = findFirstAppelImpayerByBail(
            getAllIbOperationInAppel.get(index)
          );

          if (findFirstAppelImpayerByBail != null) {
            AppelLoyer appelLoyerUp = appelLoyerRepository
              .findById(findFirstAppelImpayerByBail.getId())
              .orElse(null);
            if (appelLoyerUp != null) {
              appelLoyerUp.setUnLock(true);
              appelLoyerRepository.saveAndFlush(appelLoyerUp);
            }
          }
        }
      }

      return true;
    }

    return false;
  }

  @Override
  public List<Long> getAllIbOperationInAppel(Long idAgence) {
    List<Long> collectIdBailDistinct = operationRepository
      .findAll()
      .stream()
      .filter(operation -> operation.getIdAgence() == idAgence)
      .map(Operation::getId)
      .distinct()
      .sorted()
      .collect(Collectors.toList());
    return collectIdBailDistinct;
  }

  @Override
  public StatistiquePeriodeDto statistiquePeriode(
    String periode,
    Long idAgence,
    Long chapitre
  ) {
    double impayer = Math.max(0, impayeParPeriode(periode, idAgence, chapitre));
    double payer   = Math.max(0, payeParPeriode(periode, idAgence, chapitre));
    double totalLoyer = impayer + payer;
    double recou = 0;
    if (totalLoyer > 0) {
      recou = Math.min(100, Math.max(0, (payer / totalLoyer) * 100));
    }
    StatistiquePeriodeDto statistiquePeriodeDto = new StatistiquePeriodeDto();
    statistiquePeriodeDto.setImpayer(impayer);
    statistiquePeriodeDto.setPayer(payer);
    statistiquePeriodeDto.setPeriode(periode);
    statistiquePeriodeDto.setPeriodeFin(periode);
    statistiquePeriodeDto.setRecouvrement(recou);
    statistiquePeriodeDto.setTotalLoyer(totalLoyer);
    return statistiquePeriodeDto;
  }

  @Override
  public StatistiquePeriodeDto statistiqueAnnee(
    int annee,
    Long idAgence,
    Long chapitre
  ) {
    double impayer = Math.max(0, impayeParAnnee(annee, idAgence, chapitre));
    double payer   = Math.max(0, payeParAnnee(annee, idAgence, chapitre));
    double totalLoyer = impayer + payer;
    double recou = 0;
    if (totalLoyer > 0) {
      recou = Math.min(100, Math.max(0, (payer / totalLoyer) * 100));
    }
    StatistiquePeriodeDto statistiquePeriodeDto = new StatistiquePeriodeDto();
    statistiquePeriodeDto.setImpayer(impayer);
    statistiquePeriodeDto.setPayer(payer);
    statistiquePeriodeDto.setPeriode("" + annee);
    statistiquePeriodeDto.setPeriodeFin("" + annee);
    statistiquePeriodeDto.setRecouvrement(recou);
    statistiquePeriodeDto.setTotalLoyer(totalLoyer);
    return statistiquePeriodeDto;
  }

  @Override
  public int generateAppelsForPeriod(String periodeAppelLoyer, Long idAgence) {
    if (idAgence == null || periodeAppelLoyer == null || periodeAppelLoyer.isBlank()) {
      throw new InvalidEntityException(
        "L'agence et la periode sont obligatoires pour generer les appels de loyer.",
        ErrorCodes.APPELLOYER_NOT_VALID
      );
    }

    YearMonth periodeDemandee;
    try {
      periodeDemandee = YearMonth.parse(periodeAppelLoyer);
    } catch (DateTimeParseException exception) {
      throw new InvalidEntityException(
        "Le format de periode attendu est AAAA-MM.",
        ErrorCodes.APPELLOYER_NOT_VALID
      );
    }

    List<AppelLoyer> appelsManquants = bailLocationRepository
      .findAll()
      .stream()
      .filter(bail -> Objects.equals(bail.getIdAgence(), idAgence))
      .filter(BailLocation::isEnCoursBail)
      .filter(bail -> !bail.isArchiveBail())
      .filter(bail -> isWithinBailPeriod(bail, periodeDemandee))
      .flatMap(bail -> {
        Double montantActuel = findMontantLoyerActif(bail);
        if (montantActuel == null || montantActuel <= 0) {
          return java.util.stream.Stream.empty();
        }

        return buildMissingAppels(
          bail,
          idAgence,
          montantActuel,
          periodeDemandee,
          periodeDemandee
        )
          .stream();
      })
      .sorted(
        Comparator
          .comparing(AppelLoyer::getPeriodeAppelLoyer, Comparator.nullsLast(Comparator.naturalOrder()))
          .thenComparing(
            appel -> appel.getBailLocationAppelLoyer() != null
              ? appel.getBailLocationAppelLoyer().getId()
              : null,
            Comparator.nullsLast(Comparator.naturalOrder())
          )
      )
      .collect(Collectors.toList());

    if (!appelsManquants.isEmpty()) {
      appelLoyerRepository.saveAll(appelsManquants);
    }

    return appelsManquants.size();
  }

  private boolean isVisibleForQuittanceManagement(AppelLoyer appelLoyer) {
    if (appelLoyer == null || appelLoyer.isCloturer()) {
      return false;
    }

    BailLocation bailLocation = appelLoyer.getBailLocationAppelLoyer();
    if (bailLocation == null) {
      return false;
    }

    if (bailLocation.isEnCoursBail()) {
      return true;
    }

    LocalDate dateCloture = bailLocation.getDateCloture();
    LocalDate dateDebutAppel = appelLoyer.getDateDebutMoisAppelLoyer();
    if (dateCloture == null || dateDebutAppel == null) {
      return false;
    }

    YearMonth moisCloture = YearMonth.from(dateCloture);
    YearMonth moisAppel = YearMonth.from(dateDebutAppel);
    return moisAppel.isBefore(moisCloture);
  }

  private boolean isBeforeCurrentPeriod(
    AppelLoyer appelLoyer,
    YearMonth currentPeriod
  ) {
    YearMonth appelPeriod = extractYearMonth(appelLoyer);
    return appelPeriod != null && appelPeriod.isBefore(currentPeriod);
  }

  private YearMonth extractYearMonth(AppelLoyer appelLoyer) {
    if (appelLoyer == null) {
      return null;
    }

    if (appelLoyer.getDateDebutMoisAppelLoyer() != null) {
      return YearMonth.from(appelLoyer.getDateDebutMoisAppelLoyer());
    }

    if (
      appelLoyer.getPeriodeAppelLoyer() != null &&
      !appelLoyer.getPeriodeAppelLoyer().isBlank()
    ) {
      try {
        return YearMonth.parse(appelLoyer.getPeriodeAppelLoyer());
      } catch (DateTimeParseException exception) {
        return null;
      }
    }

    return null;
  }
}
