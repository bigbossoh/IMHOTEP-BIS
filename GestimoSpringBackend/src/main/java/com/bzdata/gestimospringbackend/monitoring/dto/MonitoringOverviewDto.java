package com.bzdata.gestimospringbackend.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonitoringOverviewDto {

    private Long uptimeMs;
    private String startedAt;

    private String databaseProductName;
    private String databaseName;
    private Long databaseSizeBytes;

    private Long auditedActionsCount;
    private Double averageAuditDurationMs;
    private String lastAuditTimestamp;

    private Double systemCpuUsagePercent;
    private Double processCpuUsagePercent;

    private Double jvmMemoryUsagePercent;
    private Long jvmMemoryUsedBytes;
    private Long jvmMemoryMaxBytes;

    private Double systemMemoryUsagePercent;
    private Long systemMemoryUsedBytes;
    private Long systemMemoryTotalBytes;
    private Long systemMemoryFreeBytes;

    private Double diskUsagePercent;
    private Long diskUsedBytes;
    private Long diskTotalBytes;
    private Long diskFreeBytes;

    private Integer availableProcessors;
}
