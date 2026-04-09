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

import com.bzdata.gestimospringbackend.DTOs.BailVillaDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.Services.BailVillaService;

@RestController
@RequestMapping(APP_ROOT + "/bailvilla")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class BailVillaController {

    final BailVillaService bailVillaService;

    @Operation(summary = "Suppression d'un Bail Villa avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteBailVilla(@PathVariable("id") Long id) {
        log.info("We are going to delete a Bail Villa {}", id);
        return ResponseEntity.ok(bailVillaService.delete(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Bail Villa", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<OperationDto> saveBailVilla(@RequestBody BailVillaDto dto) {
        log.info("We are going to save a new Bail VILLA CONTROLLER {}", dto);
        return ResponseEntity.ok(bailVillaService.saveNewBailVilla(dto));
    }

    @Operation(summary = "Liste de toutes les Baux Villa", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<BailVillaDto>> findAllBailVilla(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(bailVillaService.findAll(idAgence));
    }

    @Operation(summary = "Trouver un Bail Villa par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<BailVillaDto> findBailVillaByID(@PathVariable("id") Long id) {
        log.info("Find Bail Magains by ID{}", id);
        return ResponseEntity.ok(bailVillaService.findById(id));
    }

    @Operation(summary = "Trouver un Villa par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<BailVillaDto> findBailVillaByName(@PathVariable("name") String name) {
        log.info("Find Bail Magain By nom {}", name);
        return ResponseEntity.ok(bailVillaService.findByName(name));
    }
}
