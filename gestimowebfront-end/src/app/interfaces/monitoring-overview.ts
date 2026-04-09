export interface MonitoringOverview {
  uptimeMs?: number;
  startedAt?: string;
  databaseProductName?: string;
  databaseName?: string;
  databaseSizeBytes?: number;
  auditedActionsCount?: number;
  averageAuditDurationMs?: number;
  lastAuditTimestamp?: string;
  systemCpuUsagePercent?: number;
  processCpuUsagePercent?: number;
  jvmMemoryUsagePercent?: number;
  jvmMemoryUsedBytes?: number;
  jvmMemoryMaxBytes?: number;
  systemMemoryUsagePercent?: number;
  systemMemoryUsedBytes?: number;
  systemMemoryTotalBytes?: number;
  systemMemoryFreeBytes?: number;
  diskUsagePercent?: number;
  diskUsedBytes?: number;
  diskTotalBytes?: number;
  diskFreeBytes?: number;
  availableProcessors?: number;
}
