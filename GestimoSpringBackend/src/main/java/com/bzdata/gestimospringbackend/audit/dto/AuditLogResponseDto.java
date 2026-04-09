package com.bzdata.gestimospringbackend.audit.dto;

import com.bzdata.gestimospringbackend.audit.entity.AuditLog;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuditLogResponseDto {
    private Long id;
    private Long idAgence;
    private String timestamp;
    private Long userId;
    private String userName;
    private String method;
    private String url;
    private String action;
    private String module;
    private Integer status;
    private Boolean success;
    private Long durationMs;

    public static AuditLogResponseDto fromEntity(AuditLog entity) {
        AuditLogResponseDto dto = new AuditLogResponseDto();
        dto.setId(entity.getId());
        dto.setIdAgence(entity.getIdAgence());
        dto.setTimestamp(entity.getTimestamp());
        dto.setUserId(entity.getUserId());
        dto.setUserName(entity.getUserName());
        dto.setMethod(entity.getMethod());
        dto.setUrl(entity.getUrl());
        dto.setAction(entity.getAction());
        dto.setModule(entity.getModule());
        dto.setStatus(entity.getStatus());
        dto.setSuccess(entity.getSuccess());
        dto.setDurationMs(entity.getDurationMs());
        return dto;
    }
}
