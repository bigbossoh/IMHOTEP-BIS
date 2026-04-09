package com.bzdata.gestimospringbackend.monitoring.service.impl;

import com.bzdata.gestimospringbackend.audit.entity.AuditLog;
import com.bzdata.gestimospringbackend.audit.repository.AuditLogRepository;
import com.bzdata.gestimospringbackend.monitoring.dto.MonitoringOverviewDto;
import com.bzdata.gestimospringbackend.monitoring.service.MonitoringService;
import com.sun.management.OperatingSystemMXBean;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.nio.file.FileStore;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MonitoringServiceImpl implements MonitoringService {

    private final AuditLogRepository auditLogRepository;
    private final DataSource dataSource;

    @Override
    public MonitoringOverviewDto getOverview(Long idAgence) {
        Runtime runtime = Runtime.getRuntime();
        RuntimeMXBean runtimeMxBean = ManagementFactory.getRuntimeMXBean();
        OperatingSystemMXBean operatingSystemMxBean =
                ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);

        DatabaseSnapshot databaseSnapshot = resolveDatabaseSnapshot();
        AuditSnapshot auditSnapshot = resolveAuditSnapshot(idAgence);
        DiskSnapshot diskSnapshot = resolveDiskSnapshot();

        long jvmUsedBytes = runtime.totalMemory() - runtime.freeMemory();
        long jvmMaxBytes = runtime.maxMemory();

        long systemTotalMemoryBytes = safePositiveLong(
                operatingSystemMxBean != null ? operatingSystemMxBean.getTotalMemorySize() : -1L
        );
        long systemFreeMemoryBytes = safePositiveLong(
                operatingSystemMxBean != null ? operatingSystemMxBean.getFreeMemorySize() : -1L
        );
        long systemUsedMemoryBytes = systemTotalMemoryBytes > 0 && systemFreeMemoryBytes >= 0
                ? systemTotalMemoryBytes - systemFreeMemoryBytes
                : -1L;

        return MonitoringOverviewDto.builder()
                .uptimeMs(runtimeMxBean.getUptime())
                .startedAt(Instant.ofEpochMilli(runtimeMxBean.getStartTime()).toString())
                .databaseProductName(databaseSnapshot.productName())
                .databaseName(databaseSnapshot.databaseName())
                .databaseSizeBytes(databaseSnapshot.databaseSizeBytes())
                .auditedActionsCount(auditSnapshot.count())
                .averageAuditDurationMs(auditSnapshot.averageDurationMs())
                .lastAuditTimestamp(auditSnapshot.lastAuditTimestamp())
                .systemCpuUsagePercent(normalizeLoadToPercent(
                        operatingSystemMxBean != null ? operatingSystemMxBean.getCpuLoad() : Double.NaN
                ))
                .processCpuUsagePercent(normalizeLoadToPercent(
                        operatingSystemMxBean != null ? operatingSystemMxBean.getProcessCpuLoad() : Double.NaN
                ))
                .jvmMemoryUsagePercent(calculatePercentage(jvmUsedBytes, jvmMaxBytes))
                .jvmMemoryUsedBytes(jvmUsedBytes)
                .jvmMemoryMaxBytes(jvmMaxBytes > 0 ? jvmMaxBytes : null)
                .systemMemoryUsagePercent(calculatePercentage(systemUsedMemoryBytes, systemTotalMemoryBytes))
                .systemMemoryUsedBytes(systemUsedMemoryBytes >= 0 ? systemUsedMemoryBytes : null)
                .systemMemoryTotalBytes(systemTotalMemoryBytes > 0 ? systemTotalMemoryBytes : null)
                .systemMemoryFreeBytes(systemFreeMemoryBytes >= 0 ? systemFreeMemoryBytes : null)
                .diskUsagePercent(calculatePercentage(diskSnapshot.usedBytes(), diskSnapshot.totalBytes()))
                .diskUsedBytes(diskSnapshot.usedBytes())
                .diskTotalBytes(diskSnapshot.totalBytes())
                .diskFreeBytes(diskSnapshot.freeBytes())
                .availableProcessors(runtime.availableProcessors())
                .build();
    }

    private AuditSnapshot resolveAuditSnapshot(Long idAgence) {
        if (idAgence == null || idAgence <= 0) {
            return new AuditSnapshot(0L, 0.0, null);
        }

        long count = auditLogRepository.countByIdAgence(idAgence);
        Double averageDurationMs = auditLogRepository.findAverageDurationMsByIdAgence(idAgence);
        Optional<AuditLog> lastAudit = auditLogRepository.findFirstByIdAgenceOrderByIdDesc(idAgence);

        return new AuditSnapshot(
                count,
                averageDurationMs != null ? round(averageDurationMs, 2) : 0.0,
                lastAudit.map(AuditLog::getTimestamp).orElse(null)
        );
    }

    private DatabaseSnapshot resolveDatabaseSnapshot() {
        try (Connection connection = dataSource.getConnection()) {
            String productName = connection.getMetaData().getDatabaseProductName();
            String databaseName = resolveCurrentDatabaseName(connection, productName);
            Long databaseSizeBytes = resolveDatabaseSize(connection, productName, databaseName);
            return new DatabaseSnapshot(productName, databaseName, databaseSizeBytes);
        } catch (SQLException exception) {
            log.warn("Impossible de recuperer les informations de base de donnees.", exception);
            return new DatabaseSnapshot(null, null, null);
        }
    }

    private String resolveCurrentDatabaseName(Connection connection, String productName) throws SQLException {
        String normalizedProductName = normalizeProductName(productName);

        if (normalizedProductName.contains("postgresql")) {
            try (Statement statement = connection.createStatement();
                 ResultSet resultSet = statement.executeQuery("select current_database()")) {
                if (resultSet.next()) {
                    return resultSet.getString(1);
                }
            }
        }

        String catalog = connection.getCatalog();
        if (hasText(catalog)) {
            return catalog;
        }

        String schema = connection.getSchema();
        if (hasText(schema)) {
            return schema;
        }

        return null;
    }

    private Long resolveDatabaseSize(Connection connection, String productName, String databaseName) throws SQLException {
        String normalizedProductName = normalizeProductName(productName);

        if (normalizedProductName.contains("mysql") || normalizedProductName.contains("mariadb")) {
            String schemaName = hasText(databaseName) ? databaseName : connection.getCatalog();
            if (!hasText(schemaName)) {
                return null;
            }

            try (PreparedStatement statement = connection.prepareStatement(
                    "select coalesce(sum(data_length + index_length), 0) " +
                            "from information_schema.tables where table_schema = ?")) {
                statement.setString(1, schemaName);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        return resultSet.getLong(1);
                    }
                }
            }
        }

        if (normalizedProductName.contains("postgresql")) {
            try (Statement statement = connection.createStatement();
                 ResultSet resultSet = statement.executeQuery(
                         "select pg_database_size(current_database())")) {
                if (resultSet.next()) {
                    return resultSet.getLong(1);
                }
            }
        }

        return null;
    }

    private DiskSnapshot resolveDiskSnapshot() {
        try {
            Path currentPath = Path.of("").toAbsolutePath();
            FileStore fileStore = Files.getFileStore(currentPath);
            long totalBytes = fileStore.getTotalSpace();
            long freeBytes = fileStore.getUsableSpace();
            long usedBytes = Math.max(0L, totalBytes - freeBytes);

            return new DiskSnapshot(totalBytes, usedBytes, freeBytes);
        } catch (IOException exception) {
            log.warn("Impossible de recuperer les informations disque.", exception);
            return new DiskSnapshot(null, null, null);
        }
    }

    private Double normalizeLoadToPercent(double rawValue) {
        if (Double.isNaN(rawValue) || rawValue < 0) {
            return null;
        }

        return round(rawValue * 100.0d, 1);
    }

    private Double calculatePercentage(Long usedBytes, Long totalBytes) {
        if (usedBytes == null || totalBytes == null || totalBytes <= 0 || usedBytes < 0) {
            return null;
        }

        return round((usedBytes * 100.0d) / totalBytes, 1);
    }

    private long safePositiveLong(long value) {
        return value >= 0 ? value : -1L;
    }

    private double round(double value, int scale) {
        double factor = Math.pow(10, scale);
        return Math.round(value * factor) / factor;
    }

    private String normalizeProductName(String productName) {
        return productName == null ? "" : productName.toLowerCase(Locale.ROOT);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private record AuditSnapshot(Long count, Double averageDurationMs, String lastAuditTimestamp) {
    }

    private record DatabaseSnapshot(String productName, String databaseName, Long databaseSizeBytes) {
    }

    private record DiskSnapshot(Long totalBytes, Long usedBytes, Long freeBytes) {
    }
}
