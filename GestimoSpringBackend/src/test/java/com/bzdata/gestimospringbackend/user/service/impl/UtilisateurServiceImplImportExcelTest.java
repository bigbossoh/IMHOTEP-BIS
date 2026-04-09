package com.bzdata.gestimospringbackend.user.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.Models.Role;
import com.bzdata.gestimospringbackend.Services.Impl.MailContentBuilder;
import com.bzdata.gestimospringbackend.Services.Impl.MailService;
import com.bzdata.gestimospringbackend.common.security.repository.VerificationTokenRepository;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementUtilisteurRepository;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.RoleRepository;
import com.bzdata.gestimospringbackend.user.dto.response.ImportResultDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.PasswordResetTokenRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UtilisateurServiceImplImportExcelTest {

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
  private Map<Long, Utilisateur> storedUsers;
  private AtomicLong userSequence;

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
    ReflectionTestUtils.setField(
      service,
      "defaultUserEmail",
      "fallback@gestimo.local"
    );

    storedUsers = new LinkedHashMap<>();
    userSequence = new AtomicLong(200L);

    Utilisateur creator = new Utilisateur();
    creator.setId(99L);
    creator.setEmail("creator@gestimo.local");
    creator.setMobile("0101010101");

    when(utilisateurRepository.findById(anyLong())).thenAnswer(invocation -> {
      Long id = invocation.getArgument(0);
      if (Long.valueOf(99L).equals(id)) {
        return Optional.of(creator);
      }
      return Optional.ofNullable(storedUsers.get(id));
    });

    when(utilisateurRepository.findUtilisateurByEmail(anyString()))
      .thenAnswer(invocation -> {
        String email = invocation.getArgument(0);
        return storedUsers
          .values()
          .stream()
          .filter(user -> email.equals(user.getEmail()))
          .findFirst();
      });

    when(utilisateurRepository.findUtilisateurByMobile(anyString()))
      .thenAnswer(invocation -> {
        String mobile = invocation.getArgument(0);
        return storedUsers
          .values()
          .stream()
          .filter(user -> mobile.equals(user.getMobile()))
          .findFirst()
          .orElse(null);
      });

    when(utilisateurRepository.save(any(Utilisateur.class))).thenAnswer(invocation -> {
      Utilisateur user = invocation.getArgument(0);
      if (user.getId() == null) {
        user.setId(userSequence.getAndIncrement());
      }
      storedUsers.put(user.getId(), user);
      return user;
    });
    doAnswer(invocation -> {
      Utilisateur user = invocation.getArgument(0);
      storedUsers.remove(user.getId());
      return null;
    }).when(utilisateurRepository).delete(any(Utilisateur.class));
    doNothing().when(utilisateurRepository).flush();

    when(roleRepository.findRoleByRoleName(anyString())).thenAnswer(invocation -> {
      String roleName = invocation.getArgument(0);
      Role role = new Role();
      role.setId(1L);
      role.setRoleName(roleName);
      return Optional.of(role);
    });

    when(passwordEncoder.encode(anyString())).thenAnswer(invocation ->
      "encoded-" + invocation.getArgument(0, String.class)
    );

    Etablissement etablissement = new Etablissement();
    etablissement.setId(1L);
    etablissement.setLibChapitre("Default");
    when(etablissementRepository.getById(1L)).thenReturn(etablissement);

    when(etablissementUtilisteurRepository.save(any(EtablissementUtilisateur.class)))
      .thenAnswer(invocation -> invocation.getArgument(0));
    doNothing().when(etablissementUtilisteurRepository).deleteAllByUtilisateurEtabl_Id(anyLong());

    when(gestimoWebMapperImpl.fromUtilisateur(any(Utilisateur.class)))
      .thenAnswer(invocation -> {
        Utilisateur user = invocation.getArgument(0);
        UtilisateurAfficheDto dto = new UtilisateurAfficheDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        dto.setNom(user.getNom());
        dto.setRoleUsed(user.getRoleUsed());
        dto.setActive(user.isActive());
        dto.setActivated(user.isActivated());
        dto.setNonLocked(user.isNonLocked());
        dto.setCanBeDeleted(Boolean.TRUE);
        dto.setHasActiveBail(Boolean.FALSE);
        return dto;
      });
  }

  @Test
  void importUtilisateursFromExcel_supportsListeUtilisateursFormat() throws Exception {
    MockMultipartFile file = buildWorkbook(
      new String[]{"Noms", "Role", "Numero", "Email", "Status"},
      new String[]{"ADOU ESTHER", "LOCATAIRE", "0707588633", "", "Active"},
      new String[]{"ANGORA GENEVIEVE", "LOCATAIRE", "0707924332", "", "Inactive"},
      new String[]{"BOSSOH MICHEL", "GERANT", "0777880885", "michel.bossoh@outlookfr", "Active"}
    );

    ImportResultDto result = service.importUtilisateursFromExcel(file, 12L, 99L);

    assertEquals(3, result.getTotal());
    assertEquals(3, result.getSuccess());
    assertEquals(0, result.getErrors());

    Utilisateur firstUser = storedUsers
      .values()
      .stream()
      .filter(user -> "ADOU ESTHER".equals(user.getNom()))
      .findFirst()
      .orElseThrow();
    assertEquals("0707588633", firstUser.getMobile());
    assertEquals("import-0707588633-ag12@gestimo.local", firstUser.getEmail());
    assertTrue(firstUser.isActive());

    Utilisateur inactiveUser = storedUsers
      .values()
      .stream()
      .filter(user -> "ANGORA GENEVIEVE".equals(user.getNom()))
      .findFirst()
      .orElseThrow();
    assertFalse(inactiveUser.isActive());
    assertFalse(inactiveUser.isActivated());
    assertFalse(inactiveUser.isNonLocked());
  }

  @Test
  void importUtilisateursFromExcel_reportsDuplicateMobileInsideFile() throws Exception {
    MockMultipartFile file = buildWorkbook(
      new String[]{"Noms", "Role", "Numero", "Email", "Status"},
      new String[]{"ADOU ESTHER", "LOCATAIRE", "0707588633", "", "Active"},
      new String[]{"ANGORA GENEVIEVE", "LOCATAIRE", "0707588633", "", "Active"}
    );

    ImportResultDto result = service.importUtilisateursFromExcel(file, 12L, 99L);

    assertEquals(2, result.getTotal());
    assertEquals(1, result.getSuccess());
    assertEquals(1, result.getErrors());
    assertTrue(result.getRowErrors().get(0).getMessage().contains("0707588633"));
  }

  @Test
  void deleteUtilisateur_removesUserWhenNoActiveBailExists() {
    Utilisateur user = new Utilisateur();
    user.setId(501L);
    user.setNom("SUPPRIMABLE");
    storedUsers.put(user.getId(), user);
    when(bailLocationRepository.findAll()).thenReturn(List.of());

    service.deleteUtilisateur(501L);

    assertFalse(storedUsers.containsKey(501L));
  }

  @Test
  void deleteUtilisateur_rejectsUserWhenAnActiveBailExists() {
    Utilisateur user = new Utilisateur();
    user.setId(502L);
    user.setNom("BLOQUE");
    storedUsers.put(user.getId(), user);

    BailLocation bailLocation = new BailLocation();
    bailLocation.setEnCoursBail(true);
    bailLocation.setUtilisateurOperation(user);
    when(bailLocationRepository.findAll()).thenReturn(List.of(bailLocation));

    InvalidEntityException exception = assertThrows(
      InvalidEntityException.class,
      () -> service.deleteUtilisateur(502L)
    );

    assertTrue(exception.getMessage().contains("bail en cours"));
    assertTrue(storedUsers.containsKey(502L));
  }

  private MockMultipartFile buildWorkbook(String[]... rows) throws IOException {
    try (
      Workbook workbook = new XSSFWorkbook();
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
    ) {
      Sheet sheet = workbook.createSheet("Utilisateurs");
      for (int rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        Row row = sheet.createRow(rowIndex);
        String[] values = rows[rowIndex];
        for (int columnIndex = 0; columnIndex < values.length; columnIndex++) {
          row.createCell(columnIndex).setCellValue(values[columnIndex]);
        }
      }

      workbook.write(outputStream);
      return new MockMultipartFile(
        "file",
        "Liste_utilisateurs_import.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        outputStream.toByteArray()
      );
    }
  }
}
