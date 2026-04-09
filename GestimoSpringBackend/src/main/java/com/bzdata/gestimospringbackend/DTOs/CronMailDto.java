package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CronMailDto {
  Long id;
  Long idAgence;
  String managerEmail;
  Integer dayOfMonth;
  Integer executionHour;
  Integer executionMinute;
  boolean enabled;
  LocalDateTime nextExecutionAt;
  LocalDateTime lastExecutionAt;
  String lastExecutionPeriod;
}
