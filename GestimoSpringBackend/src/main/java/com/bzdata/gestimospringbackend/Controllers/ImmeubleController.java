package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.ImmeubleDto;
import com.bzdata.gestimospringbackend.DTOs.ImmeubleEtageDto;
import com.bzdata.gestimospringbackend.Services.ImmeubleService;

import org.springframework.http.ResponseEntity;
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
@RequestMapping(APP_ROOT + "/immeuble")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class ImmeubleController {
    final ImmeubleService immeubleService;

    @Operation(summary = "Suppression d'un Immeuble avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/deleteImmeuble/{id}")
    public ResponseEntity<Boolean> deleteImmeuble(@PathVariable("id") Long id) {
        log.info("We are going to delete a Immeuble {}", id);
        return ResponseEntity.ok(immeubleService.delete(id));
    }

    @PostMapping("/saveImeubleEtage")
    @Operation(summary = "Creation  d'une Immeuble et les etage qui vont avec etage", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ImmeubleEtageDto> saveImmeubleEtage(@RequestBody ImmeubleEtageDto dto) {
        log.info("We are going to save a new Immeuble {}", dto);
        return ResponseEntity.ok(immeubleService.saveImmeubleEtageDto(dto));
    }

    @Operation(summary = "Liste de toutes les Immeubles", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<ImmeubleDto>> findAllImmeuble(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(immeubleService.findAll(idAgence));
    }

    @Operation(summary = "Liste de tous les Immeubles avec leur proprietaire ", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/affichetoutlesimmeubles/{idAgence}")
    public ResponseEntity<List<ImmeubleEtageDto>> affichageDesImmeubles(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(immeubleService.findAllPourAffichageImmeuble(idAgence));
    }
    @Operation(summary = "Trouver une Immeuble par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<ImmeubleDto> findImmeubleByID(@PathVariable("id") Long id) {
        log.info("Find Immeuble by ID{}", id);
        return ResponseEntity.ok(immeubleService.findById(id));
    }

    @Operation(summary = "Trouver une Immeuble par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<ImmeubleDto> findImmeubleByName(@PathVariable("name") String name) {
        log.info("Find Immeuble By nom {}", name);
        return ResponseEntity.ok(immeubleService.findByName(name));
    }

    @Operation(summary = "Trouver une Immeuble par l'Id de la Site", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByIdSite/{id}")
    public ResponseEntity<List<ImmeubleDto>> findImmeubleByIdSite(@PathVariable("id") Long id) {
        log.info("Find Ville By Id Pays {}", id);
        return ResponseEntity.ok(immeubleService.findAllByIdSite(id));
    }
}