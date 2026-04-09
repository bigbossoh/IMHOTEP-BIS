package com.bzdata.gestimospringbackend.monitoring.service;

import com.bzdata.gestimospringbackend.monitoring.dto.MonitoringOverviewDto;

public interface MonitoringService {

    MonitoringOverviewDto getOverview(Long idAgence);
}
