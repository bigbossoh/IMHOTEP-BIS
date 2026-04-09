package com.bzdata.gestimospringbackend.audit.service.impl;

import com.bzdata.gestimospringbackend.audit.dto.AuditLogRequestDto;
import com.bzdata.gestimospringbackend.audit.dto.AuditLogResponseDto;
import com.bzdata.gestimospringbackend.audit.entity.AuditLog;
import com.bzdata.gestimospringbackend.audit.repository.AuditLogRepository;
import com.bzdata.gestimospringbackend.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public AuditLogResponseDto save(AuditLogRequestDto dto) {
        AuditLog log = AuditLog.builder()
            .idAgence(dto.getIdAgence())
            .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : Instant.now().toString())
            .userId(dto.getUserId())
            .userName(dto.getUserName())
            .method(dto.getMethod())
            .url(dto.getUrl())
            .action(dto.getAction())
            .module(dto.getModule())
            .status(dto.getStatus())
            .success(dto.getSuccess())
            .durationMs(dto.getDurationMs())
            .build();

        return AuditLogResponseDto.fromEntity(auditLogRepository.save(log));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponseDto> findAllByAgence(Long idAgence) {
        return auditLogRepository.findAllByIdAgenceOrderByIdDesc(idAgence)
            .stream()
            .map(AuditLogResponseDto::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteAllByAgence(Long idAgence) {
        auditLogRepository.deleteAllByIdAgence(idAgence);
    }
}
