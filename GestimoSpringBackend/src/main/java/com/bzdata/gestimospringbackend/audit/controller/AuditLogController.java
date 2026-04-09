package com.bzdata.gestimospringbackend.audit.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.audit.dto.AuditLogRequestDto;
import com.bzdata.gestimospringbackend.audit.dto.AuditLogResponseDto;
import com.bzdata.gestimospringbackend.audit.service.AuditLogService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(APP_ROOT + "/audit")
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<AuditLogResponseDto> save(@RequestBody AuditLogRequestDto dto) {
        return ResponseEntity.ok(auditLogService.save(dto));
    }

    @GetMapping("/agence/{idAgence}")
    public ResponseEntity<List<AuditLogResponseDto>> findAllByAgence(@PathVariable Long idAgence) {
        return ResponseEntity.ok(auditLogService.findAllByAgence(idAgence));
    }

    @DeleteMapping("/agence/{idAgence}")
    public ResponseEntity<Void> deleteAllByAgence(@PathVariable Long idAgence) {
        auditLogService.deleteAllByAgence(idAgence);
        return ResponseEntity.noContent().build();
    }
}
