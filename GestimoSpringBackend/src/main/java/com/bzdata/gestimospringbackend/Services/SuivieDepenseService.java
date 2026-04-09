package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.DepenseManagementUpsertRequestDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseSupplierDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseValidationActionDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseWorkflowConfigDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseEncaisPeriodeDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseEncaissementDto;
import java.time.LocalDate;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface SuivieDepenseService {
  List<SuivieDepenseDto> saveNewDepense(SuivieDepenseDto dto);
  SuivieDepenseDto saveOrSubmitDepense(DepenseManagementUpsertRequestDto dto, MultipartFile justificatif);
  List<SuivieDepenseDto> findAllDepensesGestion(Long idAgence);
  SuivieDepenseDto approveDepense(Long id, DepenseValidationActionDto actionDto);
  SuivieDepenseDto rejectDepense(Long id, DepenseValidationActionDto actionDto);
  SuivieDepenseDto cancelDepense(Long id, DepenseValidationActionDto actionDto);
  DepenseWorkflowConfigDto getWorkflowConfig(Long idAgence);
  DepenseWorkflowConfigDto saveWorkflowConfig(DepenseWorkflowConfigDto dto);
  List<DepenseSupplierDto> listSupplierSuggestions(Long idAgence);
  Resource downloadJustificatif(Long id);
  boolean annulerTransactionByCodeTransaction(String codeTransation);
  boolean annulerTransactionById(String Id);
  List<SuivieDepenseDto> supprimerUneEcritureById(Long Id, Long idAgence);
  SuivieDepenseDto findById(Long id);
  SuivieDepenseDto findByCodeTransaction(String codeTransation);
  List<SuivieDepenseDto> findByDateEncaissement(
    SuivieDepenseEncaissementDto suivieDepenseEncaissementDto
  );
  List<SuivieDepenseDto> findByAllEncaissementByPeriode(
    SuivieDepenseEncaisPeriodeDto suivieDepenseEncaisPeriodeDto
  );
  int countSuiviNonCloturerAvantDate(LocalDate dateEncaii,Long idCreateur);
  List<SuivieDepenseDto> findAlEncaissementParAgence(Long idAgence);
  SuivieDepenseEncaisPeriodeDto totalSuiviDepenseEntreDeuxDate(
    Long idAgence,
    LocalDate debut,
    LocalDate fin
  );
  List<SuivieDepenseDto> listSuiviDepenseEntreDeuxDate(
    Long idAgence,
    LocalDate debut,
    LocalDate fin
  );
   List<SuivieDepenseDto> listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate(
    Long idcaisse,
    LocalDate dateDepriseEnCompte,
    Long idChapitre
  );
   int countSuiviNonCloturerParCaisseEtChapitreAvantDate(LocalDate datePriseEnCompteEncaii,Long idCaiss,Long idChapitre);
  List<SuivieDepenseDto> listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate(
    Long idcaisse,
    LocalDate dateDebut,
    LocalDate dateFin,
    Long idChapitre
  );
}
