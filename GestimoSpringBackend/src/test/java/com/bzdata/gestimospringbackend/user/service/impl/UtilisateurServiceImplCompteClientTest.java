package com.bzdata.gestimospringbackend.user.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Role;
import com.bzdata.gestimospringbackend.Services.Impl.MailContentBuilder;
import com.bzdata.gestimospringbackend.Services.Impl.MailService;
import com.bzdata.gestimospringbackend.common.security.repository.VerificationTokenRepository;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementUtilisteurRepository;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.RoleRepository;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.PasswordResetTokenRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UtilisateurServiceImplCompteClientTest {

  @Mock
  private AgenceImmobiliereRepository agenceImmobiliereRepository;

  @Mock
  private UtilisateurRepository utilisateurRepository;

  @Mock
  private PasswordEncoder passwordEncoderUser;

  @Mock
  private VerificationTokenRepository verificationTokenRepository;

  @Mock
  private PasswordResetTokenRepository passwordResetTokenRepository;

  @Mock
  private RoleRepository roleRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private MailService mailService;

  @Mock
  private MailContentBuilder mailContentBuilder;

  @Mock
  private GestimoWebMapperImpl gestimoWebMapperImpl;

  @Mock
  private BailLocationRepository bailLocationRepository;

  @Mock
  private BailMapperImpl bailMapper;

  @Mock
  private EtablissementRepository etablissementRepository;

  @Mock
  private EtablissementUtilisteurRepository etablissementUtilisteurRepository;

  private UtilisateurServiceImpl service;

  @BeforeEach
  void setUp() {
    service =
      new UtilisateurServiceImpl(
        agenceImmobiliereRepository,
        utilisateurRepository,
        passwordEncoderUser,
        verificationTokenRepository,
        passwordResetTokenRepository,
        roleRepository,
        passwordEncoder,
        mailService,
        mailContentBuilder,
        gestimoWebMapperImpl,
        bailLocationRepository,
        bailMapper,
        etablissementRepository,
        etablissementUtilisteurRepository
      );
  }

  @Test
  void shouldListActiveTenantAccountsIncludingClosedBailsForCompteClient() {
    Utilisateur activeTenant = buildTenant(1L, true);
    Utilisateur inactiveTenant = buildTenant(2L, false);

    BailLocation activeBail = new BailLocation();
    activeBail.setId(101L);
    activeBail.setIdAgence(7L);
    activeBail.setUtilisateurOperation(activeTenant);
    activeBail.setEnCoursBail(true);

    BailLocation closedBail = new BailLocation();
    closedBail.setId(102L);
    closedBail.setIdAgence(7L);
    closedBail.setUtilisateurOperation(activeTenant);
    closedBail.setEnCoursBail(false);
    closedBail.setDateCloture(LocalDate.of(2026, 4, 2));
    closedBail.setListAppelsLoyers(List.of(buildAppel(801L, "2026-03", "Mars 2026", 85000d, 0d)));

    BailLocation inactiveTenantBail = new BailLocation();
    inactiveTenantBail.setId(103L);
    inactiveTenantBail.setIdAgence(7L);
    inactiveTenantBail.setUtilisateurOperation(inactiveTenant);
    inactiveTenantBail.setEnCoursBail(false);

    when(bailLocationRepository.findAll())
      .thenReturn(List.of(closedBail, inactiveTenantBail, activeBail));

    when(bailMapper.fromOperationBailLocation(activeBail))
      .thenReturn(buildLocataireDto(101L, "ALPHA / VILLA-01", 95000d));
    when(bailMapper.fromOperationBailLocation(closedBail))
      .thenReturn(buildLocataireDto(102L, "BETA / VILLA-02", 0d));

    List<LocataireEncaisDTO> result = service.listOfLocataireCompteClient(7L);

    assertEquals(2, result.size());

    LocataireEncaisDTO first = result.get(0);
    assertEquals(101L, first.getIdBail());
    assertTrue(first.isBailEnCours());
    assertEquals("EN_COURS", first.getStatutBail());

    LocataireEncaisDTO second = result.get(1);
    assertEquals(102L, second.getIdBail());
    assertFalse(second.isBailEnCours());
    assertEquals("CLOTURE", second.getStatutBail());
    assertEquals(LocalDate.of(2026, 4, 2), second.getDateClotureBail());
    assertEquals(801L, second.getIdAppel());
    assertEquals(85000d, second.getMontantloyer());
    assertEquals("2026-03", second.getMois());
    assertEquals("Mars 2026", second.getMoisEnLettre());
    assertNotNull(second.getDateClotureBail());
  }

  private Utilisateur buildTenant(Long id, boolean active) {
    Role role = new Role();
    role.setId(1L);
    role.setRoleName("LOCATAIRE");

    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setId(id);
    utilisateur.setActive(active);
    utilisateur.setNom("Tenant-" + id);
    utilisateur.setUsername("tenant" + id);
    utilisateur.setUrole(role);
    return utilisateur;
  }

  private LocataireEncaisDTO buildLocataireDto(
    Long idBail,
    String codeDescBail,
    double montant
  ) {
    LocataireEncaisDTO dto = new LocataireEncaisDTO();
    dto.setIdBail(idBail);
    dto.setCodeDescBail(codeDescBail);
    dto.setMontantloyer(montant);
    return dto;
  }

  private AppelLoyer buildAppel(
    Long id,
    String periode,
    String periodeLettre,
    double montant,
    double solde
  ) {
    AppelLoyer appelLoyer = new AppelLoyer();
    appelLoyer.setId(id);
    appelLoyer.setPeriodeAppelLoyer(periode);
    appelLoyer.setPeriodeLettre(periodeLettre);
    appelLoyer.setMontantLoyerBailLPeriode(montant);
    appelLoyer.setSoldeAppelLoyer(solde);
    return appelLoyer;
  }
}
