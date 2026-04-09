package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.PeriodeDto;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Utils.SmsOrangeConfig;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.AppelLoyerRepository;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementPrincipalRepository;
import com.bzdata.gestimospringbackend.repository.MontantLoyerBailRepository;
import com.bzdata.gestimospringbackend.repository.OperationRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AppelLoyerServiceImplTest {

  @Mock
  private EncaissementPrincipalRepository encaissementPrincipalRepository;

  @Mock
  private MontantLoyerBailRepository montantLoyerBailRepository;

  @Mock
  private BailLocationRepository bailLocationRepository;

  @Mock
  private AppelLoyerRepository appelLoyerRepository;

  @Mock
  private UtilisateurRepository utilisateurRepository;

  @Mock
  private GestimoWebMapperImpl gestimoWebMapper;

  @Mock
  private BienImmobilierRepository bienImmobilierRepository;

  @Mock
  private SmsOrangeConfig smsOrangeConfig;

  @Mock
  private OperationRepository operationRepository;

  @Mock
  private AgenceImmobiliereRepository agenceImmobiliereRepository;

  private AppelLoyerServiceImpl service;

  @BeforeEach
  void setUp() {
    service =
      new AppelLoyerServiceImpl(
        encaissementPrincipalRepository,
        montantLoyerBailRepository,
        bailLocationRepository,
        appelLoyerRepository,
        utilisateurRepository,
        gestimoWebMapper,
        bienImmobilierRepository,
        smsOrangeConfig,
        operationRepository,
        agenceImmobiliereRepository
      );
  }

  @Test
  void closedBailCurrentMonthIsHiddenFromAppelLoyerPeriodAndPeriodsList() {
    BailLocation closedBail = new BailLocation();
    closedBail.setId(90L);
    closedBail.setIdAgence(7L);
    closedBail.setEnCoursBail(false);
    closedBail.setDateCloture(LocalDate.of(2026, 4, 15));

    BailLocation activeBail = new BailLocation();
    activeBail.setId(91L);
    activeBail.setIdAgence(7L);
    activeBail.setEnCoursBail(true);

    AppelLoyer aprilAppel = new AppelLoyer();
    aprilAppel.setId(2L);
    aprilAppel.setIdAgence(7L);
    aprilAppel.setPeriodeAppelLoyer("2026-04");
    aprilAppel.setAnneeAppelLoyer(2026);
    aprilAppel.setDateDebutMoisAppelLoyer(LocalDate.of(2026, 4, 1));
    aprilAppel.setCloturer(false);
    aprilAppel.setBailLocationAppelLoyer(closedBail);

    AppelLoyer aprilActiveAppel = new AppelLoyer();
    aprilActiveAppel.setId(3L);
    aprilActiveAppel.setIdAgence(7L);
    aprilActiveAppel.setPeriodeAppelLoyer("2026-04");
    aprilActiveAppel.setAnneeAppelLoyer(2026);
    aprilActiveAppel.setDateDebutMoisAppelLoyer(LocalDate.of(2026, 4, 1));
    aprilActiveAppel.setCloturer(false);
    aprilActiveAppel.setBailLocationAppelLoyer(activeBail);

    when(bailLocationRepository.findAll()).thenReturn(List.of(closedBail, activeBail));
    when(appelLoyerRepository.findAll()).thenReturn(List.of(aprilAppel, aprilActiveAppel));
    when(gestimoWebMapper.fromAppelLoyer(any(AppelLoyer.class))).thenAnswer(invocation -> {
      AppelLoyer appel = invocation.getArgument(0);
      AppelLoyersFactureDto dto = new AppelLoyersFactureDto();
      dto.setId(appel.getId());
      dto.setPeriodeAppelLoyer(appel.getPeriodeAppelLoyer());
      return dto;
    });
    when(gestimoWebMapper.fromPeriodeAppel(any(AppelLoyer.class))).thenAnswer(invocation -> {
      AppelLoyer appel = invocation.getArgument(0);
      PeriodeDto dto = new PeriodeDto();
      dto.setPeriodeAppelLoyer(appel.getPeriodeAppelLoyer());
      dto.setPeriodeLettre(appel.getPeriodeAppelLoyer());
      return dto;
    });

    List<AppelLoyersFactureDto> appelsApril = service.findAllAppelLoyerByPeriode(
      "2026-04",
      7L
    );
    List<PeriodeDto> periodes = service.listOfPerodesByAnnee(2026, 7L);

    assertEquals(1, appelsApril.size());
    assertEquals(3L, appelsApril.get(0).getId());
    assertEquals("2026-04", appelsApril.get(0).getPeriodeAppelLoyer());
    assertEquals(1, periodes.size());
    assertEquals("2026-04", periodes.get(0).getPeriodeAppelLoyer());
  }

  @Test
  void relanceListOnlyContainsUnpaidPeriodsBeforeCurrentMonth() {
    BailLocation activeBail = new BailLocation();
    activeBail.setId(91L);
    activeBail.setIdAgence(7L);
    activeBail.setEnCoursBail(true);

    AppelLoyer oldUnpaidAppel = new AppelLoyer();
    oldUnpaidAppel.setId(10L);
    oldUnpaidAppel.setIdAgence(7L);
    oldUnpaidAppel.setPeriodeAppelLoyer("2026-03");
    oldUnpaidAppel.setDateDebutMoisAppelLoyer(LocalDate.of(2026, 3, 1));
    oldUnpaidAppel.setSoldeAppelLoyer(250000.0);
    oldUnpaidAppel.setSolderAppelLoyer(false);
    oldUnpaidAppel.setCloturer(false);
    oldUnpaidAppel.setBailLocationAppelLoyer(activeBail);

    AppelLoyer currentUnpaidAppel = new AppelLoyer();
    currentUnpaidAppel.setId(11L);
    currentUnpaidAppel.setIdAgence(7L);
    currentUnpaidAppel.setPeriodeAppelLoyer("2026-04");
    currentUnpaidAppel.setDateDebutMoisAppelLoyer(LocalDate.of(2026, 4, 1));
    currentUnpaidAppel.setSoldeAppelLoyer(250000.0);
    currentUnpaidAppel.setSolderAppelLoyer(false);
    currentUnpaidAppel.setCloturer(false);
    currentUnpaidAppel.setBailLocationAppelLoyer(activeBail);

    AppelLoyer paidOldAppel = new AppelLoyer();
    paidOldAppel.setId(12L);
    paidOldAppel.setIdAgence(7L);
    paidOldAppel.setPeriodeAppelLoyer("2026-02");
    paidOldAppel.setDateDebutMoisAppelLoyer(LocalDate.of(2026, 2, 1));
    paidOldAppel.setSoldeAppelLoyer(0.0);
    paidOldAppel.setSolderAppelLoyer(true);
    paidOldAppel.setCloturer(false);
    paidOldAppel.setBailLocationAppelLoyer(activeBail);

    when(bailLocationRepository.findAll()).thenReturn(List.of(activeBail));
    when(appelLoyerRepository.findAll()).thenReturn(
      List.of(oldUnpaidAppel, currentUnpaidAppel, paidOldAppel)
    );
    when(gestimoWebMapper.fromAppelLoyer(any(AppelLoyer.class))).thenAnswer(invocation -> {
      AppelLoyer appel = invocation.getArgument(0);
      AppelLoyersFactureDto dto = new AppelLoyersFactureDto();
      dto.setId(appel.getId());
      dto.setPeriodeAppelLoyer(appel.getPeriodeAppelLoyer());
      return dto;
    });

    List<AppelLoyersFactureDto> relances = service.findAllForRelance(7L);

    assertEquals(1, relances.size());
    assertEquals(10L, relances.get(0).getId());
    assertEquals("2026-03", relances.get(0).getPeriodeAppelLoyer());
  }
}
