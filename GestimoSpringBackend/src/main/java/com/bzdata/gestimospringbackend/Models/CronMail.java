package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CronMail extends AbstractEntity {
  String managerEmail;
  Integer dayOfMonth;
  Integer executionHour;
  Integer executionMinute;
  boolean enabled;
  LocalDateTime nextExecutionAt;
  LocalDateTime lastExecutionAt;
  String lastExecutionPeriod;

  @Column(name = "next_date_mail")
  LocalDate legacyNextDateMail;

  @Column(name = "is_donne")
  boolean legacyDone;
}
