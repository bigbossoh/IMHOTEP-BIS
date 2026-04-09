import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MonitoringOverview } from 'src/app/interfaces/monitoring-overview';
import { SystemHealth } from 'src/app/interfaces/system-health';
import { AdminDashboardService } from '../../services/actuactor/admin-dashboard.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

interface HttpTraceItem {
  timestamp: string;
  timeTakenMs: number;
  request: {
    method: string;
    uri: string;
    remoteAddress: string;
    headers: Record<string, string>;
  };
  response: {
    status: number;
    headers: Record<string, string>;
  };
}

interface StatusCard {
  title: string;
  helper: string;
  count: number;
  tone: 'success' | 'warning' | 'info' | 'danger' | 'neutral';
}

@Component({
  standalone: false,
  selector: 'app-page-statistique',
  templateUrl: './page-statistique.component.html',
  styleUrls: ['./page-statistique.component.css'],
})
export class PageStatistiqueComponent implements OnInit, OnDestroy {
  public traceList: HttpTraceItem[] = [];
  public selectedTrace: HttpTraceItem | null = null;
  public systemHealth: SystemHealth | undefined;
  public monitoringOverview: MonitoringOverview | null = null;
  public processUpTime = '--';
  public searchTerm = '';
  public statusFilter = 'all';
  public errorMessage = '';
  public isRefreshing = false;
  public loadingTraces = false;
  public pageSize = 10;
  public page = 1;

  public readonly pageSizeOptions = [5, 10, 25, 50];
  public readonly statusFilterOptions = [
    { label: 'Tous', value: 'all' },
    { label: '200', value: '200' },
    { label: '400', value: '400' },
    { label: '403', value: '403' },
    { label: '404', value: '404' },
    { label: '500', value: '500' },
    { label: 'Autres', value: 'other' },
  ];

