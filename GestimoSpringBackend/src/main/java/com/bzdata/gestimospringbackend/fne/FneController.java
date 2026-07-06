package com.bzdata.gestimospringbackend.fne;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.fne.dto.FneFactureCertificationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/fne")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class FneController {

  final FneFactureCertificationService fneFactureCertificationService;

  @GetMapping("/factures/{idAgence}")
  @Operation(
    summary = "Liste des factures certifiées (et tentatives de certification) FNE d'une agence",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<List<FneFactureCertificationDto>> listeFacturesCertifiees(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(
      fneFactureCertificationService.listerParAgence(idAgence)
    );
  }
}
