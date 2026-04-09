package com.bzdata.gestimospringbackend.monitoring.controller;

import com.bzdata.gestimospringbackend.monitoring.dto.MonitoringOverviewDto;
import com.bzdata.gestimospringbackend.monitoring.service.MonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

@RestController
@RequestMapping(APP_ROOT + "/monitoring")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MonitoringController {

    private final MonitoringService monitoringService;

    @GetMapping("/overview/{idAgence}")
    @Operation(summary = "Retourne les metriques de supervision pour une agence",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MonitoringOverviewDto> getOverview(@PathVariable("idAgence") Long idAgence) {
        return ResponseEntity.ok(monitoringService.getOverview(idAgence));
    }
}
