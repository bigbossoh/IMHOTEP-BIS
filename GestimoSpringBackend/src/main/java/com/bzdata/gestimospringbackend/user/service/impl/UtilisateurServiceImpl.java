package com.bzdata.gestimospringbackend.user.service.impl;

import static com.bzdata.gestimospringbackend.enumeration.Role.*;

import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.NotificationEmail;
import com.bzdata.gestimospringbackend.Services.Impl.MailContentBuilder;
import com.bzdata.gestimospringbackend.Services.Impl.MailService;
import com.bzdata.gestimospringbackend.common.security.entity.VerificationToken;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.establishment.dto.response.EtablissementUtilisateurDto;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;
import com.bzdata.gestimospringbackend.user.dto.response.ImportResultDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.dto.request.ChangePasswordRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.PasswordResetConfirmationRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.PasswordResetRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.UserEstablishmentAssignmentRequestDto;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.user.entity.PasswordResetToken;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.service.UtilisateurService;
import org.springframework.dao.DataIntegrityViolationException;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.GestimoWebExceptionGlobal;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.exceptions.InvalidOperationException;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementUtilisteurRepository;
import com.bzdata.gestimospringbackend.Models.Role;
import com.bzdata.gestimospringbackend.repository.RoleRepository;
import com.bzdata.gestimospringbackend.user.repository.PasswordResetTokenRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.common.security.repository.VerificationTokenRepository;
import com.bzdata.gestimospringbackend.user.validator.UtilisateurDtoValiditor;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.security.SecureRandom;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {

  private static final Duration PASSWORD_RESET_TOKEN_TTL = Duration.ofMinutes(15);
  private static final String DEFAULT_USER_AGENCY_NAME = "RESIDENCE SEVE";
  private static final String DEFAULT_USER_AGENCY_SIGLE = "SEVE";
  private static final String SECONDARY_USER_AGENCY_NAME = "MOLIBETY";
  private static final String SECONDARY_USER_AGENCY_SIGLE = "MOLIBETY";
  private static final String LEGACY_USER_AGENCY_NAME = "AGENCE MAGISER";
  private static final String LEGACY_USER_AGENCY_SIGLE = "MAGISER";

  // private final AgenceImmobiliereRepository agenceImmobiliereRepository;
  private final AgenceImmobiliereRepository agenceImmobiliereRepository;
  private final UtilisateurRepository utilisateurRepository;
  public final PasswordEncoder passwordEncoderUser;
  private final VerificationTokenRepository verificationTokenRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final MailService mailService;
  private final MailContentBuilder mailContentBuilder;
  private final GestimoWebMapperImpl gestimoWebMapperImpl;
  private final BailLocationRepository bailrepository;
  private final BailMapperImpl bailMapper;
  private final EtablissementRepository etablissementRepository;
  private final EtablissementUtilisteurRepository etablissementUtilisteurRepository;

  @Value("${app.password-reset-url:http://localhost:4200/reset-password}")
  private String passwordResetUrl;

  @Value("${app.default-user-email:bossohpaulin@gmail.com}")
  private String defaultUserEmail;

  @Value("${app.user-security.inactivity-disable-days:30}")
  private long inactivityDisableDays;

  @Value("${app.user-security.protected-roles:SUPER_SUPERVISEUR}")
  private String inactivityProtectedRoles;

  @Override
  public UtilisateurAfficheDto saveUtilisateur(UtilisateurRequestDto dto) {
    if (dto.getId() == null || dto.getId() == 0) {
      Etablissement etablissement;
      if (dto.getIdEtablissement() == null) {
        etablissement = etablissementRepository.getById(1L);
      } else if (dto.getIdEtablissement() == 0  ) {
         etablissement = etablissementRepository.getById(1L);
      }else{
        etablissement =
          etablissementRepository.getById(dto.getIdEtablissement());
      }

      Utilisateur newUser = new Utilisateur();
      List<String> errors = UtilisateurDtoValiditor.validate(dto);
      if (!errors.isEmpty()) {
        log.error("l'utilisateur n'est pas valide {}", errors);
        throw new InvalidEntityException(
          "Certain attributs de l'object utiliateur avec pour role locataire sont null.",
          ErrorCodes.UTILISATEUR_NOT_VALID,
          errors
        );
      }
      Long resolvedCreatorId = resolveCreatorId(dto);
      Long resolvedAgenceId = resolveUserAgencyId(
        dto.getIdAgence(),
        resolvedCreatorId
      );
      utilisateurRepository
        .findById(dto.getUserCreate())
        .orElseThrow(() ->
          new InvalidEntityException(
            "Aucun Createur has been found with Code " + dto.getUserCreate(),
            ErrorCodes.UTILISATEUR_NOT_FOUND
          )
        );
      applyRoleToUser(newUser, dto.getRoleUsed());
      EtablissementUtilisateur etablissementUtilisateurCeate = new EtablissementUtilisateur();
      String loginMobile = resolveLoginMobile(dto, null);
      newUser.setIdAgence(resolvedAgenceId);
      newUser.setNom(dto.getNom());
      newUser.setUtilisateurIdApp(generateUserId());
      newUser.setPrenom(dto.getPrenom());
      newUser.setEmail(resolveUserEmail(dto.getEmail()));
      newUser.setMobile(loginMobile);
      newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
      newUser.setUsername(resolveUserEmail(dto.getEmail()));
      newUser.setProfileImageUrl(dto.getProfileImageUrl());
      newUser.setTypePieceIdentite(dto.getTypePieceIdentite());
      newUser.setJoinDate(new Date());
      newUser.setNumeroPieceIdentite(dto.getNumeroPieceIdentite());
      newUser.setNationalite(dto.getNationalite());
      newUser.setLieuNaissance(dto.getLieuNaissance());
      newUser.setGenre(dto.getGenre());
      newUser.setDateFinPiece(dto.getDateFinPiece());
      newUser.setDateDeNaissance(dto.getDateDeNaissance());
      newUser.setDateDebutPiece(dto.getDateDebutPiece());
      newUser.setActive(true);
      newUser.setActivated(true);
      newUser.setNonLocked(true);
      newUser.setIdCreateur(resolvedCreatorId);
      Utilisateur userSave = utilisateurRepository.save(newUser);

      etablissementUtilisateurCeate.setEtableDefault(true);
      etablissementUtilisateurCeate.setEtabl(etablissement);
      etablissementUtilisateurCeate.setUtilisateurEtabl(userSave);
      etablissementUtilisateurCeate.setIdAgence(userSave.getIdAgence());
      etablissementUtilisateurCeate.setIdCreateur(resolvedCreatorId);
      etablissementUtilisteurRepository.save(etablissementUtilisateurCeate);
     
      return gestimoWebMapperImpl.fromUtilisateur(userSave);
    } else {
      // log.info("WE ARE GOING TO MAKE A UDPDATE OF utilisateur");
      Utilisateur utilisateurUpdate = utilisateurRepository
        .findById(dto.getId())
        .orElseThrow(() ->
          new InvalidEntityException(
            "Aucun Utlisateur has been found with id " + dto.getId(),
            ErrorCodes.UTILISATEUR_NOT_FOUND
          )
        );
      Long resolvedCreatorId = resolveCreatorId(dto);
      if (dto.getIdAgence() != null && dto.getIdAgence() > 0) {
        utilisateurUpdate.setIdAgence(dto.getIdAgence());
      } else if (
        utilisateurUpdate.getIdAgence() == null ||
        utilisateurUpdate.getIdAgence() == 0
      ) {
        utilisateurUpdate.setIdAgence(
          resolveUserAgencyId(dto.getIdAgence(), resolvedCreatorId)
        );
      }
      if (resolvedCreatorId != null) {
        utilisateurUpdate.setIdCreateur(resolvedCreatorId);
      }
      if (StringUtils.hasText(dto.getRoleUsed())) {
        applyRoleToUser(utilisateurUpdate, dto.getRoleUsed());
      }
      String loginMobile = resolveLoginMobile(dto, utilisateurUpdate.getMobile());
      utilisateurUpdate.setNom(dto.getNom());
      if (!StringUtils.hasText(utilisateurUpdate.getUtilisateurIdApp())) {
        utilisateurUpdate.setUtilisateurIdApp(generateUserId());
      }
      utilisateurUpdate.setPrenom(dto.getPrenom());
      utilisateurUpdate.setEmail(
        resolveUpdatedEmail(utilisateurUpdate.getEmail(), dto.getEmail())
      );
      utilisateurUpdate.setMobile(loginMobile);
      utilisateurUpdate.setUsername(utilisateurUpdate.getEmail());
      if (StringUtils.hasText(dto.getPassword())) {
        utilisateurUpdate.setPassword(passwordEncoder.encode(dto.getPassword()));
      }
      utilisateurUpdate.setProfileImageUrl(dto.getProfileImageUrl());
      utilisateurUpdate.setTypePieceIdentite(dto.getTypePieceIdentite());
      utilisateurUpdate.setNumeroPieceIdentite(dto.getNumeroPieceIdentite());
      utilisateurUpdate.setNationalite(dto.getNationalite());
      utilisateurUpdate.setLieuNaissance(dto.getLieuNaissance());
      utilisateurUpdate.setGenre(dto.getGenre());
      utilisateurUpdate.setDateFinPiece(dto.getDateFinPiece());
      utilisateurUpdate.setDateDeNaissance(dto.getDateDeNaissance());
      utilisateurUpdate.setDateDebutPiece(dto.getDateDebutPiece());
      utilisateurUpdate.setActive(dto.isActive());
      utilisateurUpdate.setActivated(dto.isActivated());
      utilisateurUpdate.setNonLocked(dto.isNonLocked());
      Utilisateur UpdateUtilisateur = utilisateurRepository.save(
        utilisateurUpdate
      );
      return gestimoWebMapperImpl.fromUtilisateur(UpdateUtilisateur);
    }
  }

  private String generateUserId() {
    return "User-" + RandomStringUtils.randomAlphanumeric(5);
  }

  private String generateVerificationToken(Utilisateur utilisateur) {
    String token = UUID.randomUUID().toString();
    VerificationToken verificationToken = new VerificationToken();
    verificationToken.setToken(token);
    verificationToken.setUtilisateur(utilisateur);
    verificationTokenRepository.save(verificationToken);
    return token;
  }

  @Override
  public void verifyAccount(String token) {
    Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(
      token
    );
    verificationTokenOptional.orElseThrow(() ->
      new GestimoWebExceptionGlobal("Invalid Token")
    );
    feachUserAndEnable(verificationTokenOptional.get());
  }

  @Override
  public void feachUserAndEnable(VerificationToken verificationToken) {
    String email = verificationToken.getUtilisateur().getEmail();
    Utilisateur utilisateur = utilisateurRepository
      .findUtilisateurByEmail(email)
      .orElseThrow(() ->
        new GestimoWebExceptionGlobal(
          "Utilisateur avec l'username " + email + " n'exise pas."
        )
      );
    utilisateur.setActivated(true);
    utilisateurRepository.save(utilisateur);
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurLocataireOrderbyNameByAgence(
    Long idAgence
  ) {
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(idAgence);
    return utilisateurRepository
      .findAll()
      .stream()
      .filter(user -> user.getUrole().getRoleName().equals("LOCATAIRE"))
      .filter(agence -> agence.getIdAgence().equals(idAgence))
      .sorted(Comparator.comparing(Utilisateur::getNom))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public UtilisateurRequestDto findById(Long id) {
    if (id == null) {
      return null;
    }
    return utilisateurRepository
      .findById(id)
      .map(UtilisateurRequestDto::fromEntity)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun utilisateur has been found with ID " + id,
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );
  }

  @Override
  public UtilisateurRequestDto findUtilisateurByEmail(String email) {
    return utilisateurRepository
      .findUtilisateurByEmail(email)
      .map(UtilisateurRequestDto::fromEntity)
      .orElseThrow(() ->
        new EntityNotFoundException(
          "Aucun utilisateur avec l'email = " +
          email +
          " n' ete trouve dans la BDD",
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );
  }

  @Override
  public UtilisateurRequestDto findUtilisateurByUsername(String username) {
    Utilisateur utilisateurByUsername = utilisateurRepository.findUtilisateurByUsername(
      username
    );
    // log.info("Le User est {}", utilisateurByUsername.getUsername());
    if (utilisateurByUsername != null) {
      return UtilisateurRequestDto.fromEntity(utilisateurByUsername);
    } else {
      return null;
    }
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurOrderbyName(
    Long idAgence
  ) {
    // log.info("We are going to take back all the utilisateurs");
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(idAgence);
    return utilisateurRepository
      .findAll()
      .stream()
      .sorted(Comparator.comparing(Utilisateur::getNom))
      .filter(utilisateur -> hasAgenceId(utilisateur, idAgence))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurLocataireOrderbyName(
    Long idAgence
  ) {
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(idAgence);
    return utilisateurRepository
      .findAll()
      .stream()
      .filter(utilisateur -> hasAgenceId(utilisateur, idAgence))
      .filter(user -> user.getUrole().getRoleName().equals("LOCATAIRE"))
      .sorted(Comparator.comparing(Utilisateur::getNom))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurProprietaireOrderbyName(
    Long idAgence
  ) {
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(idAgence);
    return utilisateurRepository
      .findAll()
      .stream()
      .filter(utilisateur -> hasAgenceId(utilisateur, idAgence))
      .filter(user -> user.getUrole().getRoleName().equals("PROPRIETAIRE"))
      .sorted(Comparator.comparing(Utilisateur::getNom))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurGerantOrderbyName(
    Long idAgence
  ) {
    // log.info("We are going to take back all the GERANT order by GERANT name");
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(idAgence);
    return utilisateurRepository
      .findAll()
      .stream()
      .filter(utilisateur -> hasAgenceId(utilisateur, idAgence))
      .filter(user -> user.getUrole().getRoleName().equals("GERANT"))
      .sorted(Comparator.comparing(Utilisateur::getNom))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurSuperviseurOrderbyName() {
    // log.info("We are going to take back all the SUPERVISEUR order by SUPERVISEUR
    // name");
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(null);
    return utilisateurRepository
      .findAllByOrderByNomAsc()
      .stream()
      .filter(user -> user.getUrole().getRoleName().equals("SUPERVISEUR"))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public void deleteLocatire(Long id) {}

  @Override
  public void deleteProprietaire(Long id) {}

  @Override
  public void deleteUtilisateur(Long idUtilisateur) {
    Utilisateur utilisateur = utilisateurRepository
      .findById(idUtilisateur)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun utilisateur trouve avec l'id " + idUtilisateur,
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );

    if (hasActiveBail(idUtilisateur)) {
      throw new InvalidEntityException(
        "Impossible de supprimer cet utilisateur car il est rattache a un bail en cours.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }

    etablissementUtilisteurRepository.deleteAllByUtilisateurEtabl_Id(idUtilisateur);

    try {
      utilisateurRepository.delete(utilisateur);
      utilisateurRepository.flush();
    } catch (DataIntegrityViolationException exception) {
      throw new InvalidEntityException(
        "Impossible de supprimer cet utilisateur car il est encore lie a d'autres donnees.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }
  }

  @Override
  public List<LocataireEncaisDTO> listOfLocataireAyantunbail(Long idAgence) {
    return bailrepository
      .findAll()
      .stream()
      .filter(bailActif -> idAgence != null && idAgence.equals(bailActif.getIdAgence()))
      .filter(bailActif -> bailActif.isEnCoursBail() == true)
      .map(bailMapper::fromOperationBailLocation)
      .sorted(Comparator.comparing(LocataireEncaisDTO::getCodeDescBail))
      .collect(Collectors.toList());
  }

  @Override
  public List<LocataireEncaisDTO> listOfLocataireCompteClient(Long idAgence) {
    return bailrepository
      .findAll()
      .stream()
      .filter(bail -> idAgence != null && idAgence.equals(bail.getIdAgence()))
      .filter(bail -> bail.getUtilisateurOperation() != null)
      .filter(bail ->
        bail.getUtilisateurOperation().getUrole() != null &&
        "LOCATAIRE".equals(bail.getUtilisateurOperation().getUrole().getRoleName())
      )
      .filter(bail -> bail.getUtilisateurOperation().isActive())
      .map(this::toCompteClientLocataireDto)
      .sorted(
        Comparator
          .comparing(LocataireEncaisDTO::isBailEnCours)
          .reversed()
          .thenComparing(
            dto -> StringUtils.hasText(dto.getCodeDescBail()) ? dto.getCodeDescBail() : "",
            String.CASE_INSENSITIVE_ORDER
          )
      )
      .collect(Collectors.toList());
  }

  @Override
  public List<UtilisateurAfficheDto> listOfAllUtilisateurClientHotelOrderbyNameByAgence(
    Long idAgence
  ) {
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(idAgence);
    return utilisateurRepository
      .findAll()
      .stream()
      .filter(utilisateur ->
        hasAgenceId(utilisateur, idAgence) &&
        utilisateur.getUrole().getRoleName().equals("CLIENT HOTEL") &&
        !utilisateur.getUsername().contains("1234567890")
      )
      .sorted(Comparator.comparing(Utilisateur::getNom))
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public UtilisateurAfficheDto desactiverUtilisateur(Long idUtilisateur) {
    Utilisateur utilisateur = utilisateurRepository
      .findById(idUtilisateur)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun utilisateur trouve avec l'id " + idUtilisateur,
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );
    utilisateur.setActive(false);
    utilisateur.setActivated(false);
    utilisateur.setNonLocked(false);
    return gestimoWebMapperImpl.fromUtilisateur(
      utilisateurRepository.save(utilisateur)
    );
  }

  @Override
  public int desactiverUtilisateursInactifs() {
    if (inactivityDisableDays <= 0) {
      return 0;
    }

    Instant cutoff = Instant.now().minus(Duration.ofDays(inactivityDisableDays));
    List<Utilisateur> utilisateursADesactiver = utilisateurRepository
      .findAll()
      .stream()
      .filter(Utilisateur::isActive)
      .filter(this::hasActivityReferenceDate)
      .filter(utilisateur -> !isProtectedFromInactivityDeactivation(utilisateur))
      .filter(utilisateur -> isInactiveSince(utilisateur, cutoff))
      .toList();

    if (utilisateursADesactiver.isEmpty()) {
      return 0;
    }

    utilisateursADesactiver.forEach(utilisateur -> {
      utilisateur.setActive(false);
      utilisateur.setActivated(false);
      utilisateur.setNonLocked(false);
    });
    utilisateurRepository.saveAll(utilisateursADesactiver);

    log.info(
      "Desactivation automatique de {} compte(s) inactif(s) apres {} jour(s).",
      utilisateursADesactiver.size(),
      inactivityDisableDays
    );
    return utilisateursADesactiver.size();
  }

  private LocataireEncaisDTO toCompteClientLocataireDto(BailLocation bailLocation) {
    LocataireEncaisDTO dto = bailMapper.fromOperationBailLocation(bailLocation);
    dto.setBailEnCours(bailLocation.isEnCoursBail());
    dto.setStatutBail(bailLocation.isEnCoursBail() ? "EN_COURS" : "CLOTURE");
    dto.setDateClotureBail(bailLocation.getDateCloture());

    if (dto.getIdAppel() == null || dto.getMontantloyer() <= 0) {
      resolveReferenceAppel(bailLocation).ifPresent(appel -> {
        dto.setIdAppel(appel.getId());
        dto.setMontantloyer(appel.getMontantLoyerBailLPeriode());
        dto.setMois(appel.getPeriodeAppelLoyer());
        dto.setMoisEnLettre(appel.getPeriodeLettre());
        dto.setSoldeAppelLoyer(appel.getSoldeAppelLoyer());
        dto.setUnlock(appel.isUnLock());
      });
    }

    return dto;
  }

  private Optional<AppelLoyer> resolveReferenceAppel(BailLocation bailLocation) {
    List<AppelLoyer> appels = Optional
      .ofNullable(bailLocation.getListAppelsLoyers())
      .orElse(List.of())
      .stream()
      .filter(Objects::nonNull)
      .collect(Collectors.toList());

    Optional<AppelLoyer> firstUnpaid = appels
      .stream()
      .filter(appel -> appel.getSoldeAppelLoyer() > 0)
      .min(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer));

    if (firstUnpaid.isPresent()) {
      return firstUnpaid;
    }

    return appels
      .stream()
      .max(Comparator.comparing(AppelLoyer::getPeriodeAppelLoyer));
  }

  @Override
  public UtilisateurAfficheDto changerMotDePasse(
    ChangePasswordRequestDto requestDto
  ) {
    Utilisateur utilisateur = utilisateurRepository
      .findById(requestDto.getUserId())
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun utilisateur trouve avec l'id " + requestDto.getUserId(),
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );
    if (!passwordEncoder.matches(requestDto.getOldPassword(), utilisateur.getPassword())) {
      throw new InvalidOperationException(
        "L'ancien mot de passe est incorrect",
        ErrorCodes.BAD_CREDENTIALS
      );
    }
    utilisateur.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
    return gestimoWebMapperImpl.fromUtilisateur(
      utilisateurRepository.save(utilisateur)
    );
  }

  @Override
  public void demanderReinitialisationMotDePasse(
    PasswordResetRequestDto requestDto
  ) {
    if (requestDto == null || !StringUtils.hasText(requestDto.getIdentifier())) {
      throw new InvalidOperationException(
        "L'identifiant est obligatoire",
        ErrorCodes.PASSWORD_RESET_REQUEST_NOT_VALID
      );
    }

    String identifier = requestDto.getIdentifier().trim();
    Optional<Utilisateur> utilisateurOptional = findUtilisateurByIdentifier(
      identifier
    );
    if (utilisateurOptional.isEmpty()) {
      log.warn(
        "Aucune reinitialisation envoyee car aucun utilisateur ne correspond a l'identifiant {}",
        identifier
      );
      return;
    }

    Utilisateur utilisateur = utilisateurOptional.get();
    String recipientEmail = resolveUserEmail(utilisateur.getEmail());
    if (!recipientEmail.equals(utilisateur.getEmail())) {
      utilisateur.setEmail(recipientEmail);
      utilisateurRepository.save(utilisateur);
    }

    invaliderTokensActifs(utilisateur);

    String otp = String.format("%06d", new SecureRandom().nextInt(1_000_000));

    PasswordResetToken passwordResetToken = new PasswordResetToken();
    passwordResetToken.setToken(otp);
    passwordResetToken.setExpiryDate(Instant.now().plus(PASSWORD_RESET_TOKEN_TTL));
    passwordResetToken.setUsed(false);
    passwordResetToken.setUtilisateur(utilisateur);
    passwordResetTokenRepository.save(passwordResetToken);

    String displayName = buildDisplayName(utilisateur).toUpperCase();
    String emailBody = buildOtpEmailBody(displayName, otp);

    mailService.sendMail(
      new NotificationEmail(
        "\uD83D\uDD10 Réinitialisation de mot de passe",
        recipientEmail,
        mailContentBuilder.build(emailBody)
      )
    );
  }

  @Override
  public void reinitialiserMotDePasse(
    PasswordResetConfirmationRequestDto requestDto
  ) {
    if (
      requestDto == null ||
      !StringUtils.hasText(requestDto.getToken()) ||
      !StringUtils.hasText(requestDto.getNewPassword()) ||
      !StringUtils.hasText(requestDto.getConfirmPassword())
    ) {
      throw new InvalidOperationException(
        "Le code OTP, le nouveau mot de passe et la confirmation sont obligatoires",
        ErrorCodes.PASSWORD_RESET_REQUEST_NOT_VALID
      );
    }

    if (!requestDto.getNewPassword().equals(requestDto.getConfirmPassword())) {
      throw new InvalidOperationException(
        "Le nouveau mot de passe et sa confirmation ne correspondent pas",
        ErrorCodes.PASSWORD_RESET_REQUEST_NOT_VALID
      );
    }

    String otp = requestDto.getToken().trim();
    if (!otp.matches("\\d{6}")) {
      throw new InvalidOperationException(
        "Le code OTP doit être composé de 6 chiffres",
        ErrorCodes.PASSWORD_RESET_TOKEN_NOT_FOUND
      );
    }

    PasswordResetToken passwordResetToken = passwordResetTokenRepository
      .findByToken(otp)
      .orElseThrow(() ->
        new InvalidOperationException(
          "Code OTP invalide ou introuvable",
          ErrorCodes.PASSWORD_RESET_TOKEN_NOT_FOUND
        )
      );

    if (passwordResetToken.isUsed()) {
      throw new InvalidOperationException(
        "Ce code OTP a déjà été utilisé",
        ErrorCodes.PASSWORD_RESET_TOKEN_ALREADY_USED
      );
    }

    if (passwordResetToken.getExpiryDate().isBefore(Instant.now())) {
      throw new InvalidOperationException(
        "Ce code OTP a expiré. Veuillez en demander un nouveau",
        ErrorCodes.PASSWORD_RESET_TOKEN_EXPIRED
      );
    }

    Utilisateur utilisateur = passwordResetToken.getUtilisateur();
    utilisateur.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
    utilisateurRepository.save(utilisateur);

    passwordResetToken.setUsed(true);
    passwordResetTokenRepository.save(passwordResetToken);
  }

  @Override
  public EtablissementUtilisateurDto affecterUtilisateurAEtablissement(
    UserEstablishmentAssignmentRequestDto requestDto
  ) {
    Utilisateur utilisateur = utilisateurRepository
      .findById(requestDto.getUserId())
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun utilisateur trouve avec l'id " + requestDto.getUserId(),
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );
    Etablissement etablissement = etablissementRepository
      .findById(requestDto.getEstablishmentId())
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun etablissement trouve avec l'id " +
          requestDto.getEstablishmentId(),
          ErrorCodes.SITE_NOT_FOUND
        )
      );

    List<EtablissementUtilisateur> affectations = etablissementUtilisteurRepository.findAllByUtilisateurEtabl_Id(
      requestDto.getUserId()
    );
    if (requestDto.isDefaultEtablissement()) {
      affectations.forEach(aff -> aff.setEtableDefault(false));
      etablissementUtilisteurRepository.saveAll(affectations);
    }

    Optional<EtablissementUtilisateur> existante = affectations
      .stream()
      .filter(aff -> aff.getEtabl().getId().equals(requestDto.getEstablishmentId()))
      .findFirst();

    EtablissementUtilisateur affectation = existante.orElseGet(EtablissementUtilisateur::new);
    affectation.setUtilisateurEtabl(utilisateur);
    affectation.setEtabl(etablissement);
    affectation.setEtableDefault(requestDto.isDefaultEtablissement());
    affectation.setIdAgence(utilisateur.getIdAgence());
    affectation.setIdCreateur(utilisateur.getIdCreateur());

    EtablissementUtilisateur saved = etablissementUtilisteurRepository.save(affectation);
    return gestimoWebMapperImpl.fromEtablissementUtilisateur(saved);
  }

  @Override
  public List<UtilisateurAfficheDto> listerUtilisateursParEtablissement(
    Long idEtablissement
  ) {
    Set<Long> activeBailUserIds = findUserIdsWithActiveBail(null);
    return etablissementUtilisteurRepository
      .findAllByEtabl_Id(idEtablissement)
      .stream()
      .map(EtablissementUtilisateur::getUtilisateurEtabl)
      .distinct()
      .map(user -> toUtilisateurAfficheDto(user, activeBailUserIds))
      .collect(Collectors.toList());
  }

  @Override
  public ImportResultDto importUtilisateursFromExcel(
    MultipartFile file,
    Long idAgence,
    Long idCreateur
  ) {
    List<ImportResultDto.ImportRowError> rowErrors = new java.util.ArrayList<>();
    Set<String> importedEmails = new HashSet<>();
    Set<String> importedMobiles = new HashSet<>();
    int total = 0;
    int success = 0;

    validateImportRequest(file, idAgence, idCreateur);

    try (org.apache.poi.ss.usermodel.Workbook workbook =
      org.apache.poi.ss.usermodel.WorkbookFactory.create(file.getInputStream())) {

      org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);

      // Lire les en-têtes de la ligne 0 pour mapper dynamiquement les colonnes
      org.apache.poi.ss.usermodel.Row headerRow = sheet.getRow(0);
      if (headerRow == null) {
        throw new InvalidEntityException("Le fichier Excel ne contient pas de ligne d'en-tête.",
          ErrorCodes.UTILISATEUR_NOT_VALID);
      }
      java.util.Map<String, Integer> colIndex = new java.util.HashMap<>();
      for (int c = 0; c < headerRow.getLastCellNum(); c++) {
        String header = getCellStringByIndex(headerRow, c);
        if (header != null) {
          colIndex.put(normalizeHeader(header), c);
        }
      }
      validateImportHeaders(colIndex);
      log.info("En-têtes Excel détectés : {}", colIndex);

      for (int i = 1; i <= sheet.getLastRowNum(); i++) {
        org.apache.poi.ss.usermodel.Row row = sheet.getRow(i);
        if (row == null) continue;
        if (isImportRowEmpty(row, colIndex)) continue;

        total++;
        try {
          String nom = getByHeader(row, colIndex, "nom");
          if (!StringUtils.hasText(nom)) {
            throw new InvalidEntityException(
              "La colonne Noms/nom est obligatoire pour chaque ligne importée.",
              ErrorCodes.UTILISATEUR_NOT_VALID
            );
          }

          String email = getByHeader(row, colIndex, "email");
          String mobile = getByHeader(row, colIndex, "mobile");
          String resolvedEmail = resolveImportEmail(email, mobile, idAgence, i + 1);
          String resolvedMobile = resolveImportMobile(mobile, resolvedEmail);
          validateImportUniqueness(
            resolvedEmail,
            resolvedMobile,
            importedEmails,
            importedMobiles
          );

          String role = resolveRole(getByHeader(row, colIndex, "role"));
          String password = getByHeader(row, colIndex, "password");
          boolean active = resolveImportStatus(getByHeader(row, colIndex, "status"));

          UtilisateurRequestDto dto = UtilisateurRequestDto.builder()
            .idAgence(idAgence)
            .idCreateur(idCreateur)
            .userCreate(idCreateur)
            .idEtablissement(1L)
            .nom(nom)
            .prenom(getByHeader(row, colIndex, "prenom"))
            .email(resolvedEmail)
            .mobile(resolvedMobile)
            .username(resolvedEmail)
            .roleUsed(role)
            .genre(getByHeader(row, colIndex, "genre"))
            .nationalite(getByHeader(row, colIndex, "nationalite"))
            .lieuNaissance(getByHeader(row, colIndex, "lieunaissance"))
            .dateDeNaissance(parseDateByHeader(row, colIndex, "datenaissance"))
            .typePieceIdentite(getByHeader(row, colIndex, "typepiece"))
            .numeroPieceIdentite(getByHeader(row, colIndex, "numeropiece"))
            .password(password != null ? password : "Gestimo@2024")
            .isActive(true)
            .isNonLocked(true)
            .isActivated(true)
            .build();

          UtilisateurAfficheDto importedUser = saveUtilisateur(dto);
          if (!active && importedUser.getId() != null) {
            desactiverUtilisateur(importedUser.getId());
          }

          importedEmails.add(normalizeImportUniqueKey(resolvedEmail));
          importedMobiles.add(normalizeImportUniqueKey(resolvedMobile));
          success++;
        } catch (Exception e) {
          rowErrors.add(ImportResultDto.ImportRowError.builder()
            .row(i + 1)
            .message(resolveImportErrorMessage(e))
            .build());
        }
      }
    } catch (InvalidEntityException e) {
      throw e;
    } catch (Exception e) {
      throw new InvalidEntityException(
        "Erreur lors de la lecture du fichier Excel : " + e.getMessage(),
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }

    return ImportResultDto.builder()
      .total(total)
      .success(success)
      .errors(rowErrors.size())
      .rowErrors(rowErrors)
      .build();
  }

  /** Normalise un en-tête : minuscules, sans accents, sans espaces */
  private String normalizeHeader(String header) {
    if (header == null) return "";
    String s = header.toLowerCase(java.util.Locale.FRENCH).trim();
    s = java.text.Normalizer.normalize(s, java.text.Normalizer.Form.NFD)
        .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    s = s.replaceAll("[^a-z0-9]", "");
    return s;
  }

  /** Résout les variantes de noms de colonnes vers une clé canonique */
  private String getByHeader(org.apache.poi.ss.usermodel.Row row,
      java.util.Map<String, Integer> colIndex, String canonicalKey) {
    for (String key : getImportHeaderAliases(canonicalKey)) {
      Integer idx = colIndex.get(normalizeHeader(key));
      if (idx != null) {
        return getCellStringByIndex(row, idx);
      }
    }
    return null;
  }

  /** Normalise la valeur du rôle (accepte LOCATAIRE, Locataire, locataire...) */
  private String resolveRole(String raw) {
    if (raw == null || raw.isBlank()) return "LOCATAIRE";
    String normalizedRole = normalizeHeader(raw);
    if (normalizedRole.contains("proprietaire") || normalizedRole.contains("proprio")) return "PROPRIETAIRE";
    if (normalizedRole.contains("supersuperviseur") || normalizedRole.contains("supersupervisor")) return "SUPER_SUPERVISEUR";
    if (normalizedRole.contains("superviseur") || normalizedRole.contains("supervisor")) return "SUPERVISEUR";
    if (normalizedRole.contains("gerant") || normalizedRole.contains("manager")) return "GERANT";
    if (normalizedRole.contains("locataire") || normalizedRole.contains("tenant")) return "LOCATAIRE";
    // si non reconnu, retourner tel quel pour que le service lève une erreur explicite
    return raw.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
  }

  private void validateImportRequest(
    MultipartFile file,
    Long idAgence,
    Long idCreateur
  ) {
    if (file == null || file.isEmpty()) {
      throw new InvalidEntityException(
        "Veuillez sélectionner un fichier Excel non vide.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }
    if (idAgence == null || idAgence <= 0) {
      throw new InvalidEntityException(
        "L'agence de rattachement est obligatoire pour importer des utilisateurs.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }
    if (idCreateur == null || idCreateur <= 0) {
      throw new InvalidEntityException(
        "Le créateur de l'import est obligatoire.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }
  }

  private void validateImportHeaders(java.util.Map<String, Integer> colIndex) {
    if (!hasImportHeader(colIndex, "nom")) {
      throw new InvalidEntityException(
        "Le fichier Excel doit contenir une colonne Noms ou nom.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }
    if (!hasImportHeader(colIndex, "email") && !hasImportHeader(colIndex, "mobile")) {
      throw new InvalidEntityException(
        "Le fichier Excel doit contenir une colonne Email ou Numero.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }
  }

  private boolean hasImportHeader(
    java.util.Map<String, Integer> colIndex,
    String canonicalKey
  ) {
    for (String alias : getImportHeaderAliases(canonicalKey)) {
      if (colIndex.containsKey(normalizeHeader(alias))) {
        return true;
      }
    }
    return false;
  }

  private String[] getImportHeaderAliases(String canonicalKey) {
    return switch (canonicalKey) {
      case "nom" -> new String[]{"nom", "noms", "nomcomplet", "fullname"};
      case "prenom" -> new String[]{"prenom", "prenoms", "prénom", "prénoms"};
      case "email" -> new String[]{"email", "mail", "adressemail", "adresseemail"};
      case "mobile" -> new String[]{"mobile", "numero", "numéro", "telephone", "téléphone", "tel", "phone", "contact"};
      case "role" -> new String[]{"role", "roleused", "rôle", "profil"};
      case "genre" -> new String[]{"genre", "sexe"};
      case "nationalite" -> new String[]{"nationalite", "nationalité", "pays"};
      case "lieunaissance" -> new String[]{"lieunaissance", "liedenaissance", "villenaissance"};
      case "datenaissance" -> new String[]{"datenaissance", "datedenaissance", "ddn"};
      case "typepiece" -> new String[]{"typepiece", "typepieceidentite", "typepi"};
      case "numeropiece" -> new String[]{"numeropiece", "numeropieceidentite", "numpiece", "numeropi"};
      case "password" -> new String[]{"password", "motdepasse", "mdp"};
      case "status" -> new String[]{"status", "statut", "etat", "état", "active", "actif"};
      default -> new String[]{canonicalKey};
    };
  }

  private boolean isImportRowEmpty(
    org.apache.poi.ss.usermodel.Row row,
    java.util.Map<String, Integer> colIndex
  ) {
    for (String key : new String[]{"nom", "prenom", "email", "mobile", "role"}) {
      if (StringUtils.hasText(getByHeader(row, colIndex, key))) {
        return false;
      }
    }
    return true;
  }

  private String resolveImportEmail(
    String rawEmail,
    String rawMobile,
    Long idAgence,
    int rowNumber
  ) {
    if (StringUtils.hasText(rawEmail)) {
      return rawEmail.trim();
    }

    if (!StringUtils.hasText(rawMobile)) {
      throw new InvalidEntityException(
        "Chaque ligne doit contenir au moins un email ou un numero.",
        ErrorCodes.UTILISATEUR_NOT_VALID
      );
    }

    String seed = sanitizeImportIdentityFragment(rawMobile, rowNumber);
    return "import-" + seed + "-ag" + idAgence + "@gestimo.local";
  }

  private String resolveImportMobile(String rawMobile, String resolvedEmail) {
    if (StringUtils.hasText(rawMobile)) {
      return rawMobile.trim();
    }
    if (StringUtils.hasText(resolvedEmail)) {
      return resolvedEmail.trim();
    }
    throw new InvalidEntityException(
      "Chaque ligne doit contenir au moins un email ou un numero.",
      ErrorCodes.UTILISATEUR_NOT_VALID
    );
  }

  private String sanitizeImportIdentityFragment(String value, int rowNumber) {
    String sanitized = normalizeHeader(value);
    return StringUtils.hasText(sanitized) ? sanitized : "ligne" + rowNumber;
  }

  private void validateImportUniqueness(
    String email,
    String mobile,
    Set<String> importedEmails,
    Set<String> importedMobiles
  ) {
    String normalizedEmail = normalizeImportUniqueKey(email);
    if (StringUtils.hasText(normalizedEmail)) {
      if (importedEmails.contains(normalizedEmail)) {
        throw new InvalidEntityException(
          "L'email " + email + " est dupliqué dans le fichier d'import.",
          ErrorCodes.UTILISATEUR_ALREADY_IN_USE
        );
      }
      if (utilisateurRepository.findUtilisateurByEmail(email).isPresent()) {
        throw new InvalidEntityException(
          "Un utilisateur existe déjà avec l'email " + email + ".",
          ErrorCodes.UTILISATEUR_ALREADY_IN_USE
        );
      }
    }

    String normalizedMobile = normalizeImportUniqueKey(mobile);
    if (StringUtils.hasText(normalizedMobile)) {
      if (importedMobiles.contains(normalizedMobile)) {
        throw new InvalidEntityException(
          "Le numero " + mobile + " est dupliqué dans le fichier d'import.",
          ErrorCodes.UTILISATEUR_ALREADY_IN_USE
        );
      }
      if (utilisateurRepository.findUtilisateurByMobile(mobile) != null) {
        throw new InvalidEntityException(
          "Un utilisateur existe déjà avec le numero " + mobile + ".",
          ErrorCodes.UTILISATEUR_ALREADY_IN_USE
        );
      }
    }
  }

  private String normalizeImportUniqueKey(String value) {
    return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
  }

  private boolean resolveImportStatus(String rawStatus) {
    if (!StringUtils.hasText(rawStatus)) {
      return true;
    }
    String normalizedStatus = normalizeHeader(rawStatus);
    if (normalizedStatus.startsWith("inact") || normalizedStatus.startsWith("desactiv")) {
      return false;
    }
    return true;
  }

  private String resolveImportErrorMessage(Exception exception) {
    if (
      exception instanceof InvalidEntityException invalidEntityException &&
      invalidEntityException.getErrors() != null &&
      !invalidEntityException.getErrors().isEmpty()
    ) {
      return String.join("; ", invalidEntityException.getErrors());
    }

    return StringUtils.hasText(exception.getMessage())
      ? exception.getMessage()
      : "Erreur lors de l'import de la ligne.";
  }

  private java.time.LocalDate parseDateByHeader(org.apache.poi.ss.usermodel.Row row,
      java.util.Map<String, Integer> colIndex, String canonicalKey) {
    Integer idx = colIndex.get(canonicalKey);
    if (idx == null) {
      // essayer les alias
      for (String alias : new String[]{"datenaissance","datedenaissance","ddn"}) {
        idx = colIndex.get(alias);
        if (idx != null) break;
      }
    }
    if (idx == null) return null;
    org.apache.poi.ss.usermodel.Cell cell = row.getCell(idx);
    if (cell == null) return null;
    try {
      if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC
          && org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
        return cell.getLocalDateTimeCellValue().toLocalDate();
      }
      String str = cell.getStringCellValue().trim();
      if (str.isEmpty()) return null;
      // essayer plusieurs formats
      for (String pattern : new String[]{"yyyy-MM-dd", "dd/MM/yyyy", "dd-MM-yyyy"}) {
        try {
          return java.time.LocalDate.parse(str,
              java.time.format.DateTimeFormatter.ofPattern(pattern));
        } catch (Exception ignored) {}
      }
    } catch (Exception ignored) {}
    return null;
  }

  private String getCellStringByIndex(org.apache.poi.ss.usermodel.Row row, int col) {
    org.apache.poi.ss.usermodel.Cell cell = row.getCell(col);
    if (cell == null) return null;
    org.apache.poi.ss.usermodel.DataFormatter formatter = new org.apache.poi.ss.usermodel.DataFormatter();
    String value = formatter.formatCellValue(cell).trim();
    return value.isEmpty() ? null : value;
  }

  private Optional<Utilisateur> findUtilisateurByIdentifier(String identifier) {
    Optional<Utilisateur> utilisateurByEmail = utilisateurRepository.findUtilisateurByEmail(
      identifier
    );
    if (utilisateurByEmail.isPresent()) {
      return utilisateurByEmail;
    }

    Utilisateur utilisateurByUsername = utilisateurRepository.findUtilisateurByUsername(
      identifier
    );
    if (utilisateurByUsername != null) {
      return Optional.of(utilisateurByUsername);
    }

    return Optional.ofNullable(
      utilisateurRepository.findUtilisateurByMobile(identifier)
    );
  }

  private void invaliderTokensActifs(Utilisateur utilisateur) {
    List<PasswordResetToken> activeTokens = passwordResetTokenRepository.findAllByUtilisateurAndUsedFalse(
      utilisateur
    );
    if (activeTokens.isEmpty()) {
      return;
    }

    activeTokens.forEach(token -> token.setUsed(true));
    passwordResetTokenRepository.saveAll(activeTokens);
  }

  private String buildOtpEmailBody(String displayName, String otp) {
    return
      "<div style='font-family:Arial,sans-serif;max-width:520px;margin:0 auto;'>" +
      "  <div style='background:#4f46e5;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;'>" +
      "    <h2 style='color:#ffffff;margin:0;font-size:20px;'>&#128272; Réinitialisation de mot de passe</h2>" +
      "  </div>" +
      "  <div style='background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;'>" +
      "    <p style='color:#374151;font-size:15px;margin:0 0 16px;'>Bonjour <strong>" + displayName + "</strong>,</p>" +
      "    <p style='color:#374151;font-size:14px;margin:0 0 24px;'>Vous avez demandé la réinitialisation de votre mot de passe sur l'application <strong>Gestimo</strong>.</p>" +
      "    <p style='color:#374151;font-size:14px;margin:0 0 8px;'>Voici votre code de vérification à 6 chiffres :</p>" +
      "    <div style='background:#f3f4f6;border:2px dashed #4f46e5;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px;'>" +
      "      <span style='font-size:40px;font-weight:800;letter-spacing:12px;color:#1e1b4b;font-family:monospace;'>" + otp + "</span>" +
      "    </div>" +
      "    <p style='color:#6b7280;font-size:13px;margin:0 0 24px;'>&#9201; Ce code est valable pendant <strong>15 minutes</strong>.</p>" +
      "    <hr style='border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;'/>" +
      "    <p style='color:#9ca3af;font-size:12px;margin:0;'>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>" +
      "  </div>" +
      "</div>";
  }

  private String buildDisplayName(Utilisateur utilisateur) {
    String prenom = utilisateur.getPrenom() == null ? "" : utilisateur.getPrenom().trim();
    String nom = utilisateur.getNom() == null ? "" : utilisateur.getNom().trim();
    String fullName = (prenom + " " + nom).trim();
    return StringUtils.hasText(fullName) ? fullName : utilisateur.getUsername();
  }

  private String resolveUserEmail(String email) {
    String normalizedEmail = email == null ? "" : email.trim();
    if (!StringUtils.hasText(normalizedEmail)) {
      return defaultUserEmail;
    }

    String lowerCaseEmail = normalizedEmail.toLowerCase();
    if (lowerCaseEmail.equals("superviseur@superviseur.com") || lowerCaseEmail.endsWith("@superviseur.com")) {
      return defaultUserEmail;
    }

    return normalizedEmail;
  }

  private String resolveUpdatedEmail(String currentEmail, String requestedEmail) {
    if (!StringUtils.hasText(requestedEmail)) {
      return currentEmail;
    }

    return resolveUserEmail(requestedEmail);
  }

  private String resolveLoginMobile(
    UtilisateurRequestDto dto,
    String fallbackMobile
  ) {
    String candidate = dto.getMobile();
    if (!StringUtils.hasText(candidate)) {
      candidate = dto.getUsername();
    }

    if (StringUtils.hasText(candidate)) {
      return candidate.trim();
    }

    return fallbackMobile;
  }

  private boolean hasAgenceId(Utilisateur utilisateur, Long idAgence) {
    return idAgence != null && idAgence.equals(utilisateur.getIdAgence());
  }

  private boolean hasActivityReferenceDate(Utilisateur utilisateur) {
    return resolveLastActivityInstant(utilisateur) != null;
  }

  private boolean isInactiveSince(Utilisateur utilisateur, Instant cutoff) {
    Instant lastActivityInstant = resolveLastActivityInstant(utilisateur);
    return lastActivityInstant != null && lastActivityInstant.isBefore(cutoff);
  }

  private Instant resolveLastActivityInstant(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return null;
    }

    Date lastLoginDate = utilisateur.getLastLoginDate();
    if (lastLoginDate != null) {
      return lastLoginDate.toInstant();
    }

    Date joinDate = utilisateur.getJoinDate();
    return joinDate != null ? joinDate.toInstant() : null;
  }

  private boolean isProtectedFromInactivityDeactivation(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return false;
    }

    Set<String> protectedRoles = Stream
      .of(inactivityProtectedRoles.split(","))
      .map(String::trim)
      .filter(StringUtils::hasText)
      .map(this::normalizeProtectedRoleName)
      .collect(Collectors.toSet());

    if (protectedRoles.isEmpty()) {
      return false;
    }

    String roleFromEntity = utilisateur.getUrole() != null
      ? normalizeProtectedRoleName(utilisateur.getUrole().getRoleName())
      : "";
    String roleFromUser = normalizeProtectedRoleName(utilisateur.getRoleUsed());

    return protectedRoles.contains(roleFromEntity) || protectedRoles.contains(roleFromUser);
  }

  private String normalizeProtectedRoleName(String roleName) {
    if (!StringUtils.hasText(roleName)) {
      return "";
    }

    String normalizedRoleName = roleName.trim().toUpperCase(Locale.ROOT);
    return normalizedRoleName.startsWith("ROLE_")
      ? normalizedRoleName.substring(5)
      : normalizedRoleName;
  }

  private UtilisateurAfficheDto toUtilisateurAfficheDto(
    Utilisateur utilisateur,
    Set<Long> activeBailUserIds
  ) {
    UtilisateurAfficheDto dto = gestimoWebMapperImpl.fromUtilisateur(utilisateur);
    boolean hasActiveBail = utilisateur != null &&
      utilisateur.getId() != null &&
      activeBailUserIds.contains(utilisateur.getId());
    dto.setHasActiveBail(hasActiveBail);
    dto.setCanBeDeleted(!hasActiveBail);
    return dto;
  }

  private boolean hasActiveBail(Long userId) {
    return userId != null && findUserIdsWithActiveBail(null).contains(userId);
  }

  private Set<Long> findUserIdsWithActiveBail(Long idAgence) {
    return bailrepository
      .findAll()
      .stream()
      .filter(BailLocation::isEnCoursBail)
      .filter(bail -> idAgence == null || idAgence.equals(bail.getIdAgence()))
      .flatMap(this::extractActiveBailUserIds)
      .collect(Collectors.toSet());
  }

  private Stream<Long> extractActiveBailUserIds(BailLocation bailLocation) {
    Long locataireId = bailLocation.getUtilisateurOperation() == null
      ? null
      : bailLocation.getUtilisateurOperation().getId();
    Long proprietaireId = bailLocation.getBienImmobilierOperation() == null ||
      bailLocation.getBienImmobilierOperation().getUtilisateurProprietaire() == null
      ? null
      : bailLocation.getBienImmobilierOperation().getUtilisateurProprietaire().getId();

    return Stream.of(locataireId, proprietaireId).filter(Objects::nonNull);
  }

  private void applyRoleToUser(Utilisateur utilisateur, String roleName) {
    String normalizedRoleName = normalizeRoleName(roleName);
    Role leRole = roleRepository
      .findRoleByRoleName(normalizedRoleName)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun role has been found with Code " + roleName,
          ErrorCodes.ROLE_NOT_FOUND
        )
      );

    utilisateur.setUrole(leRole);
    switch (normalizedRoleName) {
      case "SUPERVISEUR":
        utilisateur.setRoleUsed(ROLE_SUPERVISEUR.name());
        utilisateur.setAuthorities(ROLE_SUPERVISEUR.getAuthorities());
        break;
      case "GERANT":
        utilisateur.setRoleUsed(ROLE_GERANT.name());
        utilisateur.setAuthorities(ROLE_GERANT.getAuthorities());
        break;
      case "PROPRIETAIRE":
        utilisateur.setRoleUsed(ROLE_PROPRIETAIRE.name());
        utilisateur.setAuthorities(ROLE_PROPRIETAIRE.getAuthorities());
        break;
      case "LOCATAIRE":
        utilisateur.setRoleUsed(ROLE_LOCATAIRE.name());
        utilisateur.setAuthorities(ROLE_LOCATAIRE.getAuthorities());
        break;
      case "CLIENT HOTEL":
        utilisateur.setRoleUsed(ROLE_CLIENT_HOTEL.name());
        utilisateur.setAuthorities(ROLE_CLIENT_HOTEL.getAuthorities());
        break;
      default:
        log.error(
          "You should give a role in this list (superviseur, gerant, proprietaire,locataire) but in this cas the role is not wel given {}",
          normalizedRoleName
        );
        break;
    }
  }

  private String normalizeRoleName(String roleName) {
    if (!StringUtils.hasText(roleName)) {
      throw new InvalidEntityException(
        "Aucun role has been found with Code " + roleName,
        ErrorCodes.ROLE_NOT_FOUND
      );
    }

    String normalizedRoleName = roleName.trim().toUpperCase();
    if (normalizedRoleName.startsWith("ROLE_")) {
      return normalizedRoleName.substring(5);
    }

    return normalizedRoleName;
  }

  private Long resolveUserAgencyId(Long requestedAgenceId, Long creatorId) {
    if (requestedAgenceId != null && requestedAgenceId > 0) {
      return requestedAgenceId;
    }

    return findAgencyByNameOrSigle(
      DEFAULT_USER_AGENCY_NAME,
      DEFAULT_USER_AGENCY_SIGLE
    )
      .or(() ->
        findAgencyByNameOrSigle(
          SECONDARY_USER_AGENCY_NAME,
          SECONDARY_USER_AGENCY_SIGLE
        )
      )
      .or(() ->
        findAgencyByNameOrSigle(
          LEGACY_USER_AGENCY_NAME,
          LEGACY_USER_AGENCY_SIGLE
        )
      )
      .map(this::extractAgenceId)
      .orElseGet(() -> extractAgenceId(createDefaultAgency(creatorId)));
  }

  private Optional<AgenceImmobiliere> findAgencyByNameOrSigle(
    String agencyName,
    String agencySigle
  ) {
    return agenceImmobiliereRepository
      .findAll()
      .stream()
      .filter(agence ->
        agencyName.equalsIgnoreCase(agence.getNomAgence()) ||
        agencySigle.equalsIgnoreCase(agence.getSigleAgence())
      )
      .findFirst();
  }

  private AgenceImmobiliere createDefaultAgency(Long creatorId) {
    AgenceImmobiliere agence = new AgenceImmobiliere();
    agence.setNomAgence(DEFAULT_USER_AGENCY_NAME);
    agence.setSigleAgence(DEFAULT_USER_AGENCY_SIGLE);
    agence.setTelAgence("0700000001");
    agence.setMobileAgence("0700000001");
    agence.setEmailAgence("residence.seve@gestimo.local");
    agence.setCompteContribuable("CI-SEVE-001");
    agence.setRegimeFiscaleAgence("REGIME REEL");
    agence.setFaxAgence("00000000");
    agence.setAdresseAgence("ABIDJAN");
    agence.setCapital(1000000);
    agence.setIdCreateur(creatorId == null ? 1L : creatorId);

    AgenceImmobiliere savedAgence = agenceImmobiliereRepository.save(agence);
    savedAgence.setIdAgence(savedAgence.getId());
    return agenceImmobiliereRepository.save(savedAgence);
  }

  private Long extractAgenceId(AgenceImmobiliere agenceImmobiliere) {
    return agenceImmobiliere.getIdAgence() != null
      ? agenceImmobiliere.getIdAgence()
      : agenceImmobiliere.getId();
  }

  private Long resolveCreatorId(UtilisateurRequestDto dto) {
    return dto.getIdCreateur() != null ? dto.getIdCreateur() : dto.getUserCreate();
  }
}
