package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.CronMailDto;

public interface CronMailService {
  CronMailDto getConfigurationByAgence(Long idAgence);

  CronMailDto saveConfiguration(CronMailDto dto);

  boolean runNow(Long idAgence);

  int processDueConfigurations();
}
