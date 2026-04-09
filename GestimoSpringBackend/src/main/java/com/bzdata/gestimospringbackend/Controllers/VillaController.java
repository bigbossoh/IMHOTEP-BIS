package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.VillaDto;
import com.bzdata.gestimospringbackend.Services.VillaService;

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
@RequestMapping(APP_ROOT + "/villa")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins="*")
public class VillaController {
    final VillaService villaService;

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Suppression d'une Villa avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Boolean> deleteVilla(@PathVariable("id") Long id) {
        log.info("We are going to delete a Villa {}", id);
        return ResponseEntity.ok(villaService.delete(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'une Villa", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VillaDto> saveVilla(@RequestBody VillaDto dto) {
        log.info("We are going to save a new Villa {}", dto);
        return ResponseEntity.ok(villaService.saveUneVilla(dto));
    }

    // TOUT LES VILLA
    @Operation(summary = "Liste de tous les villas", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<VillaDto>> findAllVilla(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(villaService.findAll(idAgence));
    }

    // TOUT LES VILLAS LIBRES
    @Operation(summary = "Liste de tous les villas libres ", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/alllibre/{idAgence}")

    public ResponseEntity<List<VillaDto>> findAllVillaLibre(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(villaService.findAllLibre(idAgence));
    }

    @GetMapping("/findVillaById/{id}")
    @Operation(summary = "Creation et mise à jour d'une Villa", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VillaDto> findVillaById(@PathVariable("id") Long id) {
        log.info("We are going to save a new Villa {}", id);
        return ResponseEntity.ok(villaService.findById(id));
    }
}
