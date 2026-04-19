package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PrestationSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Services.PrestaionService;

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
@RequestMapping(APP_ROOT + "/prestation")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class PrestationController {
    final PrestaionService serviceAdditionnelService;
    @PostMapping("/saveorupdate")
    @Operation(summary = "Creation et mise à jour d'une Service Additionnel", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PrestationSaveOrUpdateDto> saveorupdatePrestation(
            @RequestBody PrestationSaveOrUpdateDto dto) {
        log.info("We are going to save a new ServiceAdditionnel {}", dto);
        return ResponseEntity.ok(serviceAdditionnelService.saveOrUpdate(dto));
    }

      // SUPPRESSION D'UNE COMMUNE
      @Operation(summary = "Suppression d'un Service Additionnel avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
      @DeleteMapping("/delete/{id}")
      public ResponseEntity<Void> deleteServiceAdditionnelPrestation(@PathVariable("id") Long id) {
          log.info("We are going to delete a Service Additionnel {}", id);
          serviceAdditionnelService.delete(id);
          return ResponseEntity.ok().build();
      }
      @Operation(summary = "Trouver une CateroryChambre par son ID", security = @SecurityRequirement(name = "bearerAuth"))
      @GetMapping("/findById/{id}")
      public ResponseEntity<PrestationSaveOrUpdateDto> findServiceAdditionnelByIDPrestation(@PathVariable("id") Long id) {
          log.info("Find Commune by ID{}", id);
          return ResponseEntity.ok(serviceAdditionnelService.findById(id));
      }
    // TOUTES LES COMMUES
    @Operation(summary = "Liste de toutes les Service Additionnel", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all")
    public ResponseEntity<List<PrestationSaveOrUpdateDto>> findAllServiceAdditionnelPrestation() {
        return ResponseEntity.ok(serviceAdditionnelService.findAll());
    }

    @Operation(summary = "Liste des prestations par agence", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<PrestationSaveOrUpdateDto>> findAllServiceAdditionnelPrestationByAgence(
            @PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(serviceAdditionnelService.findAllByAgence(idAgence));
    }

}
