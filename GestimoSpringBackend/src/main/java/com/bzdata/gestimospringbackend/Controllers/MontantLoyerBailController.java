package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.MontantLoyerBailDto;
import com.bzdata.gestimospringbackend.Services.MontantLoyerBailService;

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
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/montantloyerbail")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class MontantLoyerBailController {
    final MontantLoyerBailService montantLoyerBailService;

    @Operation(summary = "Trouver un Quartier par son ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/findMontantByBail/{id}")
    public ResponseEntity<List<MontantLoyerBailDto>> findByIDMontantLoyerBail(@PathVariable("id") Long id) {
        log.info("Find Commune by ID{}", id);
        return ResponseEntity.ok(montantLoyerBailService.findAllMontantLoyerBailByBailId(id));
    }
}
