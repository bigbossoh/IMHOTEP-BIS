package com.bzdata.gestimospringbackend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.EspeceEncaissementDto;
import com.bzdata.gestimospringbackend.Services.EspeceEncaissementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/especeencaissement")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class EspeceEncaissementController {

    final EspeceEncaissementService encaissementService;

    @PostMapping("/save")
    @Operation(summary = "Creation et mise à jour d'un encaissement especes", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<EspeceEncaissementDto> saveEspeceEncaissement(@RequestBody EspeceEncaissementDto dto) {
        log.info("We are going to save a new Especeencaissement{}", dto);
        return ResponseEntity.ok(encaissementService.save(dto));
    }

}
