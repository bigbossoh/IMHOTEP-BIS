package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.DepenseManagementUpsertRequestDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseSupplierDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseValidationActionDto;
import com.bzdata.gestimospringbackend.DTOs.DepenseWorkflowConfigDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseEncaisPeriodeDto;
import com.bzdata.gestimospringbackend.Services.SuivieDepenseService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(APP_ROOT + "/suiviedepense")
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class SuivieDepenseController {

  private final SuivieDepenseService suivieDepenseService;

  @PostMapping("/saveSuivieDepense")
  public ResponseEntity<List<SuivieDepenseDto>> saveSuivieDepense(
    @RequestBody SuivieDepenseDto dto
  ) {
    return ResponseEntity.ok(suivieDepenseService.saveNewDepense(dto));
  }

  @PostMapping(value = "/management/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<SuivieDepenseDto> saveDepenseManagement(
    @RequestPart("payload") DepenseManagementUpsertRequestDto dto,
    @RequestPart(value = "justificatif", required = false) MultipartFile justificatif
  ) {
    return ResponseEntity.ok(suivieDepenseService.saveOrSubmitDepense(dto, justificatif));
  }

  @GetMapping("/management/expenses/{idAgence}")
  public ResponseEntity<List<SuivieDepenseDto>> getAllDepensesGestion(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(suivieDepenseService.findAllDepensesGestion(idAgence));
  }

  @GetMapping("/management/config/{idAgence}")
  public ResponseEntity<DepenseWorkflowConfigDto> getWorkflowConfig(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(suivieDepenseService.getWorkflowConfig(idAgence));
  }

  @PutMapping("/management/config")
  public ResponseEntity<DepenseWorkflowConfigDto> saveWorkflowConfig(
    @RequestBody DepenseWorkflowConfigDto dto
  ) {
    return ResponseEntity.ok(suivieDepenseService.saveWorkflowConfig(dto));
  }

  @GetMapping("/management/suppliers/{idAgence}")
  public ResponseEntity<List<DepenseSupplierDto>> listSupplierSuggestions(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(suivieDepenseService.listSupplierSuggestions(idAgence));
  }

  @PostMapping("/management/{id}/approve")
  public ResponseEntity<SuivieDepenseDto> approveDepense(
    @PathVariable("id") Long id,
    @RequestBody DepenseValidationActionDto dto
  ) {
    return ResponseEntity.ok(suivieDepenseService.approveDepense(id, dto));
  }

  @PostMapping("/management/{id}/reject")
  public ResponseEntity<SuivieDepenseDto> rejectDepense(
    @PathVariable("id") Long id,
    @RequestBody DepenseValidationActionDto dto
  ) {
    return ResponseEntity.ok(suivieDepenseService.rejectDepense(id, dto));
  }

  @PostMapping("/management/{id}/cancel")
  public ResponseEntity<SuivieDepenseDto> cancelDepense(
    @PathVariable("id") Long id,
    @RequestBody DepenseValidationActionDto dto
  ) {
    return ResponseEntity.ok(suivieDepenseService.cancelDepense(id, dto));
  }

  @GetMapping("/management/attachment/{id}")
  public ResponseEntity<Resource> downloadJustificatif(@PathVariable("id") Long id) {
    SuivieDepenseDto depense = suivieDepenseService.findById(id);
    String fileName = depense.getJustificatifNom() == null ? "justificatif" : depense.getJustificatifNom();
    String contentType = depense.getJustificatifType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : depense.getJustificatifType();
    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
      .contentType(MediaType.parseMediaType(contentType))
      .body(suivieDepenseService.downloadJustificatif(id));
  }

  @GetMapping("/getSuivieDepenseById/{id}")
  public ResponseEntity<SuivieDepenseDto> getSuivieDepenseById(
    @PathVariable("id") Long id
  ) {
    return ResponseEntity.ok(suivieDepenseService.findById(id));
  }

  @GetMapping("/totalSortieDeuxDate/{idAgence}/{debut}/{fin}")
  public ResponseEntity<SuivieDepenseEncaisPeriodeDto> totalSortieDeuxDate(
    @PathVariable("idAgence") Long idAgence,
    @PathVariable("debut") String debut,
    @PathVariable("fin") String fin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      debut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      fin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      suivieDepenseService.totalSuiviDepenseEntreDeuxDate(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping("/listSortieDeuxDate/{idAgence}/{debut}/{fin}")
  public ResponseEntity<List<SuivieDepenseDto>> listSortieDeuxDate(
    @PathVariable("idAgence") Long idAgence,
    @PathVariable("debut") String debut,
    @PathVariable("fin") String fin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      debut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      fin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      suivieDepenseService.listSuiviDepenseEntreDeuxDate(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping("/getSuivieDepenseByCodeTransaction/{codeTransaction}")
  public ResponseEntity<SuivieDepenseDto> getSuivieDepenseByCodeTransaction(
    @PathVariable("codeTransaction") String codeTransaction
  ) {
    return ResponseEntity.ok(
      suivieDepenseService.findByCodeTransaction(codeTransaction)
    );
  }

  //SUPPRIMER UN SUIVI DEPENSE

  @PostMapping("/suprimerSuiviParId/{id}/{idAgence}")
  public ResponseEntity<List<SuivieDepenseDto>> suprimerSuiviParId(
    @PathVariable("id") Long id,
    @PathVariable("idAgence") Long idAgence
  ) {
    log.info("le id est le suivant : " + id);
    return ResponseEntity.ok(
      suivieDepenseService.supprimerUneEcritureById(id, idAgence)
    );
  }

  @GetMapping("/allSuivieDepense/{idAgence}")
  public ResponseEntity<List<SuivieDepenseDto>> getAllEncaissementSuivieDepenseParAgence(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(
      suivieDepenseService.findAlEncaissementParAgence(idAgence)
    );
  }
@GetMapping("/countSuiviNonCloturerParCaisseEtChapitreAvantDate/{datePriseEnCompteEncaii}/{idCaiss}/{idChapitre}")
  public ResponseEntity<Integer> countSuiviNonCloturerParCaisseEtChapitreAvantDate(
    @PathVariable("datePriseEnCompteEncaii") String datePriseEnCompteEncaii,
    @PathVariable("idCaiss") Long idCaiss,
   @PathVariable("idChapitre")  Long idChapitre
  ) {
    LocalDate datePriseEnCompte = LocalDate.parse(
      datePriseEnCompteEncaii,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      suivieDepenseService.countSuiviNonCloturerParCaisseEtChapitreAvantDate(
        datePriseEnCompte,
        idCaiss,
        idChapitre
      )
    );
  }
  @GetMapping("/listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate/{idcaisse}/{dateDepriseEnCompte}/{idChapitre}")
 public ResponseEntity< List<SuivieDepenseDto>> listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate(
  @PathVariable("idcaisse")   Long idcaisse,
  @PathVariable("dateDepriseEnCompte")   String dateDepriseEnCompte,
   @PathVariable("idChapitre")  Long idChapitre
  ){
     LocalDate datePriseEnCompte = LocalDate.parse(
      dateDepriseEnCompte,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
      return ResponseEntity.ok(
      suivieDepenseService.listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate(idcaisse,datePriseEnCompte,idChapitre)
    );
  }
   @GetMapping("/listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate/{idcaisse}/{dateDebut}/{dateFin}/{idChapitre}")
 public ResponseEntity< List<SuivieDepenseDto>> listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate(
  @PathVariable("idcaisse")   Long idcaisse,
  @PathVariable("dateDebut")   String dateDebut,
   @PathVariable("dateFin")   String dateFin,
   @PathVariable("idChapitre")  Long idChapitre
  ){
     LocalDate dateDebutCompte = LocalDate.parse(
      dateDebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
      LocalDate dateFinCompte = LocalDate.parse(
      dateFin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
     log.info("le date avant de inserer est le suivant :{},{} " ,dateDebutCompte,dateFinCompte);
      return ResponseEntity.ok(
      suivieDepenseService.listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate(idcaisse, dateDebutCompte, dateFinCompte, idChapitre)
    );
  }
  
}
