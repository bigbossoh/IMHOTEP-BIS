package com.bzdata.gestimospringbackend.Controllers;

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
import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PaysDto;
import com.bzdata.gestimospringbackend.DTOs.VilleDto;
import com.bzdata.gestimospringbackend.Services.VilleService;

@RestController
@RequestMapping(APP_ROOT + "/ville")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins="*")
public class VilleController {
    final VilleService villeService;

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'une Ville", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VilleDto> saveVille(@RequestBody VilleDto dto) {
        log.info("We are going to save a new Ville {}", dto);
        return ResponseEntity.ok(villeService.save(dto));
    }

    // SUPPRESSION D'UNE VILLE
    @Operation(summary = "Suppression d'une Ville avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteVille(@PathVariable("id") Long id) {
        log.info("We are going to save a new Ville {}", id);
        return ResponseEntity.ok(villeService.delete(id));
    }

    // TOUTES LES VILLES
    @Operation(summary = "Liste de toutes les villes", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all")
    public ResponseEntity<List<VilleDto>> findAllVilles() {
        return ResponseEntity.ok(villeService.findAll());
    }

    // GET VILLE BY ID
    @Operation(summary = "Trouver une ville par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<VilleDto> findByIdVille(@PathVariable("id") Long id) {
        log.info("Find by ID{}", id);
        return ResponseEntity.ok(villeService.findById(id));
    }

    // GET VILLE BY NAME
    @Operation(summary = "Trouver une ville par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<VilleDto> findVilleByNameVille(@PathVariable("name") String name) {
        log.info("Find Ville By nom {}", name);
        return ResponseEntity.ok(villeService.findByName(name));
    }

    // GET VILLE BY PAYS
    @Operation(summary = "Trouver une ville par son Pays", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByPays")
    public ResponseEntity<List<VilleDto>> findAllVilleByPaysObject(@RequestBody PaysDto paysDto) {
        log.info("Find Ville By nom {}", paysDto);
        return ResponseEntity.ok(villeService.findAllByPays(paysDto));
    }

    // GET VILLE BY PAYS
    @Operation(summary = "Trouver une ville par l'Id du pays", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByIdPays/{id}")
    public ResponseEntity<List<VilleDto>> findAllVilleByIdPays(@PathVariable("id") Long id) {
        log.info("Find Ville By Id Pays {}", id);
        return ResponseEntity.ok(villeService.findAllByIdPays(id));
    }
}
