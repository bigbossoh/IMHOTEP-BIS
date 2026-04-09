package com.bzdata.gestimospringbackend.Controllers;

import com.bzdata.gestimospringbackend.Services.AppartementService;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.AppartementDto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/appartement")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
//@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class AppartementController {
    final AppartementService appartementService;

    @Operation(summary = "Suppression d'un Appartement avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteAppartement(@PathVariable("id") Long id) {
        log.info("We are going to delete a Appartement {}", id);
        return ResponseEntity.ok(appartementService.delete(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Appartement", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AppartementDto> saveAppartement(@RequestBody AppartementDto dto) {
        log.info("We are going to save a new Appartement {}", dto);
        return ResponseEntity.ok(appartementService.save(dto));
    }
    
     @PostMapping("/saveForCategorie")
    @Operation(summary = "Creation et mise à jour d'un Appartement Categorie", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AppartementDto> saveForCategorie(@RequestBody AppartementDto dto) {
        log.info("We are going to save a new Appartement {}", dto);
        return ResponseEntity.ok(appartementService.saveForCategorie(dto));
    }
    @Operation(summary = "Liste de toutes les Appartement"
    // , security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/all/{id}")
    public ResponseEntity<List<AppartementDto>> findAllAppartement(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appartementService.findAll(id));
    }

    @Operation(summary = "Liste de toutes les Appartements meublés"
    // , security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/allmeuble/{id}")
    public ResponseEntity<List<AppartementDto>> findAllAppartementMeuble(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appartementService.findAllMeuble(id));
    }

    @Operation(summary = "Liste de toutes les Appartements Libres"
    // , security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/alllmeublelibre/{idAgence}")
    public ResponseEntity<List<AppartementDto>> findAllAppartementLibre(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(appartementService.findAllLibre(idAgence));
    }
    @Operation(summary = "Trouver un Appartement par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<AppartementDto> findByIDAppartement(@PathVariable("id") Long id) {
        log.info("Find Appartement by ID{}", id);
        return ResponseEntity.ok(appartementService.findById(id));
    }

    @Operation(summary = "Trouver un Apparte,ent par son nom"
    // , security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/findByName/{name}")
    public ResponseEntity<AppartementDto> findByNameAppartement(@PathVariable("name") String name) {
        log.info("Find Appartement By nom {}", name);
        return ResponseEntity.ok(appartementService.findByName(name));
    }

    @Operation(summary = "Trouver une Appartement par l'Id de l'étage"
    // , security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/findByIdEtage/{id}")
    public ResponseEntity<List<AppartementDto>> findByIdEtageAppartement(@PathVariable("id") Long id) {
        log.info("Find Appartement By Id Pays {}", id);
        return ResponseEntity.ok(appartementService.findAllByIdEtage(id));
    }

     @Operation(summary = "Trouver un Appartement par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findallappartementbyidcategorie/{id}")
    public ResponseEntity<List<AppartementDto>> findAllAppartementByIdCategorie(@PathVariable("id") Long id) {
        log.info("Find Appartement by ID{}", id);
        return ResponseEntity.ok(appartementService.findAllAppartementByIdCategorie(id));
    }
}
