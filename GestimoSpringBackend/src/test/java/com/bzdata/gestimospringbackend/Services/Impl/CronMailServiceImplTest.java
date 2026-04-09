package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.CronMailDto;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.CronMail;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.PrintService;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.CronMailRepository;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class CronMailServiceImplTest {

  @Mock
  private CronMailRepository cronMailRepository;

  @Mock
  private GestimoWebMapperImpl gestimoWebMapperImpl;

  @Mock
  private AppelLoyerService appelLoyerService;

  @Mock
  private PrintService printService;

  @Mock
  private BailLocationRepository bailLocationRepository;

  @Mock
  private AgenceImmobiliereRepository agenceImmobiliereRepository;

  @Mock
  private JavaMailSender mailSender;

  private CronMailServiceImpl service;

  @BeforeEach
  void setUp() {
    service =
      new CronMailServiceImpl(
        cronMailRepository,
        gestimoWebMapperImpl,
        appelLoyerService,
        printService,
        bailLocationRepository,
        agenceImmobiliereRepository,
        mailSender
      );
    ReflectionTestUtils.setField(service, "mailFrom", "noreply@gestimo.local");
  }

  @Test
  void getConfigurationByAgenceReturnsDefaultConfigurationWhenNoneExists() {
    when(cronMailRepository.findTopByIdAgenceOrderByIdDesc(7L)).thenReturn(Optional.empty());
    when(gestimoWebMapperImpl.fromCronMail(any(CronMail.class))).thenAnswer(invocation -> {
      CronMail cronMail = invocation.getArgument(0);
      return new CronMailDto(
        cronMail.getId(),
        cronMail.getIdAgence(),
        cronMail.getManagerEmail(),
        cronMail.getDayOfMonth(),
        cronMail.getExecutionHour(),
        cronMail.getExecutionMinute(),
        cronMail.isEnabled(),
        cronMail.getNextExecutionAt(),
        cronMail.getLastExecutionAt(),
        cronMail.getLastExecutionPeriod()
      );
    });

    CronMailDto result = service.getConfigurationByAgence(7L);

    assertEquals(7L, result.getIdAgence());
    assertEquals(1, result.getDayOfMonth());
    assertEquals(8, result.getExecutionHour());
    assertEquals(0, result.getExecutionMinute());
    assertFalse(result.isEnabled());
  }

  @Test
  void processDueConfigurationsExecutesDueConfigurationAndSchedulesNextMonth() throws Exception {
    LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
    String targetPeriod = YearMonth.from(now).plusMonths(1).toString();

    CronMail configuration = new CronMail();
    configuration.setId(4L);
    configuration.setIdAgence(1L);
    configuration.setManagerEmail("gerante@agence.com");
    configuration.setDayOfMonth(1);
    configuration.setExecutionHour(8);
    configuration.setExecutionMinute(0);
    configuration.setEnabled(true);
    configuration.setNextExecutionAt(now.minusMinutes(2));

    BailLocation activeBail = new BailLocation();
    activeBail.setId(9L);
    activeBail.setIdAgence(1L);
    activeBail.setEnCoursBail(true);
    activeBail.setArchiveBail(false);
    activeBail.setDateDebut(LocalDate.of(now.getYear(), now.getMonth(), 1));
    activeBail.setDateFin(LocalDate.of(now.getYear() + 1, now.getMonth(), 1));

    AgenceImmobiliere agence = new AgenceImmobiliere();
    agence.setNomAgence("RESIDENCE SEVE");

    MimeMessage mimeMessage = new JavaMailSenderImpl().createMimeMessage();

    when(cronMailRepository.findAllByEnabledTrueOrderByIdDesc()).thenReturn(List.of(configuration));
    when(appelLoyerService.generateAppelsForPeriod(eq(targetPeriod), eq(1L))).thenReturn(5);
    when(bailLocationRepository.findAll()).thenReturn(List.of(activeBail));
    when(agenceImmobiliereRepository.findById(1L)).thenReturn(Optional.of(agence));
    when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    doNothing().when(mailSender).send(any(MimeMessage.class));
    when(printService.quittancePeriodeString(eq(targetPeriod), eq(1L))).thenReturn(new byte[] { 1, 2, 3 });
    when(cronMailRepository.save(any(CronMail.class))).thenAnswer(invocation -> invocation.getArgument(0));

    int processedCount = service.processDueConfigurations();

    assertEquals(1, processedCount);
    assertEquals(targetPeriod, configuration.getLastExecutionPeriod());
    assertNotNull(configuration.getLastExecutionAt());
    assertNotNull(configuration.getNextExecutionAt());
    assertTrue(configuration.getNextExecutionAt().isAfter(now));
    verify(appelLoyerService).generateAppelsForPeriod(targetPeriod, 1L);
    verify(printService).quittancePeriodeString(targetPeriod, 1L);
    verify(mailSender).send(any(MimeMessage.class));
  }
}
