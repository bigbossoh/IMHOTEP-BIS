package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementPayloadDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementPrincipalDTO;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import com.bzdata.gestimospringbackend.Models.Villa;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Utils.SmsOrangeConfig;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.enumeration.EntiteOperation;
import com.bzdata.gestimospringbackend.enumeration.ModePaiement;
import com.bzdata.gestimospringbackend.enumeration.OperationType;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.AppelLoyerRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementPrincipalRepository;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EncaissementPrincipalServiceImplTest {

  @Mock
  private AppelLoyerRepository appelLoyerRepository;

  @Mock
  private GestimoWebMapperImpl gestimoWebMapper;

  @Mock
  private UtilisateurRepository utilisateurRepository;

  @Mock
  private AppelLoyerService appelLoyerService;

  @Mock
  private AgenceImmobiliereRepository agenceImmobiliereRepository;

  @Mock
  private EncaissementPrincipalRepository encaissementPrincipalRepository;

  @Mock
  private BailMapperImpl bailMapperImpl;

  @Mock
  private SmsOrangeConfig envoiSmsOrange;

  private EncaissementPrincipalServiceImpl service;
  private final List<EncaissementPrincipal> savedEncaissements = new ArrayList<>();
  private final AtomicLong encaissementSequence = new AtomicLong(10L);

  @BeforeEach
  void setUp() throws Exception {
    service =
      new EncaissementPrincipalServiceImpl(
        appelLoyerRepository,
        gestimoWebMapper,
        utilisateurRepository,
        appelLoyerService,
        agenceImmobiliereRepository,
        encaissementPrincipalRepository,
        bailMapperImpl,
        envoiSmsOrange
      );

    when(appelLoyerRepository.save(any(AppelLoyer.class))).thenAnswer(invocation ->
      invocation.getArgument(0)
    );
    when(encaissementPrincipalRepository.save(any(EncaissementPrincipal.class)))
      .thenAnswer(invocation -> {
        EncaissementPrincipal encaissement = invocation.getArgument(0);
        if (encaissement.getId() == null) {
          encaissement.setId(encaissementSequence.getAndIncrement());
        }
        savedEncaissements.add(encaissement);
        return encaissement;
      });
    when(encaissementPrincipalRepository.findAll()).thenAnswer(invocation ->
      new ArrayList<>(savedEncaissements)
    );
    when(gestimoWebMapper.fromEncaissementPrincipal(any(EncaissementPrincipal.class)))
      .thenAnswer(invocation -> {
        EncaissementPrincipal encaissement = invocation.getArgument(0);
        EncaissementPrincipalDTO dto = new EncaissementPrincipalDTO();
        dto.setId(encaissement.getId());
        dto.setMontantEncaissement(encaissement.getMontantEncaissement());
        dto.setSoldeEncaissement(encaissement.getSoldeEncaissement());
        AppelLoyersFactureDto appelDto = new AppelLoyersFactureDto();
        appelDto.setId(encaissement.getAppelLoyerEncaissement().getId());
        appelDto.setPeriodeAppelLoyer(
          encaissement.getAppelLoyerEncaissement().getPeriodeAppelLoyer()
        );
        dto.setAppelLoyersFactureDto(appelDto);
        return dto;
      });

    when(appelLoyerService.miseAjourDesUnlockDesBaux(any(Long.class))).thenReturn(true);
    when(envoiSmsOrange.getTokenSmsOrange()).thenReturn("token");
  }

  @Test
  void shouldSpreadAdvancePaymentAcrossFiveConsecutivePeriods() {
    Villa bien = new Villa();
    bien.setId(501L);

    Utilisateur locataire = new Utilisateur();
    locataire.setId(21L);
    locataire.setUsername("0707070707");

    BailLocation bailLocation = new BailLocation();
    bailLocation.setId(301L);
    bailLocation.setIdAgence(1L);
    bailLocation.setDesignationBail("BAIL TEST");
    bailLocation.setBienImmobilierOperation(bien);
    bailLocation.setUtilisateurOperation(locataire);

    List<AppelLoyer> appels = List.of(
      buildAppel(1L, "2026-04", LocalDate.of(2026, 4, 1), bailLocation),
      buildAppel(2L, "2026-05", LocalDate.of(2026, 5, 1), bailLocation),
      buildAppel(3L, "2026-06", LocalDate.of(2026, 6, 1), bailLocation),
      buildAppel(4L, "2026-07", LocalDate.of(2026, 7, 1), bailLocation),
      buildAppel(5L, "2026-08", LocalDate.of(2026, 8, 1), bailLocation)
    );

    when(appelLoyerRepository.findById(1L)).thenReturn(Optional.of(appels.get(0)));
    when(appelLoyerRepository.findAllByBailLocationAppelLoyer(bailLocation))
      .thenReturn(appels);

    EncaissementPayloadDto payload = new EncaissementPayloadDto();
    payload.setIdAgence(1L);
    payload.setIdCreateur(99L);
    payload.setIdAppelLoyer(1L);
    payload.setModePaiement(ModePaiement.ESPESE_MAGISER);
    payload.setOperationType(OperationType.CREDIT);
    payload.setEntiteOperation(EntiteOperation.MAGISER);
    payload.setMontantEncaissement(1_000_000d);
    payload.setTypePaiement("ENCAISSEMENT_INDIVIDUEL");

    List<EncaissementPrincipalDTO> result = service.saveEncaissementAvecRetourDeList(payload);

    assertEquals(5, result.size());
    assertEquals(5, savedEncaissements.size());
    assertTrue(
      savedEncaissements
        .stream()
        .allMatch(encaissement -> encaissement.getMontantEncaissement() == 200_000d)
    );
    assertTrue(
      appels
        .stream()
        .allMatch(appel -> appel.isSolderAppelLoyer() && appel.getSoldeAppelLoyer() == 0d)
    );
    assertEquals(
      List.of("2026-04", "2026-05", "2026-06", "2026-07", "2026-08"),
      savedEncaissements
        .stream()
        .map(encaissement -> encaissement.getAppelLoyerEncaissement().getPeriodeAppelLoyer())
        .toList()
    );
  }

  private AppelLoyer buildAppel(
    Long id,
    String periode,
    LocalDate dateDebut,
    BailLocation bailLocation
  ) {
    AppelLoyer appelLoyer = new AppelLoyer();
    appelLoyer.setId(id);
    appelLoyer.setIdAgence(1L);
    appelLoyer.setPeriodeAppelLoyer(periode);
    appelLoyer.setPeriodeLettre(periode);
    appelLoyer.setDateDebutMoisAppelLoyer(dateDebut);
    appelLoyer.setMontantLoyerBailLPeriode(200_000d);
    appelLoyer.setSoldeAppelLoyer(200_000d);
    appelLoyer.setStatusAppelLoyer("Impayé");
    appelLoyer.setSolderAppelLoyer(false);
    appelLoyer.setBailLocationAppelLoyer(bailLocation);
    return appelLoyer;
  }
}
