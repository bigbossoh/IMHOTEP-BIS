package com.bzdata.gestimospringbackend.audit.service;

import com.bzdata.gestimospringbackend.audit.dto.AuditLogRequestDto;
import com.bzdata.gestimospringbackend.audit.dto.AuditLogResponseDto;

import java.util.List;

public interface AuditLogService {
    AuditLogResponseDto save(AuditLogRequestDto dto);
    List<AuditLogResponseDto> findAllByAgence(Long idAgence);
    void deleteAllByAgence(Long idAgence);
}
