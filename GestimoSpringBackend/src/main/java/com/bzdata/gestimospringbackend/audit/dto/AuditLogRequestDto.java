package com.bzdata.gestimospringbackend.audit.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuditLogRequestDto {
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
}
