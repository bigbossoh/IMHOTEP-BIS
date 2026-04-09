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

import com.bzdata.gestimospringbackend.DTOs.BailMagasinDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.Services.BailMagasinService;

@RestController
@RequestMapping(APP_ROOT + "/bailmagasin")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class BailMagasinController {
    final BailMagasinService bailMagasinService;

    @Operation(summary = "Suppression d'un Bail Magasin avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteBailMagasin(@PathVariable("id") Long id) {
        log.info("We are going to delete a Bail Magasin {}", id);
        return ResponseEntity.ok(bailMagasinService.delete(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Bail Magasin", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<OperationDto> saveBailMagasin(@RequestBody BailMagasinDto dto) {
        log.info("We are going to save a new Bail Magasin {}", dto);
        return ResponseEntity.ok(bailMagasinService.save(dto));
    }

    @Operation(summary = "Liste de toutes les Baux Magasin", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<BailMagasinDto>> findAllBailMagasin(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(bailMagasinService.findAll(idAgence));
    }

    @Operation(summary = "Trouver un Bail Magain par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<BailMagasinDto> findByIDBailMagasin(@PathVariable("id") Long id) {
        log.info("Find Bail Magains by ID{}", id);
        return ResponseEntity.ok(bailMagasinService.findById(id));
    }

    @Operation(summary = "Trouver un Studio par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<BailMagasinDto> findByNameBailMagasin(@PathVariable("name") String name) {
        log.info("Find Bail Magain By nom {}", name);
        return ResponseEntity.ok(bailMagasinService.findByName(name));
    }
}
