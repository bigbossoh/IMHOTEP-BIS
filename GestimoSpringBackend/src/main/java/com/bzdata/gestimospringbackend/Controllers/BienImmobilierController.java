package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BienImmobilierAffiheDto;
import com.bzdata.gestimospringbackend.Services.BienImmobilierService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping(APP_ROOT + "/bienImmobilier")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class BienImmobilierController {
    final BienImmobilierService bienImmobilierService;

    @Operation(summary = "Liste de toutes les Baux Villa", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/all/{idAgence}/{chapitre}")
    public ResponseEntity<List<BienImmobilierAffiheDto>> findAllBien(@PathVariable("idAgence") Long idAgence,@PathVariable("chapitre") Long chapitre) {
        return ResponseEntity.ok(bienImmobilierService.findAll(idAgence,chapitre));
    }

    @Operation(summary = "Liste de toutes les bien immobiliers oqpq", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/allBienOccuper/{idAgence}/{chapitre}")
    public ResponseEntity<List<BienImmobilierAffiheDto>> findAllBienOqp(@PathVariable("idAgence") Long idAgence,
            @PathVariable("chapitre") Long chapitre) {
        return ResponseEntity.ok(bienImmobilierService.findAllBienOccuper(idAgence, chapitre));
    }
    @Operation(summary = "Liste de toutes les Baux Villa", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/rattacherUnBienAUnChapitre/{idBien}/{chapitre}")
    public ResponseEntity<BienImmobilierAffiheDto> rattacherUnBienAUnChapitre(@PathVariable("idBien") Long idBien,@PathVariable("chapitre") Long chapitre) {
        return ResponseEntity.ok(bienImmobilierService.rattacherUnBienAUnChapitre(idBien,chapitre));
    }
}
