package com.bzdata.gestimospringbackend.Controllers;
import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PrestationAdditionnelReservationSaveOrrUpdate;
import com.bzdata.gestimospringbackend.Services.PrestationAdditionnelReseravtionService;

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
@RequestMapping(APP_ROOT + "/serviceadditionnel")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class PrestationAdditionnelReservationController {
    final PrestationAdditionnelReseravtionService prestationAdditionnelReseravtionService;
    @PostMapping("/saveorupdate")
    @Operation(summary = "Creation et mise à jour d'une Service Additionnel", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PrestationAdditionnelReservationSaveOrrUpdate> saveorupdatePrestationAdditionnel(
            @RequestBody PrestationAdditionnelReservationSaveOrrUpdate dto) {
        log.info("We are going to save a new ServiceAdditionnel {}", dto);
        return ResponseEntity.ok(prestationAdditionnelReseravtionService.saveOrUpdate(dto));
    }

      // SUPPRESSION D'UNE COMMUNE
      @Operation(summary = "Suppression d'un Service Additionnel avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
      @DeleteMapping("/delete/{id}")
      public ResponseEntity<Void> deleteServiceAdditionnelPrestationAdditionnel(@PathVariable("id") Long id) {
          log.info("We are going to delete a Service Additionnel {}", id);
          prestationAdditionnelReseravtionService.delete(id);
          return ResponseEntity.ok().build();
      }
      @Operation(summary = "Trouver une CateroryChambre par son ID", security = @SecurityRequirement(name = "bearerAuth"))
      @GetMapping("/findById/{id}")
      public ResponseEntity<PrestationAdditionnelReservationSaveOrrUpdate> findServiceAdditionnelByIDPrestationAdditionnel(@PathVariable("id") Long id) {
          log.info("Find Commune by ID{}", id);
          return ResponseEntity.ok(prestationAdditionnelReseravtionService.findById(id));
      }
      // TOUTES LES COMMUES
    @Operation(summary = "Liste de toutes les Service Additionnel", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all")
    public ResponseEntity<List<PrestationAdditionnelReservationSaveOrrUpdate>> findAllServiceAdditionnelPrestationAdditionnel() {
        return ResponseEntity.ok(prestationAdditionnelReseravtionService.findAll());
    }
}