  private user: UtilisateurRequestDto | null = null;
  private uptimeMs = 0;
  private pendingLoads = 0;
  private uptimeIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly dashboardService: AdminDashboardService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.refreshDashboard(true);
  }

  ngOnDestroy(): void {
    this.stopUptimeTimer();
  }

  public onSelectTrace(trace: HttpTraceItem): void {
    this.selectedTrace = trace;
  }

  public closeTraceDetails(): void {
    this.selectedTrace = null;
  }

  public onRefreshData(): void {
    this.refreshDashboard(false);
  }

  public onFilterChange(): void {
    this.page = 1;
  }

  public exportTraces(): void {
    if (!this.filteredTraceList.length) {
      return;
    }

    const rows = [
      [
        'Timestamp',
        'Methode',
        'Statut',
        'Temps (ms)',
        'URI',
        'Adresse distante',
        'Origin',
        'User-Agent',
      ],
      ...this.filteredTraceList.map((trace) => [
        trace.timestamp,
        trace.request.method,
        trace.response.status.toString(),
        trace.timeTakenMs.toString(),
        trace.request.uri,
        trace.request.remoteAddress,
        this.getHeaderValue(trace.request.headers, 'origin'),
        this.getHeaderValue(trace.request.headers, 'user-agent'),
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((value) => this.escapeCsv(value)).join(';'))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `supervision-systeme-${this.buildExportTimestamp()}.csv`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }

  public trackTrace(index: number, trace: HttpTraceItem): string {
    return `${trace.timestamp}-${trace.request.uri}-${index}`;
  }

  public get filteredTraceList(): HttpTraceItem[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.traceList.filter((trace) => {
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'other'
          ? ![200, 400, 403, 404, 500].includes(trace.response.status)
          : trace.response.status === Number(this.statusFilter));

      if (!matchesStatus) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [
        trace.request.method,
        trace.request.uri,
        trace.request.remoteAddress,
        trace.response.status.toString(),
        this.getHeaderValue(trace.request.headers, 'user-agent'),
      ]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }

  public get totalTraceCount(): number {
    return this.traceList.length;
  }

  public get averageResponseTimeMs(): number {
    if (!this.traceList.length) {
      return 0;
    }

    const total = this.traceList.reduce(
      (sum, trace) => sum + trace.timeTakenMs,
      0
    );
    return Math.round(total / this.traceList.length);
  }

  public get statusCards(): StatusCard[] {
    return [
      this.createStatusCard('200', 'Succes', 200, 'success'),
      this.createStatusCard('400', 'Requetes invalides', 400, 'warning'),
      this.createStatusCard('403', 'Acces refuses', 403, 'warning'),
      this.createStatusCard('404', 'Routes absentes', 404, 'info'),
      this.createStatusCard('500', 'Erreurs serveur', 500, 'danger'),
      this.createStatusCard('Autres', 'Statuts hors catalogue', 'other', 'neutral'),
    ];
  }

  public get healthStatus(): string {
    return this.systemHealth?.status ?? '--';
  }

  public get databaseStatus(): string {
    return this.systemHealth?.components?.db?.status ?? '--';
  }

  public get databaseName(): string {
    return this.monitoringOverview?.databaseName ?? '--';
  }

  public get databaseProductName(): string {
    return this.monitoringOverview?.databaseProductName ?? 'Base inconnue';
  }

  public get databaseSizeLabel(): string {
    return this.formatBytes(this.monitoringOverview?.databaseSizeBytes);
  }

  public get averageAuditDurationLabel(): string {
    return this.formatMetricDuration(this.monitoringOverview?.averageAuditDurationMs);
  }

  public get auditedActionsCount(): number {
    return Number(this.monitoringOverview?.auditedActionsCount ?? 0);
  }

  public get lastAuditTimestamp(): string | null {
    return this.monitoringOverview?.lastAuditTimestamp ?? null;
  }

  public get startedAt(): string | null {
    return this.monitoringOverview?.startedAt ?? null;
  }

  public get systemCpuUsagePercentValue(): number {
    return this.normalizePercent(this.monitoringOverview?.systemCpuUsagePercent);
  }

  public get processCpuUsagePercentValue(): number {
    return this.normalizePercent(this.monitoringOverview?.processCpuUsagePercent);
  }

  public get jvmMemoryUsagePercentValue(): number {
    return this.normalizePercent(this.monitoringOverview?.jvmMemoryUsagePercent);
  }

  public get systemMemoryUsagePercentValue(): number {
    return this.normalizePercent(this.monitoringOverview?.systemMemoryUsagePercent);
  }

  public get diskUsagePercentValue(): number {
    return this.normalizePercent(this.monitoringOverview?.diskUsagePercent);
  }

  public get systemCpuUsageLabel(): string {
    return this.formatPercent(this.monitoringOverview?.systemCpuUsagePercent);
  }

  public get processCpuUsageLabel(): string {
    return this.formatPercent(this.monitoringOverview?.processCpuUsagePercent);
  }

  public get jvmUsageLabel(): string {
    return this.formatPercent(this.monitoringOverview?.jvmMemoryUsagePercent);
  }

  public get systemMemoryUsageLabel(): string {
    return this.formatPercent(this.monitoringOverview?.systemMemoryUsagePercent);
  }

  public get diskUsageLabel(): string {
    return this.formatPercent(this.monitoringOverview?.diskUsagePercent);
  }

  public get jvmUsageHint(): string {
    return `${this.formatBytes(
      this.monitoringOverview?.jvmMemoryUsedBytes
    )} utilises sur ${this.formatBytes(this.monitoringOverview?.jvmMemoryMaxBytes)}`;
  }

  public get systemMemoryUsageHint(): string {
    return `${this.formatBytes(
      this.monitoringOverview?.systemMemoryUsedBytes
    )} utilises sur ${this.formatBytes(
      this.monitoringOverview?.systemMemoryTotalBytes
    )}`;
  }

  public get diskUsageHint(): string {
    return `${this.formatBytes(this.monitoringOverview?.diskUsedBytes)} utilises sur ${this.formatBytes(
      this.monitoringOverview?.diskTotalBytes
    )}`;
  }

  public get availableProcessors(): number {
    return Number(this.monitoringOverview?.availableProcessors ?? 0);
  }

  public get systemMemoryFreeLabel(): string {
    return this.formatBytes(this.monitoringOverview?.systemMemoryFreeBytes);
  }

  public get diskFreeLabel(): string {
    return this.formatBytes(this.monitoringOverview?.diskFreeBytes);
  }

  public get diskTotalLabel(): string {
    return this.formatBytes(this.monitoringOverview?.diskTotalBytes);
  }

  public get selectedTraceOrigin(): string {
    return this.selectedTrace
      ? this.getHeaderValue(this.selectedTrace.request.headers, 'origin')
      : '--';
  }

  public get selectedTraceUserAgent(): string {
    return this.selectedTrace
      ? this.getHeaderValue(this.selectedTrace.request.headers, 'user-agent')
      : '--';
  }

  public get selectedTraceContentType(): string {
    return this.selectedTrace
      ? this.getHeaderValue(this.selectedTrace.response.headers, 'content-type')
      : '--';
  }

  public getStatusClass(status: number): string {
    if (status >= 500) {
      return 'status-badge status-badge--danger';
    }
    if (status === 404 || status === 403 || status === 400) {
      return 'status-badge status-badge--warning';
    }
    if (status >= 200 && status < 300) {
      return 'status-badge status-badge--success';
    }
    return 'status-badge status-badge--neutral';
  }

  public formatResponseTime(milliseconds: number): string {
    return `${milliseconds.toLocaleString('fr-FR')} ms`;
  }

  private refreshDashboard(startTimer: boolean): void {
    this.errorMessage = '';
    this.isRefreshing = true;
    this.pendingLoads = 0;
    this.loadMonitoringOverview(startTimer);
    this.loadSystemHealth();
    this.loadTraces();
  }

  private loadMonitoringOverview(startTimer: boolean): void {
    if (!this.user?.idAgence) {
      this.processUpTime = '--';
      this.finishRefreshLoad();
      return;
    }

    this.beginRefreshLoad();
    this.dashboardService.getMonitoringOverview(this.user.idAgence).subscribe({
      next: (response: MonitoringOverview) => {
        this.monitoringOverview = response;
        this.uptimeMs = Math.max(0, Number(response?.uptimeMs ?? 0));
        this.processUpTime = this.formatUptime(this.uptimeMs);
        if (startTimer || !this.uptimeIntervalId) {
          this.startUptimeTimer();
        }
        this.finishRefreshLoad();
      },
      error: (error: HttpErrorResponse) => {
        this.monitoringOverview = null;
        this.processUpTime = '--';
        this.errorMessage = this.extractErrorMessage(
          error,
          "Impossible de charger les metriques systeme."
        );
        this.finishRefreshLoad();
      },
    });
  }

  private loadTraces(): void {
    this.loadingTraces = true;
    this.beginRefreshLoad();

    this.dashboardService.getHttpTrace().subscribe({
      next: (response: any) => {
        const rawTraces = this.extractTraceCollection(response);
        this.traceList = rawTraces
          .map((trace) => this.normalizeTrace(trace))
          .filter(
            (trace) => !trace.request.uri.toLowerCase().includes('actuator')
          )
          .sort(
            (left, right) =>
              new Date(right.timestamp).getTime() -
              new Date(left.timestamp).getTime()
          );
        this.page = 1;
        this.loadingTraces = false;
        this.finishRefreshLoad();
      },
      error: (error: HttpErrorResponse) => {
        this.loadingTraces = false;
        this.errorMessage = this.extractErrorMessage(
          error,
          "Impossible de charger les traces HTTP de supervision."
        );
        this.finishRefreshLoad();
      },
    });
  }

  private loadSystemHealth(): void {
    this.beginRefreshLoad();
    this.dashboardService.getSystemHealth().subscribe({
      next: (response: SystemHealth) => {
        this.systemHealth = response;
        this.finishRefreshLoad();
      },
      error: (error: HttpErrorResponse) => {
        this.systemHealth = error.error;
        this.finishRefreshLoad();
      },
    });
  }

  private beginRefreshLoad(): void {
    this.pendingLoads += 1;
  }

  private finishRefreshLoad(): void {
    this.pendingLoads = Math.max(0, this.pendingLoads - 1);
    this.isRefreshing = this.pendingLoads > 0;
  }

  private startUptimeTimer(): void {
    this.stopUptimeTimer();
    this.uptimeIntervalId = setInterval(() => {
      this.uptimeMs += 1000;
      this.processUpTime = this.formatUptime(this.uptimeMs);
    }, 1000);
  }

  private stopUptimeTimer(): void {
    if (this.uptimeIntervalId) {
      clearInterval(this.uptimeIntervalId);
      this.uptimeIntervalId = null;
    }
  }

  private extractTraceCollection(response: any): any[] {
    if (Array.isArray(response?.exchanges)) {
      return response.exchanges;
    }

    if (Array.isArray(response?.traces)) {
      return response.traces;
    }

    return [];
  }

  private normalizeTrace(trace: any): HttpTraceItem {
    return {
      timestamp: trace?.timestamp ?? new Date().toISOString(),
      timeTakenMs: this.parseTimeTakenToMs(trace?.timeTaken),
      request: {
        method: trace?.request?.method ?? '--',
        uri: trace?.request?.uri ?? '--',
        remoteAddress: trace?.request?.remoteAddress ?? '--',
        headers: this.normalizeHeaders(trace?.request?.headers),
      },
      response: {
        status: Number(trace?.response?.status ?? 0),
        headers: this.normalizeHeaders(trace?.response?.headers),
      },
    };
  }

  private normalizeHeaders(headers: any): Record<string, string> {
    if (!headers || typeof headers !== 'object') {
      return {};
    }

    return Object.entries(headers).reduce((acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? value.join(', ') : String(value ?? '');
      return acc;
    }, {} as Record<string, string>);
  }

  private parseTimeTakenToMs(timeTaken: unknown): number {
    if (typeof timeTaken === 'number' && Number.isFinite(timeTaken)) {
      return Math.round(timeTaken);
    }

    if (typeof timeTaken !== 'string' || !timeTaken.trim()) {
      return 0;
    }

    const isoDurationMatch = timeTaken.match(
      /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i
    );

    if (isoDurationMatch) {
      const hours = Number(isoDurationMatch[1] ?? 0);
      const minutes = Number(isoDurationMatch[2] ?? 0);
      const seconds = Number(isoDurationMatch[3] ?? 0);
      return Math.round(((hours * 3600) + minutes * 60 + seconds) * 1000);
    }

    const numericValue = Number(timeTaken);
    return Number.isFinite(numericValue) ? Math.round(numericValue) : 0;
  }

  private createStatusCard(
    title: string,
    helper: string,
    status: number | 'other',
    tone: StatusCard['tone']
  ): StatusCard {
    const count =
      status === 'other'
        ? this.traceList.filter(
            (trace) => ![200, 400, 403, 404, 500].includes(trace.response.status)
          ).length
        : this.traceList.filter((trace) => trace.response.status === status).length;

    return { title, helper, count, tone };
  }

  private getHeaderValue(
    headers: Record<string, string> | undefined,
    key: string
  ): string {
    if (!headers) {
      return '--';
    }

    const match = Object.entries(headers).find(
      ([headerKey]) => headerKey.toLowerCase() === key.toLowerCase()
    );

    return match?.[1] || '--';
  }

  private formatUptime(milliseconds: number): string {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    if (days > 0) {
      return `${days} j ${hours} h ${minutes} min`;
    }

    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    }

    if (minutes > 0) {
      return `${minutes} min`;
    }

    return `${seconds} s`;
  }

  private formatMetricDuration(milliseconds: number | undefined): string {
    const value = Number(milliseconds ?? 0);
    if (!Number.isFinite(value) || value <= 0) {
      return '--';
    }

    if (value >= 1000) {
      return `${(value / 1000).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} s`;
    }

    return `${Math.round(value).toLocaleString('fr-FR')} ms`;
  }

  private formatBytes(bytes: number | string | undefined): string {
    const numericBytes = Number(bytes ?? 0);
    if (!numericBytes || numericBytes <= 0) {
      return '0 Bytes';
    }

    const unit = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(numericBytes) / Math.log(unit));
    return `${parseFloat(
      (numericBytes / Math.pow(unit, index)).toFixed(2)
    )} ${sizes[index]}`;
  }

  private formatPercent(value: number | undefined): string {
    const normalized = this.normalizePercent(value);
    return `${normalized.toLocaleString('fr-FR', {
      minimumFractionDigits: normalized % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    })}%`;
  }

  private normalizePercent(value: number | undefined): number {
    const normalized = Number(value ?? 0);
    if (!Number.isFinite(normalized) || normalized < 0) {
      return 0;
    }

    return Math.min(100, normalized);
  }

  private escapeCsv(value: string): string {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }

  private buildExportTimestamp(): string {
    const now = new Date();
    return [
      now.getFullYear(),
      `${now.getMonth() + 1}`.padStart(2, '0'),
      `${now.getDate()}`.padStart(2, '0'),
      `${now.getHours()}`.padStart(2, '0'),
      `${now.getMinutes()}`.padStart(2, '0'),
    ].join('');
  }

  private extractErrorMessage(
    error: HttpErrorResponse,
    fallbackMessage: string
  ): string {
    return error.error?.message || error.message || fallbackMessage;
  }

  private getCurrentUser(): UtilisateurRequestDto | null {
    try {
      return this.userService.getUserFromLocalCache();
    } catch (error) {
      return null;
    }
  }
}
