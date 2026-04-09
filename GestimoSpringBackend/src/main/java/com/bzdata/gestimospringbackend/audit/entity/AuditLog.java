package com.bzdata.gestimospringbackend.audit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_id_agence", columnList = "idAgence"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "idAgence")
    private Long idAgence;

    @Column(name = "timestamp", nullable = false, length = 30)
    private String timestamp; // ISO-8601 string set by client

    @Column(name = "userId")
    private Long userId;

    @Column(name = "userName", length = 150)
    private String userName;

    @Column(name = "method", nullable = false, length = 10)
    private String method;

    @Column(name = "url", length = 1024)
    private String url;

    @Column(name = "action", length = 512)
    private String action;

    @Column(name = "module", length = 100)
    private String module;

    @Column(name = "status")
    private Integer status;

    @Column(name = "success")
    private Boolean success;

    @Column(name = "durationMs")
    private Long durationMs;
}
