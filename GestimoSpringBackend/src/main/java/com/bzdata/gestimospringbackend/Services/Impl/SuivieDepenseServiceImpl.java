package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.DepenseManagementUpsertRequestDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseSupplierDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseValidationActionDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseValidationHistoryDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseValidationLevelDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseWorkflowConfigDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseEncaisPeriodeDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseEncaissementDto;
import com.bzdata.gestimospringbackend.Models.DepenseValidationHistory;
import com.bzdata.gestimospringbackend.Models.DepenseWorkflowConfig;
import com.bzdata.gestimospringbackend.Models.SuivieDepense;
import com.bzdata.gestimospringbackend.Services.SuivieDepenseService;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.enumeration.OperationType;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.repository.DepenseValidationHistoryRepository;
import com.bzdata.gestimospringbackend.repository.DepenseWorkflowConfigRepository;
import com.bzdata.gestimospringbackend.repository.SuivieDepenseRepository;
import com.bzdata.gestimospringbackend.validator.SuivieDepenseValidator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class SuivieDepenseServiceImpl implements SuivieDepenseService {

  private static final String ACTION_SAVE_DRAFT = "BROUILLON";
  private static final String ACTION_SUBMIT = "SOUMETTRE";
  private static final String PAYMENT_STATUS_PENDING = "EN_ATTENTE_PAIEMENT";
  private static final String PAYMENT_STATUS_PAID = "PAYEE";
  private static final String WORKFLOW_STATUS_DRAFT = "BROUILLON";
  private static final String WORKFLOW_STATUS_WAITING_1 = "EN_ATTENTE_VALIDATION_NIVEAU_1";
  private static final String WORKFLOW_STATUS_WAITING_2 = "EN_ATTENTE_VALIDATION_NIVEAU_2";
  private static final String WORKFLOW_STATUS_WAITING_3 = "EN_ATTENTE_VALIDATION_NIVEAU_3";
  private static final String WORKFLOW_STATUS_APPROVED = "VALIDEE";
  private static final String WORKFLOW_STATUS_REJECTED = "REJETEE";
  private static final String WORKFLOW_STATUS_CANCELLED = "ANNULEE";

  private static final List<String> DEFAULT_CATEGORIES = List.of(
    "Entretien",
    "Reparation",
    "Fournitures",
    "Electricite",
    "Eau",
    "Securite"
  );

  private static final List<String> DEFAULT_PAYMENT_MODES = List.of(
    "Espece",
    "Cheque",
    "Virement bancaire",
    "Mobile money"
  );

  private static final List<String> ALLOWED_FILE_TYPES = List.of(
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg"
  );

  private static final TypeReference<List<String>> STRING_LIST_TYPE = new TypeReference<>() {};

  private final SuivieDepenseRepository suivieDepenseRepository;
  private final DepenseWorkflowConfigRepository depenseWorkflowConfigRepository;
  private final DepenseValidationHistoryRepository depenseValidationHistoryRepository;
  private final BailMapperImpl bailMapperImpl;
  private final ChapitreRepository chapitreRepository;
  private final ObjectMapper objectMapper;

  @Override
  public List<SuivieDepenseDto> saveNewDepense(SuivieDepenseDto dto) {
    List<String> errors = SuivieDepenseValidator.validate(dto);
    if (!errors.isEmpty()) {
      throw new InvalidEntityException(
        "Les informations de depense sont invalides.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID,
        errors
      );
    }

    SuivieDepense entity = dto.getId() == null || dto.getId() == 0
      ? new SuivieDepense()
      : findEntityById(dto.getId());

    ensureUniqueReference(dto.getIdAgence(), resolveLegacyReference(dto), dto.getId());
    applyLegacyValues(entity, dto);
    suivieDepenseRepository.save(entity);
    return findAlEncaissementParAgence(dto.getIdAgence());
  }

  @Override
  public SuivieDepenseDto saveOrSubmitDepense(
    DepenseManagementUpsertRequestDto dto,
    MultipartFile justificatif
  ) {
    List<String> errors = validateManagementRequest(dto, justificatif);
    if (!errors.isEmpty()) {
      throw new InvalidEntityException(
        "Les informations de la depense sont invalides.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID,
        errors
      );
    }

    SuivieDepense entity = dto.getId() == null || dto.getId() == 0
      ? new SuivieDepense()
      : findEntityById(dto.getId());

    ensureUniqueReference(dto.getIdAgence(), dto.getReferenceDepense(), dto.getId());
    applyManagementValues(entity, dto, justificatif, findChapitre(dto.getIdChapitre()));

    if (ACTION_SUBMIT.equals(normalizeAction(dto.getAction()))) {
      applySubmissionStatus(
        entity,
        dto,
        getOrCreateWorkflowConfig(dto.getIdAgence(), dto.getIdCreateur())
      );
      SuivieDepense saved = suivieDepenseRepository.save(entity);
      saveHistory(saved, 0, "SOUMISE", saved.getWorkflowStatus(), buildActionFromRequest(dto));
      return mapWithHistory(saved, null);
    }

    applyDraftStatus(entity, dto);
    return mapWithHistory(suivieDepenseRepository.save(entity), null);
  }

  @Override
  public List<SuivieDepenseDto> findAllDepensesGestion(Long idAgence) {
    List<SuivieDepense> depenses = suivieDepenseRepository.findAllByIdAgenceOrderByIdDesc(idAgence);
    Map<Long, List<DepenseValidationHistoryDto>> historyMap = buildHistoryMap(depenses);
    return depenses.stream().map(depense -> mapWithHistory(depense, historyMap)).collect(Collectors.toList());
  }

  @Override
  public SuivieDepenseDto approveDepense(Long id, DepenseValidationActionDto actionDto) {
    SuivieDepense depense = findEntityById(id);
    ensureDepenseCanBeValidated(depense, actionDto);

    int currentLevel = depense.getCurrentValidationLevel() == null ? 1 : depense.getCurrentValidationLevel();
    if (currentLevel >= (depense.getMaxValidationLevel() == null ? 0 : depense.getMaxValidationLevel())) {
      depense.setWorkflowStatus(WORKFLOW_STATUS_APPROVED);
      depense.setValidatedAt(Instant.now());
    } else {
      depense.setCurrentValidationLevel(currentLevel + 1);
      depense.setWorkflowStatus(resolveWaitingStatus(depense.getCurrentValidationLevel()));
    }

    SuivieDepense saved = suivieDepenseRepository.save(depense);
    saveHistory(saved, currentLevel, "APPROUVEE", saved.getWorkflowStatus(), actionDto);
    return mapWithHistory(saved, null);
  }

  @Override
  public SuivieDepenseDto rejectDepense(Long id, DepenseValidationActionDto actionDto) {
    SuivieDepense depense = findEntityById(id);
    ensureDepenseCanBeValidated(depense, actionDto);
    depense.setWorkflowStatus(WORKFLOW_STATUS_REJECTED);
    depense.setRejectedAt(Instant.now());
    SuivieDepense saved = suivieDepenseRepository.save(depense);
    saveHistory(saved, depense.getCurrentValidationLevel(), "REJETEE", saved.getWorkflowStatus(), actionDto);
    return mapWithHistory(saved, null);
  }

  @Override
  public SuivieDepenseDto cancelDepense(Long id, DepenseValidationActionDto actionDto) {
    SuivieDepense depense = findEntityById(id);
    if (
      actionDto != null &&
      actionDto.getUtilisateurId() != null &&
      depense.getDemandeurId() != null &&
      !actionDto.getUtilisateurId().equals(depense.getDemandeurId())
    ) {
      throw new InvalidEntityException(
        "Seul le demandeur peut annuler cette depense.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
    if (WORKFLOW_STATUS_APPROVED.equals(normalizeWorkflowStatus(depense.getWorkflowStatus()))) {
      throw new InvalidEntityException(
        "Une depense deja validee ne peut plus etre annulee.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
    depense.setWorkflowStatus(WORKFLOW_STATUS_CANCELLED);
    depense.setCancelledAt(Instant.now());
    SuivieDepense saved = suivieDepenseRepository.save(depense);
    saveHistory(saved, depense.getCurrentValidationLevel(), "ANNULEE", saved.getWorkflowStatus(), actionDto);
    return mapWithHistory(saved, null);
  }

  @Override
  public DepenseWorkflowConfigDto getWorkflowConfig(Long idAgence) {
    return mapWorkflowConfig(getOrCreateWorkflowConfig(idAgence, null));
  }

  @Override
  public DepenseWorkflowConfigDto saveWorkflowConfig(DepenseWorkflowConfigDto dto) {
    validateWorkflowConfig(dto);
    DepenseWorkflowConfig config = depenseWorkflowConfigRepository
      .findFirstByIdAgenceOrderByIdDesc(dto.getIdAgence())
      .orElseGet(DepenseWorkflowConfig::new);

    config.setIdAgence(dto.getIdAgence());
    config.setIdCreateur(dto.getIdCreateur());
    config.setActive(dto.isActive());
    config.setValidationThreshold(dto.getValidationThreshold() == null ? 0D : dto.getValidationThreshold());
    config.setLevelCount(dto.getLevelCount() == null ? 2 : dto.getLevelCount());
    config.setCategoriesJson(writeStringList(sanitizeReferenceValues(dto.getCategories(), DEFAULT_CATEGORIES)));
    config.setPaymentModesJson(writeStringList(sanitizeReferenceValues(dto.getPaymentModes(), DEFAULT_PAYMENT_MODES)));
    Map<Integer, DepenseValidationLevelDto> levels = dto.getLevels() == null
      ? Collections.emptyMap()
      : dto.getLevels().stream().collect(Collectors.toMap(
        DepenseValidationLevelDto::getLevelOrder,
        level -> level,
        (left, right) -> right
      ));

    applyLevelConfig(config, levels.get(1), 1);
    applyLevelConfig(config, levels.get(2), 2);
    applyLevelConfig(config, levels.get(3), 3);
    return mapWorkflowConfig(depenseWorkflowConfigRepository.save(config));
  }

  @Override
  public List<DepenseSupplierDto> listSupplierSuggestions(Long idAgence) {
    Map<String, DepenseSupplierDto> suppliers = new LinkedHashMap<>();
    suivieDepenseRepository
      .findAllByIdAgenceOrderByIdDesc(idAgence)
      .stream()
      .filter(depense -> StringUtils.hasText(depense.getFournisseurNom()))
      .forEach(depense -> {
        String key = depense.getFournisseurNom().trim().toLowerCase(Locale.ROOT);
        suppliers.putIfAbsent(
          key,
          new DepenseSupplierDto(
            depense.getFournisseurNom(),
            depense.getFournisseurTelephone(),
            depense.getFournisseurEmail()
          )
        );
      });
    return new ArrayList<>(suppliers.values());
  }

  @Override
  public Resource downloadJustificatif(Long id) {
    SuivieDepense depense = findEntityById(id);
    if (depense.getJustificatifData() == null || depense.getJustificatifData().length == 0) {
      throw new InvalidEntityException(
        "Aucun justificatif n'est disponible pour cette depense.",
        ErrorCodes.SUIVIEDEPENSE_NOT_FOUND
      );
    }
    return new ByteArrayResource(depense.getJustificatifData());
  }

  @Override
  public boolean annulerTransactionByCodeTransaction(String codeTransation) {
    return false;
  }

  @Override
  public boolean annulerTransactionById(String Id) {
    return false;
  }

  @Override
  public List<SuivieDepenseDto> supprimerUneEcritureById(Long id, Long idAgence) {
    suivieDepenseRepository.delete(findEntityById(id));
    return findAlEncaissementParAgence(idAgence);
  }

  @Override
  public SuivieDepenseDto findById(Long id) {
    return mapWithHistory(findEntityById(id), null);
  }

  @Override
  public SuivieDepenseDto findByCodeTransaction(String codeTransation) {
    if (!StringUtils.hasText(codeTransation)) {
      return null;
    }
    return suivieDepenseRepository
      .findByCodeTransaction(codeTransation)
      .map(depense -> mapWithHistory(depense, null))
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucune depense n'a ete trouvee avec le code " + codeTransation,
          ErrorCodes.SUIVIEDEPENSE_NOT_FOUND
        )
      );
  }

  @Override
  public List<SuivieDepenseDto> findByDateEncaissement(
    SuivieDepenseEncaissementDto suivieDepenseEncaissementDto
  ) {
    if (suivieDepenseEncaissementDto == null) {
      return Collections.emptyList();
    }
    return suivieDepenseRepository
      .findAllByIdAgenceOrderByIdDesc(suivieDepenseEncaissementDto.getIdAgence())
      .stream()
      .filter(this::isCountedInCashViews)
      .filter(depense -> equalsDate(depense.getDateEncaissement(), suivieDepenseEncaissementDto.getDateEncaissement()))
      .map(depense -> mapWithHistory(depense, Collections.emptyMap()))
      .collect(Collectors.toList());
  }

  @Override
  public List<SuivieDepenseDto> findByAllEncaissementByPeriode(
    SuivieDepenseEncaisPeriodeDto suivieDepenseEncaisPeriodeDto
  ) {
    if (suivieDepenseEncaisPeriodeDto == null) {
      return Collections.emptyList();
    }
    return suivieDepenseRepository
      .findAllByIdAgenceAndDateEncaissementBetweenOrderByIdDesc(
        suivieDepenseEncaisPeriodeDto.getIdAgence(),
        suivieDepenseEncaisPeriodeDto.getDateDebutEncaissement(),
        suivieDepenseEncaisPeriodeDto.getDateFinEncaissement()
      )
      .stream()
      .filter(this::isCountedInCashViews)
      .map(depense -> mapWithHistory(depense, Collections.emptyMap()))
      .collect(Collectors.toList());
  }

  @Override
  public List<SuivieDepenseDto> findAlEncaissementParAgence(Long idAgence) {
    return suivieDepenseRepository
      .findAllByIdAgenceOrderByIdDesc(idAgence)
      .stream()
      .filter(this::isCountedInCashViews)
      .map(depense -> mapWithHistory(depense, Collections.emptyMap()))
      .collect(Collectors.toList());
  }

  @Override
  public SuivieDepenseEncaisPeriodeDto totalSuiviDepenseEntreDeuxDate(
    Long idAgence,
    LocalDate debut,
    LocalDate fin
  ) {
    double total = suivieDepenseRepository
      .findAllByIdAgenceAndDateEncaissementBetweenOrderByIdDesc(idAgence, debut, fin)
      .stream()
      .filter(this::isCountedInCashViews)
      .map(SuivieDepense::getMontantDepense)
      .filter(montant -> montant != null && montant > 0)
      .mapToDouble(Double::doubleValue)
      .sum();

    SuivieDepenseEncaisPeriodeDto dto = new SuivieDepenseEncaisPeriodeDto();
    dto.setDateDebutEncaissement(debut);
    dto.setDateFinEncaissement(fin);
    dto.setIdAgence(idAgence);
    dto.setTotalMontantDepense(total);
    dto.setCodeTransaction("DEPENSE");
    dto.setDesignation("Sortie de caisse de " + debut + " a " + fin);
    return dto;
  }

  @Override
  public List<SuivieDepenseDto> listSuiviDepenseEntreDeuxDate(
    Long idAgence,
    LocalDate debut,
    LocalDate fin
  ) {
    return suivieDepenseRepository
      .findAllByIdAgenceAndDateEncaissementBetweenOrderByIdDesc(idAgence, debut, fin)
      .stream()
      .filter(this::isCountedInCashViews)
      .map(depense -> mapWithHistory(depense, Collections.emptyMap()))
      .collect(Collectors.toList());
  }

  @Override
  public int countSuiviNonCloturerAvantDate(LocalDate dateEncai, Long idCreateur) {
    return (int) suivieDepenseRepository
      .findAll()
      .stream()
      .filter(this::isCountedInCashViews)
      .filter(depense -> equalsLong(depense.getIdCreateur(), idCreateur))
      .filter(depense -> isBefore(depense.getDateEncaissement(), dateEncai))
      .count();
  }

  @Override
  public List<SuivieDepenseDto> listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate(
    Long idcaisse,
    LocalDate dateDepriseEnCompte,
    Long idChapitre
  ) {
    return suivieDepenseRepository
      .findAll()
      .stream()
      .filter(this::isCountedInCashViews)
      .filter(depense -> equalsLong(depense.getIdCreateur(), idcaisse))
      .filter(depense -> isBefore(depense.getDateEncaissement(), dateDepriseEnCompte))
      .filter(depense -> depense.getChapitreSuivis() != null && equalsLong(depense.getChapitreSuivis().getId(), idChapitre))
      .map(depense -> mapWithHistory(depense, Collections.emptyMap()))
      .collect(Collectors.toList());
  }

  @Override
  public int countSuiviNonCloturerParCaisseEtChapitreAvantDate(
    LocalDate datePriseEnCompteEncaii,
    Long idCaiss,
    Long idChapitre
  ) {
    return (int) suivieDepenseRepository
      .findAll()
      .stream()
      .filter(this::isCountedInCashViews)
      .filter(depense -> equalsLong(depense.getIdCreateur(), idCaiss))
      .filter(depense -> isBefore(depense.getDateEncaissement(), datePriseEnCompteEncaii))
      .filter(depense -> depense.getChapitreSuivis() != null && equalsLong(depense.getChapitreSuivis().getId(), idChapitre))
      .count();
  }

  @Override
  public List<SuivieDepenseDto> listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate(
    Long idcaisse,
    LocalDate dateDebut,
    LocalDate dateFin,
    Long idChapitre
  ) {
    return suivieDepenseRepository
      .findAll()
      .stream()
      .filter(this::isCountedInCashViews)
      .filter(depense -> equalsLong(depense.getIdCreateur(), idcaisse))
      .filter(depense -> isBetweenInclusive(depense.getDateEncaissement(), dateDebut, dateFin))
      .filter(depense -> depense.getChapitreSuivis() != null && equalsLong(depense.getChapitreSuivis().getId(), idChapitre))
      .map(depense -> mapWithHistory(depense, Collections.emptyMap()))
      .collect(Collectors.toList());
  }

  private void applyLegacyValues(SuivieDepense entity, SuivieDepenseDto dto) {
    entity.setIdAgence(dto.getIdAgence());
    entity.setIdCreateur(dto.getIdCreateur());
    entity.setDateEncaissement(dto.getDateEncaissement());
    entity.setReferenceDepense(resolveLegacyReference(dto));
    entity.setCodeTransaction(resolveLegacyCode(dto));
    entity.setDesignation(dto.getDesignation());
    entity.setLibelleDepense(StringUtils.hasText(dto.getLibelleDepense()) ? dto.getLibelleDepense() : dto.getDesignation());
    entity.setDescriptionDepense(dto.getDescriptionDepense());
    entity.setCategorieDepense(StringUtils.hasText(dto.getCategorieDepense()) ? dto.getCategorieDepense() : "Depense");
    entity.setMontantDepense(dto.getMontantDepense());
    entity.setModePaiement(dto.getModePaiement());
    entity.setOperationType(dto.getOperationType() == null ? OperationType.DEBIT : dto.getOperationType());
    entity.setStatutPaiement(StringUtils.hasText(dto.getStatutPaiement()) ? dto.getStatutPaiement() : PAYMENT_STATUS_PAID);
    entity.setDatePaiement(dto.getDatePaiement() == null ? dto.getDateEncaissement() : dto.getDatePaiement());
    entity.setWorkflowStatus(StringUtils.hasText(dto.getWorkflowStatus()) ? dto.getWorkflowStatus() : WORKFLOW_STATUS_APPROVED);
    entity.setWorkflowRequired(Boolean.FALSE);
    entity.setCurrentValidationLevel(0);
    entity.setMaxValidationLevel(0);
    entity.setValidatedAt(entity.getValidatedAt() == null ? Instant.now() : entity.getValidatedAt());
    entity.setDemandeurId(dto.getIdCreateur());
    entity.setDemandeurNom(StringUtils.hasText(dto.getDemandeurNom()) ? dto.getDemandeurNom() : "Utilisateur " + dto.getIdCreateur());
    entity.setChapitreSuivis(findChapitre(dto.getIdChapitre()));
  }

  private void applyManagementValues(
    SuivieDepense entity,
    DepenseManagementUpsertRequestDto dto,
    MultipartFile justificatif,
    Chapitre chapitre
  ) {
    entity.setIdAgence(dto.getIdAgence());
    entity.setIdCreateur(dto.getIdCreateur());
    entity.setDemandeurId(dto.getIdCreateur());
    entity.setDemandeurNom(StringUtils.hasText(dto.getDemandeurNom()) ? dto.getDemandeurNom().trim() : "Utilisateur " + dto.getIdCreateur());
    entity.setDateEncaissement(dto.getDateEncaissement());
    entity.setReferenceDepense(dto.getReferenceDepense().trim());
    entity.setCategorieDepense(dto.getCategorieDepense().trim());
    entity.setLibelleDepense(dto.getLibelleDepense().trim());
    entity.setDesignation(dto.getLibelleDepense().trim());
    entity.setDescriptionDepense(trimToNull(dto.getDescriptionDepense()));
    entity.setMontantDepense(dto.getMontantDepense());
    entity.setModePaiement(dto.getModePaiement().trim());
    entity.setOperationType(OperationType.DEBIT);
    entity.setStatutPaiement(normalizePaymentStatus(dto.getStatutPaiement()));
    entity.setDatePaiement(dto.getDatePaiement());
    entity.setBienImmobilierId(dto.getBienImmobilierId());
    entity.setBienImmobilierCode(trimToNull(dto.getBienImmobilierCode()));
    entity.setBienImmobilierLibelle(trimToNull(dto.getBienImmobilierLibelle()));
    entity.setTypeBienImmobilier(trimToNull(dto.getTypeBienImmobilier()));
    entity.setAppartementLocalId(dto.getAppartementLocalId());
    entity.setAppartementLocalLibelle(trimToNull(dto.getAppartementLocalLibelle()));
    entity.setFournisseurNom(trimToNull(dto.getFournisseurNom()));
    entity.setFournisseurTelephone(trimToNull(dto.getFournisseurTelephone()));
    entity.setFournisseurEmail(trimToNull(dto.getFournisseurEmail()));
    entity.setChapitreSuivis(chapitre);
    entity.setCodeTransaction(StringUtils.hasText(entity.getCodeTransaction()) ? entity.getCodeTransaction() : UUID.randomUUID().toString());

    if (justificatif != null && !justificatif.isEmpty()) {
      try {
        entity.setJustificatifNom(justificatif.getOriginalFilename());
        entity.setJustificatifType(justificatif.getContentType());
        entity.setJustificatifData(justificatif.getBytes());
      } catch (IOException exception) {
        throw new InvalidEntityException(
          "Impossible de lire le justificatif transmis.",
          exception,
          ErrorCodes.SUIVIEDEPENSE_NOT_VALID
        );
      }
    }
  }

  private void applyDraftStatus(SuivieDepense entity, DepenseManagementUpsertRequestDto dto) {
    entity.setWorkflowRequired(Boolean.FALSE);
    entity.setWorkflowStatus(WORKFLOW_STATUS_DRAFT);
    entity.setCurrentValidationLevel(0);
    entity.setMaxValidationLevel(0);
    clearValidationSnapshot(entity);
    if (PAYMENT_STATUS_PAID.equals(normalizePaymentStatus(dto.getStatutPaiement()))) {
      entity.setDatePaiement(dto.getDatePaiement() == null ? dto.getDateEncaissement() : dto.getDatePaiement());
    }
  }

  private void applySubmissionStatus(
    SuivieDepense entity,
    DepenseManagementUpsertRequestDto dto,
    DepenseWorkflowConfig config
  ) {
    double threshold = config.getValidationThreshold() == null ? 0D : config.getValidationThreshold();
    boolean workflowRequired =
      Boolean.TRUE.equals(config.getActive()) &&
      dto.getMontantDepense() != null &&
      dto.getMontantDepense() > threshold;

    entity.setSubmittedAt(Instant.now());
    entity.setRejectedAt(null);
    entity.setCancelledAt(null);
    entity.setValidatedAt(null);
    entity.setWorkflowRequired(workflowRequired);

    if (!workflowRequired) {
      entity.setWorkflowStatus(WORKFLOW_STATUS_APPROVED);
      entity.setCurrentValidationLevel(0);
      entity.setMaxValidationLevel(0);
      entity.setValidatedAt(Instant.now());
      clearValidationSnapshot(entity);
      return;
    }

    List<DepenseValidationLevelDto> activeLevels = extractActiveLevels(config);
    if (activeLevels.isEmpty()) {
      throw new InvalidEntityException(
        "Le circuit de validation des depenses est actif mais aucun validateur n'est configure.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }

    entity.setMaxValidationLevel(activeLevels.size());
    entity.setCurrentValidationLevel(1);
    entity.setWorkflowStatus(resolveWaitingStatus(1));
    snapshotValidationLevels(entity, activeLevels);
  }

  private List<String> validateManagementRequest(
    DepenseManagementUpsertRequestDto dto,
    MultipartFile justificatif
  ) {
    List<String> errors = new ArrayList<>();
    if (dto == null) {
      errors.add("La depense est introuvable.");
      return errors;
    }
    if (!StringUtils.hasText(dto.getReferenceDepense())) {
      errors.add("La reference est obligatoire.");
    }
    if (dto.getDateEncaissement() == null) {
      errors.add("La date est obligatoire.");
    }
    if (!StringUtils.hasText(dto.getCategorieDepense())) {
      errors.add("La categorie est obligatoire.");
    }
    if (!StringUtils.hasText(dto.getLibelleDepense())) {
      errors.add("Le libelle est obligatoire.");
    }
    if (dto.getMontantDepense() == null || dto.getMontantDepense() <= 0) {
      errors.add("Le montant doit etre strictement superieur a zero.");
    }
    if (!StringUtils.hasText(dto.getModePaiement())) {
      errors.add("Le mode de paiement est obligatoire.");
    }
    if (dto.getBienImmobilierId() == null) {
      errors.add("Le bien immobilier est obligatoire.");
    }
    if (PAYMENT_STATUS_PAID.equals(normalizePaymentStatus(dto.getStatutPaiement())) && dto.getDatePaiement() == null) {
      errors.add("La date de paiement est obligatoire lorsque la depense est marquee comme payee.");
    }
    if (StringUtils.hasText(dto.getFournisseurEmail()) && !isEmailValid(dto.getFournisseurEmail())) {
      errors.add("L'email du fournisseur est invalide.");
    }
    if (StringUtils.hasText(dto.getFournisseurTelephone()) && !dto.getFournisseurTelephone().trim().matches("^[0-9+()\\-\\s]{6,20}$")) {
      errors.add("Le telephone du fournisseur est invalide.");
    }
    if (justificatif != null && !justificatif.isEmpty() && !ALLOWED_FILE_TYPES.contains(justificatif.getContentType())) {
      errors.add("Le justificatif doit etre un PDF, JPG, JPEG ou PNG.");
    }
    return errors;
  }

  private void validateWorkflowConfig(DepenseWorkflowConfigDto dto) {
    if (dto == null || dto.getIdAgence() == null) {
      throw new InvalidEntityException("La configuration de depense est invalide.", ErrorCodes.SUIVIEDEPENSE_NOT_VALID);
    }
    if (dto.getValidationThreshold() == null || dto.getValidationThreshold() < 0) {
      throw new InvalidEntityException("Le seuil de validation est invalide.", ErrorCodes.SUIVIEDEPENSE_NOT_VALID);
    }
    if (dto.getLevelCount() == null || (dto.getLevelCount() != 2 && dto.getLevelCount() != 3)) {
      throw new InvalidEntityException("Le nombre de niveaux doit etre egal a 2 ou 3.", ErrorCodes.SUIVIEDEPENSE_NOT_VALID);
    }
    if (!dto.isActive()) {
      return;
    }
    List<DepenseValidationLevelDto> activeLevels = dto.getLevels() == null
      ? Collections.emptyList()
      : dto.getLevels().stream().filter(DepenseValidationLevelDto::isActive).sorted(Comparator.comparing(DepenseValidationLevelDto::getLevelOrder)).collect(Collectors.toList());
    if (activeLevels.size() < dto.getLevelCount()) {
      throw new InvalidEntityException(
        "Le nombre de validateurs actifs est insuffisant par rapport au nombre de niveaux.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
  }

  private DepenseWorkflowConfig getOrCreateWorkflowConfig(Long idAgence, Long idCreateur) {
    return depenseWorkflowConfigRepository
      .findFirstByIdAgenceOrderByIdDesc(idAgence)
      .orElseGet(() -> {
        DepenseWorkflowConfig config = new DepenseWorkflowConfig();
        config.setIdAgence(idAgence);
        config.setIdCreateur(idCreateur);
        config.setActive(true);
        config.setValidationThreshold(100000D);
        config.setLevelCount(2);
        config.setCategoriesJson(writeStringList(DEFAULT_CATEGORIES));
        config.setPaymentModesJson(writeStringList(DEFAULT_PAYMENT_MODES));
        config.setLevel1Active(true);
        config.setLevel1Label("Niveau 1");
        config.setLevel1RoleName("SUPERVISEUR");
        config.setLevel2Active(true);
        config.setLevel2Label("Niveau 2");
        config.setLevel2RoleName("GERANT");
        config.setLevel3Active(false);
        return depenseWorkflowConfigRepository.save(config);
      });
  }

  private List<DepenseValidationLevelDto> extractActiveLevels(DepenseWorkflowConfig config) {
    List<DepenseValidationLevelDto> levels = new ArrayList<>();
    levels.add(new DepenseValidationLevelDto(1, config.getLevel1Label(), config.getLevel1RoleName(), config.getLevel1UserId(), config.getLevel1UserDisplayName(), Boolean.TRUE.equals(config.getLevel1Active())));
    levels.add(new DepenseValidationLevelDto(2, config.getLevel2Label(), config.getLevel2RoleName(), config.getLevel2UserId(), config.getLevel2UserDisplayName(), Boolean.TRUE.equals(config.getLevel2Active())));
    levels.add(new DepenseValidationLevelDto(3, config.getLevel3Label(), config.getLevel3RoleName(), config.getLevel3UserId(), config.getLevel3UserDisplayName(), Boolean.TRUE.equals(config.getLevel3Active())));
    return levels.stream().filter(DepenseValidationLevelDto::isActive).sorted(Comparator.comparing(DepenseValidationLevelDto::getLevelOrder)).limit(config.getLevelCount() == null ? 0 : config.getLevelCount()).collect(Collectors.toList());
  }

  private void applyLevelConfig(DepenseWorkflowConfig config, DepenseValidationLevelDto level, int levelNumber) {
    boolean active = level != null && level.isActive();
    String label = level != null ? trimToNull(level.getLevelLabel()) : null;
    String role = level != null ? trimToNull(level.getValidatorRoleName()) : null;
    Long userId = level != null ? level.getValidatorUserId() : null;
    String userName = level != null ? trimToNull(level.getValidatorUserDisplayName()) : null;
    if (levelNumber == 1) {
      config.setLevel1Active(active);
      config.setLevel1Label(label);
      config.setLevel1RoleName(role);
      config.setLevel1UserId(userId);
      config.setLevel1UserDisplayName(userName);
    } else if (levelNumber == 2) {
      config.setLevel2Active(active);
      config.setLevel2Label(label);
      config.setLevel2RoleName(role);
      config.setLevel2UserId(userId);
      config.setLevel2UserDisplayName(userName);
    } else {
      config.setLevel3Active(active);
      config.setLevel3Label(label);
      config.setLevel3RoleName(role);
      config.setLevel3UserId(userId);
      config.setLevel3UserDisplayName(userName);
    }
  }

  private void snapshotValidationLevels(SuivieDepense entity, List<DepenseValidationLevelDto> levels) {
    clearValidationSnapshot(entity);
    levels.forEach(level -> {
      if (level.getLevelOrder() == 1) {
        entity.setValidationNiveau1Label(level.getLevelLabel());
        entity.setValidationNiveau1Role(level.getValidatorRoleName());
        entity.setValidationNiveau1UserId(level.getValidatorUserId());
        entity.setValidationNiveau1UserName(level.getValidatorUserDisplayName());
      } else if (level.getLevelOrder() == 2) {
        entity.setValidationNiveau2Label(level.getLevelLabel());
        entity.setValidationNiveau2Role(level.getValidatorRoleName());
        entity.setValidationNiveau2UserId(level.getValidatorUserId());
        entity.setValidationNiveau2UserName(level.getValidatorUserDisplayName());
      } else if (level.getLevelOrder() == 3) {
        entity.setValidationNiveau3Label(level.getLevelLabel());
        entity.setValidationNiveau3Role(level.getValidatorRoleName());
        entity.setValidationNiveau3UserId(level.getValidatorUserId());
        entity.setValidationNiveau3UserName(level.getValidatorUserDisplayName());
      }
    });
  }

  private void clearValidationSnapshot(SuivieDepense entity) {
    entity.setValidationNiveau1Label(null);
    entity.setValidationNiveau1Role(null);
    entity.setValidationNiveau1UserId(null);
    entity.setValidationNiveau1UserName(null);
    entity.setValidationNiveau2Label(null);
    entity.setValidationNiveau2Role(null);
    entity.setValidationNiveau2UserId(null);
    entity.setValidationNiveau2UserName(null);
    entity.setValidationNiveau3Label(null);
    entity.setValidationNiveau3Role(null);
    entity.setValidationNiveau3UserId(null);
    entity.setValidationNiveau3UserName(null);
  }

  private void ensureDepenseCanBeValidated(SuivieDepense depense, DepenseValidationActionDto actionDto) {
    if (
      depense.getWorkflowStatus() == null ||
      !depense.getWorkflowStatus().startsWith("EN_ATTENTE_VALIDATION_")
    ) {
      throw new InvalidEntityException(
        "Cette depense n'est plus en attente de validation.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
    if (actionDto == null || actionDto.getUtilisateurId() == null) {
      throw new InvalidEntityException("Le validateur est obligatoire.", ErrorCodes.SUIVIEDEPENSE_NOT_VALID);
    }
    int level = depense.getCurrentValidationLevel() == null ? 1 : depense.getCurrentValidationLevel();
    Long expectedUserId = getLevelUserId(depense, level);
    String expectedRole = normalizeRoleName(getLevelRole(depense, level));
    String actualRole = normalizeRoleName(actionDto.getUtilisateurRole());
    boolean userMatches = expectedUserId != null && expectedUserId.equals(actionDto.getUtilisateurId());
    boolean roleMatches = StringUtils.hasText(expectedRole) && expectedRole.equals(actualRole);
    if (!userMatches && !roleMatches) {
      throw new InvalidEntityException(
        "Vous n'etes pas autorise a valider ce niveau de depense.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
  }

  private void saveHistory(
    SuivieDepense depense,
    Integer level,
    String actionType,
    String workflowStatus,
    DepenseValidationActionDto actionDto
  ) {
    DepenseValidationHistory history = new DepenseValidationHistory();
    history.setIdAgence(depense.getIdAgence());
    history.setIdCreateur(actionDto != null ? actionDto.getUtilisateurId() : depense.getIdCreateur());
    history.setSuivieDepense(depense);
    history.setValidationLevel(level);
    history.setActionType(actionType);
    history.setWorkflowStatusAfterAction(workflowStatus);
    history.setActorUserId(actionDto != null ? actionDto.getUtilisateurId() : depense.getIdCreateur());
    history.setActorName(actionDto != null ? trimToNull(actionDto.getUtilisateurNom()) : depense.getDemandeurNom());
    history.setActorRoleName(actionDto != null ? trimToNull(actionDto.getUtilisateurRole()) : null);
    history.setCommentaire(actionDto != null ? trimToNull(actionDto.getCommentaire()) : null);
    history.setActionAt(Instant.now());
    depenseValidationHistoryRepository.save(history);
  }

  private Map<Long, List<DepenseValidationHistoryDto>> buildHistoryMap(List<SuivieDepense> depenses) {
    if (depenses == null || depenses.isEmpty()) {
      return Collections.emptyMap();
    }
    List<Long> ids = depenses.stream().map(SuivieDepense::getId).filter(id -> id != null).collect(Collectors.toList());
    if (ids.isEmpty()) {
      return Collections.emptyMap();
    }
    return depenseValidationHistoryRepository
      .findAllBySuivieDepenseIdInOrderByActionAtAsc(ids)
      .stream()
      .collect(Collectors.groupingBy(
        history -> history.getSuivieDepense().getId(),
        LinkedHashMap::new,
        Collectors.mapping(this::mapHistory, Collectors.toList())
      ));
  }

  private DepenseValidationHistoryDto mapHistory(DepenseValidationHistory history) {
    return new DepenseValidationHistoryDto(
      history.getId(),
      history.getValidationLevel(),
      history.getActionType(),
      history.getWorkflowStatusAfterAction(),
      history.getActorUserId(),
      history.getActorName(),
      history.getActorRoleName(),
      history.getCommentaire(),
      history.getActionAt()
    );
  }

  private SuivieDepenseDto mapWithHistory(
    SuivieDepense depense,
    Map<Long, List<DepenseValidationHistoryDto>> historyMap
  ) {
    SuivieDepenseDto dto = bailMapperImpl.fromSuivieDepense(depense);
    if (historyMap == null) {
      dto.setHistory(
        depenseValidationHistoryRepository
          .findAllBySuivieDepenseIdOrderByActionAtAsc(depense.getId())
          .stream()
          .map(this::mapHistory)
          .collect(Collectors.toList())
      );
    } else {
      dto.setHistory(historyMap.getOrDefault(depense.getId(), new ArrayList<>()));
    }
    return dto;
  }

  private DepenseWorkflowConfigDto mapWorkflowConfig(DepenseWorkflowConfig config) {
    DepenseWorkflowConfigDto dto = new DepenseWorkflowConfigDto();
    dto.setId(config.getId());
    dto.setIdAgence(config.getIdAgence());
    dto.setIdCreateur(config.getIdCreateur());
    dto.setActive(Boolean.TRUE.equals(config.getActive()));
    dto.setValidationThreshold(config.getValidationThreshold() == null ? 0D : config.getValidationThreshold());
    dto.setLevelCount(config.getLevelCount() == null ? 2 : config.getLevelCount());
    dto.setCategories(readStringList(config.getCategoriesJson(), DEFAULT_CATEGORIES));
    dto.setPaymentModes(readStringList(config.getPaymentModesJson(), DEFAULT_PAYMENT_MODES));
    List<DepenseValidationLevelDto> levels = new ArrayList<>();
    levels.add(new DepenseValidationLevelDto(1, config.getLevel1Label(), config.getLevel1RoleName(), config.getLevel1UserId(), config.getLevel1UserDisplayName(), Boolean.TRUE.equals(config.getLevel1Active())));
    levels.add(new DepenseValidationLevelDto(2, config.getLevel2Label(), config.getLevel2RoleName(), config.getLevel2UserId(), config.getLevel2UserDisplayName(), Boolean.TRUE.equals(config.getLevel2Active())));
    levels.add(new DepenseValidationLevelDto(3, config.getLevel3Label(), config.getLevel3RoleName(), config.getLevel3UserId(), config.getLevel3UserDisplayName(), Boolean.TRUE.equals(config.getLevel3Active())));
    dto.setLevels(levels);
    return dto;
  }

  private Chapitre findChapitre(Long idChapitre) {
    Long chapitreId = idChapitre == null || idChapitre == 0 ? 1L : idChapitre;
    return chapitreRepository.findById(chapitreId).orElse(null);
  }

  private SuivieDepense findEntityById(Long id) {
    return suivieDepenseRepository
      .findById(id)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucune depense n'a ete trouvee avec l'identifiant " + id,
          ErrorCodes.SUIVIEDEPENSE_NOT_FOUND
        )
      );
  }

  private void ensureUniqueReference(Long idAgence, String reference, Long currentId) {
    Optional<SuivieDepense> existing = suivieDepenseRepository.findByReferenceDepenseIgnoreCaseAndIdAgence(reference, idAgence);
    if (existing.isPresent() && (currentId == null || !existing.get().getId().equals(currentId))) {
      throw new InvalidEntityException(
        "La reference de depense existe deja.",
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
  }

  private boolean isCountedInCashViews(SuivieDepense depense) {
    boolean legacyLine = !StringUtils.hasText(depense.getWorkflowStatus()) && !StringUtils.hasText(depense.getStatutPaiement());
    return legacyLine ||
      (
        PAYMENT_STATUS_PAID.equals(normalizePaymentStatus(depense.getStatutPaiement())) &&
        WORKFLOW_STATUS_APPROVED.equals(normalizeWorkflowStatus(depense.getWorkflowStatus()))
      );
  }

  private String normalizePaymentStatus(String status) {
    if (!StringUtils.hasText(status)) {
      return PAYMENT_STATUS_PENDING;
    }
    String normalized = status.trim().toUpperCase(Locale.ROOT);
    return "PAYEE".equals(normalized) ? PAYMENT_STATUS_PAID : normalized;
  }

  private String normalizeWorkflowStatus(String status) {
    if (!StringUtils.hasText(status)) {
      return WORKFLOW_STATUS_APPROVED;
    }
    return status.trim().toUpperCase(Locale.ROOT);
  }

  private String normalizeAction(String action) {
    if (!StringUtils.hasText(action)) {
      return ACTION_SAVE_DRAFT;
    }
    return action.trim().toUpperCase(Locale.ROOT);
  }

  private String resolveWaitingStatus(Integer level) {
    if (level == null || level <= 1) {
      return WORKFLOW_STATUS_WAITING_1;
    }
    if (level == 2) {
      return WORKFLOW_STATUS_WAITING_2;
    }
    return WORKFLOW_STATUS_WAITING_3;
  }

  private boolean equalsDate(LocalDate left, LocalDate right) {
    return left != null && right != null && left.isEqual(right);
  }

  private boolean equalsLong(Long left, Long right) {
    return left != null && right != null && left.equals(right);
  }

  private boolean isBefore(LocalDate value, LocalDate expectedBefore) {
    return value != null && expectedBefore != null && value.isBefore(expectedBefore);
  }

  private boolean isBetweenInclusive(LocalDate value, LocalDate start, LocalDate end) {
    return value != null && start != null && end != null && !value.isBefore(start) && !value.isAfter(end);
  }

  private String trimToNull(String value) {
    return StringUtils.hasText(value) ? value.trim() : null;
  }

  private String resolveLegacyReference(SuivieDepenseDto dto) {
    return StringUtils.hasText(dto.getReferenceDepense()) ? dto.getReferenceDepense().trim() : resolveLegacyCode(dto);
  }

  private String resolveLegacyCode(SuivieDepenseDto dto) {
    return StringUtils.hasText(dto.getCodeTransaction()) ? dto.getCodeTransaction().trim() : UUID.randomUUID().toString();
  }

  private Long getLevelUserId(SuivieDepense depense, int level) {
    if (level == 1) {
      return depense.getValidationNiveau1UserId();
    }
    if (level == 2) {
      return depense.getValidationNiveau2UserId();
    }
    return depense.getValidationNiveau3UserId();
  }

  private String getLevelRole(SuivieDepense depense, int level) {
    if (level == 1) {
      return depense.getValidationNiveau1Role();
    }
    if (level == 2) {
      return depense.getValidationNiveau2Role();
    }
    return depense.getValidationNiveau3Role();
  }

  private String normalizeRoleName(String roleName) {
    if (!StringUtils.hasText(roleName)) {
      return "";
    }
    String normalized = roleName.trim().toUpperCase(Locale.ROOT);
    return normalized.startsWith("ROLE_") ? normalized.substring(5) : normalized;
  }

  private boolean isEmailValid(String email) {
    return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
  }

  private List<String> sanitizeReferenceValues(List<String> values, List<String> defaults) {
    List<String> source = values == null || values.isEmpty() ? defaults : values;
    return new ArrayList<>(
      source.stream().filter(StringUtils::hasText).map(String::trim).collect(Collectors.toCollection(LinkedHashSet::new))
    );
  }

  private String writeStringList(List<String> values) {
    try {
      return objectMapper.writeValueAsString(values);
    } catch (IOException exception) {
      throw new InvalidEntityException(
        "Impossible d'enregistrer la configuration des depenses.",
        exception,
        ErrorCodes.SUIVIEDEPENSE_NOT_VALID
      );
    }
  }

  private List<String> readStringList(String rawValue, List<String> defaults) {
    if (!StringUtils.hasText(rawValue)) {
      return new ArrayList<>(defaults);
    }
    try {
      return sanitizeReferenceValues(objectMapper.readValue(rawValue, STRING_LIST_TYPE), defaults);
    } catch (IOException exception) {
      log.warn("Impossible de lire une liste de configuration depense: {}", rawValue);
      return new ArrayList<>(defaults);
    }
  }

  private DepenseValidationActionDto buildActionFromRequest(DepenseManagementUpsertRequestDto dto) {
    return new DepenseValidationActionDto(dto.getIdCreateur(), dto.getDemandeurNom(), null, null);
  }
}
