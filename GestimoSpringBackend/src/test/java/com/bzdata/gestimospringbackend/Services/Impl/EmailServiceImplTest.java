package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.PrintService;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.util.List;
import java.util.Properties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

  @Mock
  private JavaMailSender mailSender;

  @Mock
  private AppelLoyerService appelLoyerService;

  @Mock
  private PrintService printService;

  private EmailServiceImpl service;

  @BeforeEach
  void setUp() {
    service = new EmailServiceImpl(mailSender, appelLoyerService, printService);
    ReflectionTestUtils.setField(service, "mailFrom", "info@molibetycenter.com");
  }

  @Test
  void sendMailWithAttachmentRetriesAfterTransientFailure() {
    MimeMessage firstMessage = new MimeMessage(Session.getInstance(new Properties()));
    MimeMessage secondMessage = new MimeMessage(Session.getInstance(new Properties()));

    when(mailSender.createMimeMessage()).thenReturn(firstMessage, secondMessage);
    doThrow(new RuntimeException("smtp down"))
      .doNothing()
      .when(mailSender)
      .send(any(MimeMessage.class));

    boolean sent = service.sendMailWithAttachment(
      "2026-04",
      "locataire@example.com",
      "Relance",
      "Contenu",
      null
    );

    assertTrue(sent);
    verify(mailSender).send(firstMessage);
    verify(mailSender).send(secondMessage);
  }

  @Test
  void sendMailWithAttachmentReturnsFalseWhenRecipientIsMissing() {
    boolean sent = service.sendMailWithAttachment("2026-04", "   ", "Relance", "Contenu", null);

    assertFalse(sent);
    verify(mailSender, never()).createMimeMessage();
    verify(mailSender, never()).send(any(MimeMessage.class));
  }

  @Test
  void sendMailWithAttachmentSucceedsEvenWhenMailFromIsBlank() {
    ReflectionTestUtils.setField(service, "mailFrom", "   ");
    MimeMessage message = new MimeMessage(Session.getInstance(new Properties()));

    when(mailSender.createMimeMessage()).thenReturn(message);
    doNothing().when(mailSender).send(message);

    boolean sent = service.sendMailWithAttachment(
      "2026-04",
      "locataire@example.com",
      "Relance",
      "Contenu",
      null
    );

    assertTrue(sent);
    verify(mailSender).send(message);
  }

  @Test
  void sendMailRelanceGlobaleLoyerSendsSingleMailWithAccountStatement() {
    AppelLoyersFactureDto february = buildRelance(
      10L,
      "2026-02",
      "fevrier 2026",
      LocalDate.of(2026, 2, 1),
      200_000d
    );
    AppelLoyersFactureDto march = buildRelance(
      11L,
      "2026-03",
      "mars 2026",
      LocalDate.of(2026, 3, 1),
      200_000d
    );

    MimeMessage message = new MimeMessage(Session.getInstance(new Properties()));
    when(appelLoyerService.findById(10L)).thenReturn(february);
    when(appelLoyerService.findAllForRelance(1L)).thenReturn(List.of(march, february));
    when(printService.releveCompteLocataireImpaye(1L, 22L)).thenReturn("pdf".getBytes());
    when(mailSender.createMimeMessage()).thenReturn(message);
    doNothing().when(mailSender).send(message);

    boolean sent = service.sendMailRelanceGlobaleLoyer(10L);

    assertTrue(sent);
    verify(printService).releveCompteLocataireImpaye(1L, 22L);
    verify(mailSender).send(message);
  }

  private AppelLoyersFactureDto buildRelance(
    Long id,
    String periode,
    String periodeLettre,
    LocalDate dateDebut,
    double solde
  ) {
    AppelLoyersFactureDto dto = new AppelLoyersFactureDto();
    dto.setId(id);
    dto.setIdAgence(1L);
    dto.setIdLocataire(22L);
    dto.setEmailLocatire("locataire@example.com");
    dto.setNomLocataire("Kouame");
    dto.setPrenomLocataire("Awa");
    dto.setGenreLocataire("Madame");
    dto.setNomAgence("Molibety Center");
    dto.setPeriodeAppelLoyer(periode);
    dto.setPeriodeLettre(periodeLettre);
    dto.setDateDebutMoisAppelLoyer(dateDebut);
    dto.setSoldeAppelLoyer(solde);
    return dto;
  }
}
