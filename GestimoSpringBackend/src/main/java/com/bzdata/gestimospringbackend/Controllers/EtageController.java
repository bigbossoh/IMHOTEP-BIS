package com.bzdata.gestimospringbackend.Controllers;

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

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.EtageAfficheDto;
import com.bzdata.gestimospringbackend.DTOs.EtageDto;
import com.bzdata.gestimospringbackend.Services.EtageService;

@RestController
@RequestMapping(APP_ROOT + "/etage")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class EtageController {
    final EtageService etageService;

    @Operation(summary = "Suppression d'un Etage avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteEtage(@PathVariable("id") Long id) {
        log.info("We are going to delete a Immeuble {}", id);
        return ResponseEntity.ok(etageService.delete(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Etage", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<EtageDto> saveEtage(@RequestBody EtageDto dto) {
        log.info("We are going to save a new Etage {}", dto);
        return ResponseEntity.ok(etageService.save(dto));
    }

    @Operation(summary = "Liste de toutes les Etages", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<EtageDto>> findAllEtage(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(etageService.findAll(idAgence));
    }

    @Operation(summary = "Trouver un Etage par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<EtageDto> findEtageByID(@PathVariable("id") Long id) {
        log.info("Find Immeuble by ID{}", id);
        return ResponseEntity.ok(etageService.findById(id));
    }

    @Operation(summary = "Trouver un Etage par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<EtageDto> findEtageByName(@PathVariable("name") String name) {
        log.info("Find Immeuble By nom {}", name);
        return ResponseEntity.ok(etageService.findByName(name));
    }

    @Operation(summary = "Trouver une Etage par l'Id de la Immeuble", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByIdImmeuble/{id}")
    public ResponseEntity<List<EtageAfficheDto>> affichageDesEtageParImmeuble(@PathVariable("id") Long id) {
        log.info("Find Etage By Id Immeuble {}", id);
        return ResponseEntity.ok(etageService.affichageDesEtageParImmeuble(id));
    }
}
