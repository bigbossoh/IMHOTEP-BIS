package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailAppartementDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.Services.BailAppartementService;
import com.bzdata.gestimospringbackend.Services.OperationService;

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
@RequestMapping(APP_ROOT + "/bailappartement")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class BailAppartementController {
    final BailAppartementService bailAppartementService;
    final OperationService operationService;

    @Operation(summary = "Suppression d'un Bail Appartement avec l'ID en paramètre", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteBailAppartement(@PathVariable("id") Long id) {
        log.info("We are going to delete a Bail Appartement {}", id);
        return ResponseEntity.ok(bailAppartementService.delete(id));
    }

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un Bail Appartement", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<OperationDto> saveBailAppartement(@RequestBody BailAppartementDto dto) {
        log.info("We are going to save a new Bail Appartement {}", dto);
        return ResponseEntity.ok(bailAppartementService.save(dto));
    }

    @Operation(summary = "Liste de toutes les Baux Appartement", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<BailAppartementDto>> findAllBailAppartement(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(bailAppartementService.findAll(idAgence));
    }

    @Operation(summary = "Liste de toutes les Opération", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/alloperation/{idAgence}")
    public ResponseEntity<List<OperationDto>> findAllOperations(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(operationService.getAllOperation(idAgence));
    }

    @Operation(summary = "Trouver un Bail Appartement par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findById/{id}")
    public ResponseEntity<BailAppartementDto> findByIDBailAppartement(@PathVariable("id") Long id) {
     //   log.info("Find Bail Appartement by ID{}", id);
        return ResponseEntity.ok(bailAppartementService.findById(id));
    }

    @Operation(summary = "Trouver un Bail par son nom", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findByName/{name}")
    public ResponseEntity<BailAppartementDto> findByNameBailAppartement(@PathVariable("name") String name) {
      //  log.info("Find Bail Magain By nom {}", name);
        return ResponseEntity.ok(bailAppartementService.findByName(name));
    }
}
