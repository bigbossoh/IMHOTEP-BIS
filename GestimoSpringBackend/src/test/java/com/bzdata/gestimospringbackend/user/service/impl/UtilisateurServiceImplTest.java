package com.bzdata.gestimospringbackend.user.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.Models.Role;
import com.bzdata.gestimospringbackend.Services.Impl.MailContentBuilder;
import com.bzdata.gestimospringbackend.Services.Impl.MailService;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.common.security.repository.VerificationTokenRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementUtilisteurRepository;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.RoleRepository;
import com.bzdata.gestimospringbackend.user.entity.PasswordResetToken;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.PasswordResetTokenRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class UtilisateurServiceImplTest {

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
  private BailMapperImpl bailMapperImpl;

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
        bailMapperImpl,
        etablissementRepository,
        etablissementUtilisteurRepository
      );
    ReflectionTestUtils.setField(service, "inactivityDisableDays", 30L);
    ReflectionTestUtils.setField(
      service,
      "inactivityProtectedRoles",
      "SUPER_SUPERVISEUR"
    );
  }

  @Test
  void desactiverUtilisateursInactifsDesactiveSeulementLesComptesEligibles() {
    Utilisateur inactiveUser = buildUser(
      "locataire@gestimo.local",
      "LOCATAIRE",
      Date.from(Instant.now().minus(45, ChronoUnit.DAYS))
    );
    Utilisateur protectedUser = buildUser(
      "admin@gestimo.local",
      "SUPER_SUPERVISEUR",
      Date.from(Instant.now().minus(90, ChronoUnit.DAYS))
    );
    Utilisateur recentUser = buildUser(
      "gerant@gestimo.local",
      "GERANT",
      Date.from(Instant.now().minus(5, ChronoUnit.DAYS))
    );

    when(utilisateurRepository.findAll()).thenReturn(
      List.of(inactiveUser, protectedUser, recentUser)
    );
    when(utilisateurRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

    int disabledCount = service.desactiverUtilisateursInactifs();

    assertEquals(1, disabledCount);
    assertFalse(inactiveUser.isActive());
    assertFalse(inactiveUser.isActivated());
    assertFalse(inactiveUser.isNonLocked());
    assertTrue(protectedUser.isActive());
    assertTrue(recentUser.isActive());
    verify(utilisateurRepository).saveAll(anyList());
  }

  private Utilisateur buildUser(String email, String roleName, Date lastLoginDate) {
    Role role = new Role();
    role.setRoleName(roleName);

    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setEmail(email);
    utilisateur.setRoleUsed(roleName);
    utilisateur.setUrole(role);
    utilisateur.setLastLoginDate(lastLoginDate);
    utilisateur.setJoinDate(lastLoginDate);
    utilisateur.setActive(true);
    utilisateur.setActivated(true);
    utilisateur.setNonLocked(true);
    return utilisateur;
  }
}
