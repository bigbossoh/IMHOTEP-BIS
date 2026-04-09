package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.MagasinDto;
import com.bzdata.gestimospringbackend.DTOs.MagasinResponseDto;
import com.bzdata.gestimospringbackend.Services.MagasinService;

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
@RequestMapping(APP_ROOT + "/magasin")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class MagasinController {
    final MagasinService magasinService;

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Suppression d'un Magasin avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Boolean> deleteMagasin(@PathVariable("id") Long id) {
        log.info("We are going to delete a Magasin {}", id);
        return ResponseEntity.ok(magasinService.delete(id));
    }

    @PostMapping("/savemagasin")
    @Operation(summary = "Creation et mise à jour d'une Magasin", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MagasinDto> saveMagasinReturnDto(@RequestBody MagasinDto dto) {
        log.info("We are going to save a new Magasin {}", dto);
        return ResponseEntity.ok(magasinService.saveUnMagasin(dto));
    }

    // TOUT LES Magasins
    @Operation(summary = "Liste de tous les Magasins", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<MagasinResponseDto>> findAllMagasin(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(magasinService.findAll( idAgence));
    }
 // TOUT LES Magasins
 @Operation(summary = "Liste de tous les Magasins libres", security = @SecurityRequirement(name = "bearerAuth"))
 @GetMapping("/alllibre/{idAgence}")
 public ResponseEntity<List<MagasinResponseDto>> findAllMagasinLibre(@PathVariable("idAgence") Long idAgence) {
     return ResponseEntity.ok(magasinService.findAllLibre(idAgence));
 }
    @Operation(summary = "Trouver un Magasin par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findmagasinById/{id}")
    public ResponseEntity<MagasinDto> findByIDMagasin(@PathVariable("id") Long id) {
        log.info("Find Commune by ID{}", id);
        return ResponseEntity.ok(magasinService.findById(id));
    }

    @Operation(summary = "Trouver un Quartier par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<MagasinDto> findByNameMagasinDto(@PathVariable("name") String name) {
        log.info("Find Quartier By nom {}", name);
        return ResponseEntity.ok(magasinService.findByName(name));
    }

    @Operation(summary = "Liste de tous les Magasins by Idsite", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findAllMagasinByIdSite/{idSite}")
    public ResponseEntity<List<MagasinDto>> findAllMagasinByIdSite(@PathVariable("idSite") Long idSite) {
        return ResponseEntity.ok(magasinService.findAllByIdSite(idSite));
    }

    @Operation(summary = "Liste de tous les Magasins by Idsite", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findAllMagasinByIdEtage/{id}")
    public ResponseEntity<List<MagasinDto>> findAllMagasinByEtage(@PathVariable("id") Long idSite) {
        return ResponseEntity.ok(magasinService.findAllByIdEtage(idSite));
    }
}
