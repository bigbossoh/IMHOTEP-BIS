package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.BailClotureRequestDto;
import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.BienImmobilierService;
import com.bzdata.gestimospringbackend.Services.MontantLoyerBailService;
import com.bzdata.gestimospringbackend.Services.OperationService;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.AppelLoyerRepository;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementPrincipalRepository;
import com.bzdata.gestimospringbackend.repository.MontantLoyerBailRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BailServiceImplTest {

  @Mock
  private MontantLoyerBailService montantLoyerBailService;

  @Mock
  private BailLocationRepository bailLocationRepository;

  @Mock
  private AppelLoyerService appelLoyerService;

  @Mock
  private MontantLoyerBailRepository montantLoyerBailRepository;

  @Mock
  private BienImmobilierRepository bienImmobilierRepository;

  @Mock
  private BailMapperImpl bailMapperImpl;

  @Mock
  private GestimoWebMapperImpl gestimoWebMapperImpl;

  @Mock
  private UtilisateurRepository utilisateurRepository;

  @Mock
  private AppelLoyerRepository appelLoyerRepository;

  @Mock
  private EncaissementPrincipalRepository encaissementPrincipalRepository;

  @Mock
  private BienImmobilierService bienImmobilierService;

  @Mock
  private OperationService operationService;

  private BailServiceImpl service;

  @BeforeEach
  void setUp() {
    service =
      new BailServiceImpl(
        montantLoyerBailService,
        bailLocationRepository,
        appelLoyerService,
        montantLoyerBailRepository,
        bienImmobilierRepository,
        bailMapperImpl,
        gestimoWebMapperImpl,
        utilisateurRepository,
        appelLoyerRepository,
        encaissementPrincipalRepository,
        bienImmobilierService,
        bailMapperImpl,
        operationService
      );
  }

  @Test
  void closeBail_keepsCurrentUnpaidMonthWhenAccountIsNotSettled() {
    LocalDate today = LocalDate.now();
    LocalDate currentMonthStart = today.withDayOfMonth(1);
    LocalDate futureMonthStart = currentMonthStart.plusMonths(1);

    BailLocation bail = new BailLocation();
    bail.setId(12L);
    bail.setIdAgence(7L);
    bail.setEnCoursBail(true);

    Appartement bien = new Appartement();
    bien.setId(20L);
    bien.setIdAgence(7L);
    bien.setOccupied(true);

    MontantLoyerBail montantActif = new MontantLoyerBail();
    montantActif.setStatusLoyer(true);
    montantActif.setNouveauMontantLoyer(100000D);

    AppelLoyer currentMonthAppel = new AppelLoyer();
    currentMonthAppel.setId(100L);
    currentMonthAppel.setBailLocationAppelLoyer(bail);
    currentMonthAppel.setDateDebutMoisAppelLoyer(currentMonthStart);
    currentMonthAppel.setMontantLoyerBailLPeriode(100000D);
    currentMonthAppel.setSoldeAppelLoyer(100000D);
    currentMonthAppel.setSolderAppelLoyer(false);

    AppelLoyer futureMonthAppel = new AppelLoyer();
    futureMonthAppel.setId(101L);
    futureMonthAppel.setBailLocationAppelLoyer(bail);
    futureMonthAppel.setDateDebutMoisAppelLoyer(futureMonthStart);
    futureMonthAppel.setMontantLoyerBailLPeriode(100000D);
    futureMonthAppel.setSoldeAppelLoyer(100000D);
    futureMonthAppel.setSolderAppelLoyer(false);

    when(bailLocationRepository.findById(12L)).thenReturn(Optional.of(bail));
    when(bienImmobilierService.findBienByBailEnCours(12L)).thenReturn(bien);
    when(montantLoyerBailRepository.findByBailLocation(bail)).thenReturn(List.of(montantActif));
    when(appelLoyerRepository.findAllByBailLocationAppelLoyer(bail))
      .thenReturn(List.of(currentMonthAppel, futureMonthAppel));
    when(encaissementPrincipalRepository.findAll()).thenReturn(List.of());
    when(operationService.getAllOperation(7L)).thenReturn(List.of());

    service.closeBail(12L, false, null);

    assertFalse(bail.isEnCoursBail());
    assertEquals(today, bail.getDateCloture());
    assertFalse(bien.isOccupied());
    verify(appelLoyerRepository).delete(futureMonthAppel);
    verify(appelLoyerRepository, never()).delete(currentMonthAppel);
  }

  @Test
  void closeBail_deletesCurrentAndFutureUnusedMonthsWhenAccountIsSettled() {
    LocalDate today = LocalDate.now();
    LocalDate currentMonthStart = today.withDayOfMonth(1);
    LocalDate futureMonthStart = currentMonthStart.plusMonths(1);

    BailLocation bail = new BailLocation();
    bail.setId(18L);
    bail.setIdAgence(9L);
    bail.setEnCoursBail(true);

    Appartement bien = new Appartement();
    bien.setId(25L);
    bien.setIdAgence(9L);
    bien.setOccupied(true);

    MontantLoyerBail montantActif = new MontantLoyerBail();
    montantActif.setStatusLoyer(true);
    montantActif.setNouveauMontantLoyer(150000D);

    AppelLoyer currentMonthAppel = new AppelLoyer();
    currentMonthAppel.setId(200L);
    currentMonthAppel.setBailLocationAppelLoyer(bail);
    currentMonthAppel.setDateDebutMoisAppelLoyer(currentMonthStart);
    currentMonthAppel.setMontantLoyerBailLPeriode(150000D);
    currentMonthAppel.setSoldeAppelLoyer(150000D);
    currentMonthAppel.setSolderAppelLoyer(false);

    AppelLoyer futureMonthAppel = new AppelLoyer();
    futureMonthAppel.setId(201L);
    futureMonthAppel.setBailLocationAppelLoyer(bail);
    futureMonthAppel.setDateDebutMoisAppelLoyer(futureMonthStart);
    futureMonthAppel.setMontantLoyerBailLPeriode(150000D);
    futureMonthAppel.setSoldeAppelLoyer(150000D);
    futureMonthAppel.setSolderAppelLoyer(false);

    when(bailLocationRepository.findById(18L)).thenReturn(Optional.of(bail));
    when(bienImmobilierService.findBienByBailEnCours(18L)).thenReturn(bien);
    when(montantLoyerBailRepository.findByBailLocation(bail)).thenReturn(List.of(montantActif));
    when(appelLoyerRepository.findAllByBailLocationAppelLoyer(bail))
      .thenReturn(List.of(currentMonthAppel, futureMonthAppel));
    when(encaissementPrincipalRepository.findAll()).thenReturn(List.of());
    when(operationService.getAllOperation(9L)).thenReturn(List.of());

    service.closeBail(18L, true, null);

    assertTrue(bail.getDateCloture() != null);
    assertFalse(bien.isOccupied());
    verify(appelLoyerRepository).delete(currentMonthAppel);
    verify(appelLoyerRepository).delete(futureMonthAppel);
  }

  @Test
  void closeBail_keepsSelectedRecoveryPeriodAndDeletesOtherUnusedMonths() {
    LocalDate today = LocalDate.now();
    LocalDate currentMonthStart = today.withDayOfMonth(1);
    LocalDate futureMonthStart = currentMonthStart.plusMonths(1);

    BailLocation bail = new BailLocation();
    bail.setId(22L);
    bail.setIdAgence(10L);
    bail.setEnCoursBail(true);

    Appartement bien = new Appartement();
    bien.setId(31L);
    bien.setIdAgence(10L);
    bien.setOccupied(true);

    MontantLoyerBail montantActif = new MontantLoyerBail();
    montantActif.setStatusLoyer(true);
    montantActif.setNouveauMontantLoyer(175000D);

    AppelLoyer currentMonthAppel = new AppelLoyer();
    currentMonthAppel.setId(300L);
    currentMonthAppel.setPeriodeAppelLoyer(String.format("%d-%02d", today.getYear(), today.getMonthValue()));
    currentMonthAppel.setBailLocationAppelLoyer(bail);
    currentMonthAppel.setDateDebutMoisAppelLoyer(currentMonthStart);
    currentMonthAppel.setMontantLoyerBailLPeriode(175000D);
    currentMonthAppel.setSoldeAppelLoyer(175000D);
    currentMonthAppel.setSolderAppelLoyer(false);

    AppelLoyer futureMonthAppel = new AppelLoyer();
    futureMonthAppel.setId(301L);
    futureMonthAppel.setPeriodeAppelLoyer(futureMonthStart.getYear() + "-" + String.format("%02d", futureMonthStart.getMonthValue()));
    futureMonthAppel.setBailLocationAppelLoyer(bail);
    futureMonthAppel.setDateDebutMoisAppelLoyer(futureMonthStart);
    futureMonthAppel.setMontantLoyerBailLPeriode(175000D);
    futureMonthAppel.setSoldeAppelLoyer(175000D);
    futureMonthAppel.setSolderAppelLoyer(false);

    when(bailLocationRepository.findById(22L)).thenReturn(Optional.of(bail));
    when(bienImmobilierService.findBienByBailEnCours(22L)).thenReturn(bien);
    when(montantLoyerBailRepository.findByBailLocation(bail)).thenReturn(List.of(montantActif));
    when(appelLoyerRepository.findAllByBailLocationAppelLoyer(bail))
      .thenReturn(List.of(currentMonthAppel, futureMonthAppel));
    when(encaissementPrincipalRepository.findAll()).thenReturn(List.of());
    when(operationService.getAllOperation(10L)).thenReturn(List.of());

    service.closeBail(
      22L,
      null,
      new BailClotureRequestDto(List.of(currentMonthAppel.getPeriodeAppelLoyer()))
    );

    verify(appelLoyerRepository, never()).delete(currentMonthAppel);
    verify(appelLoyerRepository).delete(futureMonthAppel);
  }
}
