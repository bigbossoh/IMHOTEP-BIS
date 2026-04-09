package com.bzdata.gestimospringbackend.DTOs;

import java.time.Instant;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DepenseValidationHistoryDto {
  Long id;
  Integer validationLevel;
  String actionType;
  String workflowStatusAfterAction;
  Long actorUserId;
  String actorName;
  String actorRoleName;
  String commentaire;
  Instant actionAt;
}
