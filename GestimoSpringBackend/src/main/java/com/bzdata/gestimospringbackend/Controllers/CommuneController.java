package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.CommuneRequestDto;
import com.bzdata.gestimospringbackend.DTOs.CommuneResponseDto;
import com.bzdata.gestimospringbackend.Services.CommuneService;

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
@RequestMapping(APP_ROOT + "/commune")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class CommuneController {
    final CommuneService communeService;


    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'une Commune", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CommuneRequestDto> saveCommune(@RequestBody CommuneRequestDto dto) {
        log.info("We are going to save a new Commune {}", dto);
        return ResponseEntity.ok(communeService.save(dto));
    }
    // SUPPRESSION D'UNE COMMUNE
    @Operation(summary = "Suppression d'une Commune avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteCommune(@PathVariable("id") Long id) {
        log.info("We are going to delete a Ville {}", id);
        return ResponseEntity.ok(communeService.delete(id));
    }



    // TOUTES LES COMMUES
    @Operation(summary = "Liste de toutes les Communes", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all")
    public ResponseEntity<List<CommuneRequestDto>> findAllCommune() {
        return ResponseEntity.ok(communeService.findAll());
    }

    @Operation(summary = "Trouver une commune par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<CommuneRequestDto> findCommuneByID(@PathVariable("id") Long id) {
        log.info("Find Commune by ID{}", id);
        return ResponseEntity.ok(communeService.findById(id));
    }

    @Operation(summary = "Trouver une commune par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<CommuneRequestDto> findCommuneByName(@PathVariable("name") String name) {
        log.info("Find commune By nom {}", name);
        return ResponseEntity.ok(communeService.findByName(name));
    }

    /*
     * @Operation(summary = "Trouver une commune par sa Ville", security
     * = @SecurityRequirement(name = "bearerAuth"))
     *
     * @GetMapping("/findByVille")
     * public ResponseEntity<List<CommuneDto>> findByPays(@RequestBody VilleDto
     * villeDto) {
     * log.info("Find Ville By nom {}", villeDto);
     * return ResponseEntity.ok(communeService.findAllByVille(villeDto));
     * }
     */

    @Operation(summary = "Trouver une commune par l'Id de la Ville", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByIdVille/{id}")
    public ResponseEntity<List<CommuneResponseDto>> findCommuneByIdPays(@PathVariable("id") Long id) {
        log.info("Find all the commune By Id Ville {}", id);
        return ResponseEntity.ok(communeService.findAllByIdVille(id));
    }
}
