package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.CronMailDto;
import com.bzdata.gestimospringbackend.Services.CronMailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/taches-planifiees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class CronMailController {

  final CronMailService cronMailService;

  @GetMapping("/agence/{idAgence}")
  @Operation(summary = "Recuperer la configuration de planification d'une agence")
  public ResponseEntity<CronMailDto> getConfigurationByAgence(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(cronMailService.getConfigurationByAgence(idAgence));
  }

  @PostMapping("/save")
  @Operation(summary = "Creer ou mettre a jour la configuration de planification mensuelle")
  public ResponseEntity<CronMailDto> saveConfiguration(
    @RequestBody CronMailDto dto
  ) {
    return ResponseEntity.ok(cronMailService.saveConfiguration(dto));
  }

  @PostMapping("/run-now/{idAgence}")
  @Operation(summary = "Executer immediatement l'appel de loyer planifie pour le mois suivant")
  public ResponseEntity<Boolean> runNow(@PathVariable("idAgence") Long idAgence) {
    return ResponseEntity.ok(cronMailService.runNow(idAgence));
  }
}
