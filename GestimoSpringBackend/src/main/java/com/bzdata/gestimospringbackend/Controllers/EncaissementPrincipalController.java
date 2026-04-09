package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyerEncaissDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementPayloadDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementPrincipalDTO;
import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.Services.EncaissementPrincipalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/encaissement")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class EncaissementPrincipalController {

  final EncaissementPrincipalService encaissementPrincipalService;

  @PostMapping("/saveencaissement")
  @Operation(
    summary = "Creation et encaissement",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<Boolean> saveEncaissement(
    @RequestBody EncaissementPayloadDto dto
  ) {
    // log.info("We are going to save a new encaissement {}", dto);
    return ResponseEntity.ok(
      encaissementPrincipalService.saveEncaissement(dto)
    );
  }

  @PostMapping("/saveencaissementavecretour")
  @Operation(
    summary = "Creation et encaissement",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<List<EncaissementPrincipalDTO>> saveEncaissementAvecretourDeListe(
    @RequestBody EncaissementPayloadDto dto
  ) {
    // log.info("We are going to save a new encaissement groupé : : : {}", dto);
    return ResponseEntity.ok(
      encaissementPrincipalService.saveEncaissementAvecRetourDeList(dto)
    );
  }

  @PostMapping("/saveencaissementmasseavecretour")
  @Operation(
    summary = "Creation et encaissement en masse",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<List<LocataireEncaisDTO>> saveEncaissementMasseAvecretourDeListe(
    @RequestBody EncaissementPayloadDto dto
  ) {
    return ResponseEntity.ok(
      encaissementPrincipalService.saveEncaissementGrouperAvecRetourDeList(dto)
    );
  }

  @PostMapping("/saveencaissementmasse")
  @Operation(
    summary = "Creation d'un encaissement e masse",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<Boolean> saveEncaissementMasse(
    @RequestBody List<EncaissementPayloadDto> dtos
  ) {
    // log.info("We are going to save a new encaissement {}", dto);
    return ResponseEntity.ok(
      encaissementPrincipalService.saveEncaissementMasse(dtos)
    );
  }

  @Operation(
    summary = "Listés tous les envaissements de lae BD",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/findAllEncaissementPrincipal/{idAgence}")
  public ResponseEntity<List<EncaissementPrincipalDTO>> listTousEncaissementsPrincipal(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(
      encaissementPrincipalService.findAllEncaissement(idAgence)
    );
  }

  @Operation(
    summary = "Total des encaissements par Id d'appel de loyer",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/totalencaissement/{id}")
  public ResponseEntity<Double> totalencaissementParIdAppelLoyer(
    @PathVariable("id") Long id
  ) {
    return ResponseEntity.ok(
      encaissementPrincipalService.getTotalEncaissementByIdAppelLoyer(id)
    );
  }

  // GET Encaissement BY ID
  @Operation(
    summary = "Trouver un encaissement par son ID",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/findByIdEncaissement/{id}")
  public ResponseEntity<EncaissementPrincipalDTO> findByIdEncaissement(
    @PathVariable("id") Long id
  ) {
    return ResponseEntity.ok(
      encaissementPrincipalService.findEncaissementById(id)
    );
  }

  // GET ALL ENCAISSEMENTS BY IDLOCATAIRE
  @Operation(
    summary = "Trouver tous les encaissements par son ID",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/allEncaissementByIdLocatire/{idLocatire}")
  public ResponseEntity<List<EncaissementPrincipalDTO>> findAllEncaissementByIdLocatire(
    @PathVariable("idLocatire") Long idLocatire
  ) {
    // log.info("Find by ID {}", idLocatire);
    return ResponseEntity.ok(
      encaissementPrincipalService.findAllEncaissementByIdLocataire(idLocatire)
    );
  }

  // GET ALL ENCAISSEMENTS BY ID BIEN IMMOBILIER
  @Operation(
    summary = "Total des encaissements par IdBienImmobilioer d'appel de loyer",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/allencaissementByIdBien/{id}")
  public ResponseEntity<List<EncaissementPrincipalDTO>> findAllEncaissementByIdBienImmobilier(
    @PathVariable("id") Long id
  ) {
    // log.info(" find All Encaissement By IdBienImmobilier {}", id);
    return ResponseEntity.ok(
      encaissementPrincipalService.findAllEncaissementByIdBienImmobilier(id)
    );
  }

  @Operation(
    summary = "Total des encaissements par Id d'appel de loyer",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/totalencaissementjournalier/{jour}/{idAgence}/{chapitre}")
  public ResponseEntity<Double> totalEncaissementParJour(
    @PathVariable("jour") String jour,
    @PathVariable("idAgence") Long idAgence,
    @PathVariable("chapitre") Long chapitre
  ) {
    // log.info("Find totalencaissement by ID AppelLoyer {}", jour);
    return ResponseEntity.ok(
      encaissementPrincipalService.sommeEncaisserParJour(
        jour,
        idAgence,
        chapitre
      )
    );
  }

  @Operation(
    summary = "Total des encaissements par agence et par periode",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping(
    "/sommeEncaissementParAgenceEtParPeriode/{idAgence}/{datedebut}/{datefin}"
  )
  public ResponseEntity<Double> sommeEncaissementParAgenceEtParPeriode(
    @PathVariable Long idAgence,
    @PathVariable("datedebut") String datedebut,
    @PathVariable("datefin") String datefin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      datedebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      datefin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.sommeEncaissementParAgenceEtParPeriode(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @Operation(
    summary = "Total des encaissements par agence et par periode",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping(
    "/sommeLoyerParAgenceEtParPeriode/{idAgence}/{datedebut}/{datefin}"
  )
  public ResponseEntity<Double> sommeLoyerParAgenceEtParPeriode(
    @PathVariable Long idAgence,
    @PathVariable("datedebut") String datedebut,
    @PathVariable("datefin") String datefin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      datedebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      datefin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.sommeLoyerEntreDeuxPeriode(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping("/getTotalEncaissementsParMois/{idAgence}/{datedebut}/{datefin}")
  public ResponseEntity<Map<YearMonth, Double>> getTotalEncaissementsParMois(
    @PathVariable Long idAgence,
    @PathVariable("datedebut") String datedebut,
    @PathVariable("datefin") String datefin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      datedebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      datefin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.getTotalEncaissementsParMois(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping(
    "/getTotalEncaissementparPeriode/{idAgence}/{datedebut}/{datefin}"
  )
  public ResponseEntity<List<EncaissementPrincipalDTO>> getTotalEncaissementparPeriode(
    @PathVariable("idAgence") Long idAgence,
    @PathVariable("datedebut") String datedebut,
    @PathVariable("datefin") String datefin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      datedebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      datefin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.listeEncaissementParPeriode(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping(
    "/getTotalEncaissementsEtMontantsDeLoyerParMois/{idAgence}/{datedebut}/{datefin}"
  )
  public ResponseEntity<Map<YearMonth, Double[]>> getTotalEncaissementsEtMontantsDeLoyerParMois(
    @PathVariable Long idAgence,
    @PathVariable("datedebut") String datedebut,
    @PathVariable("datefin") String datefin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      datedebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      datefin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.getTotalEncaissementsEtMontantsDeLoyerParMois(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping(
    "/listeEncaisseLoyerEntreDeuxDate/{idAgence}/{datedebut}/{datefin}"
  )
  public ResponseEntity<List<AppelLoyerEncaissDto>> listeEncaisseLoyerEntreDeuxDate(
    @PathVariable Long idAgence,
    @PathVariable("datedebut") String datedebut,
    @PathVariable("datefin") String datefin
  ) {
    LocalDate dateDebutLocalDate = LocalDate.parse(
      datedebut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFinLocalDate = LocalDate.parse(
      datefin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.listeEncaisseLoyerEntreDeuxDate(
        idAgence,
        dateDebutLocalDate,
        dateFinLocalDate
      )
    );
  }

  @GetMapping("/listeLocataireImpayerParAgenceEtPeriode/{agence}/{periode}")
  public ResponseEntity<List<LocataireEncaisDTO>> listeLocataireImpayerParAgenceEtPeriode(
    @PathVariable("agence") Long agence,
    @PathVariable("periode") String periode
  ) {
    return ResponseEntity.ok(
      encaissementPrincipalService.listeLocataireImpayerParAgenceEtPeriode(
        agence,
        periode
      )
    );
  }

  @GetMapping("/miseAJourEncaissementCloturer/{idEncaiss}")
  public ResponseEntity<Boolean> miseAJourEncaissementCloturer(
    @PathVariable("idEncaiss") Long idEncaiss
  ) {
    return ResponseEntity.ok(
      encaissementPrincipalService.miseAJourEncaissementCloturer(idEncaiss)
    );
  }

  @GetMapping(
    "/listeEncaissementEntreDeuxDateParChapitreEtCaisse/{idEncaiss}/{idChapitre}/{debut}/{fin}"
  )
  public ResponseEntity<List<EncaissementPrincipalDTO>> listeEncaissementEntreDeuxDateParChapitreEtCaisse(
    @PathVariable("idEncaiss") Long idEncaiss,
    @PathVariable("idChapitre") Long idChapitre,
    @PathVariable("debut") String debut,
    @PathVariable("fin") String fin
  ) {
    LocalDate datDebut = LocalDate.parse(
      debut,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    LocalDate dateFin = LocalDate.parse(
      fin,
      DateTimeFormatter.ofPattern("dd-MM-yyyy")
    );
    return ResponseEntity.ok(
      encaissementPrincipalService.listeEncaissementEntreDeuxDateParChapitreEtCaisse(
        idEncaiss,
        idChapitre,
        datDebut,
        dateFin
      )
    );
  }
}
