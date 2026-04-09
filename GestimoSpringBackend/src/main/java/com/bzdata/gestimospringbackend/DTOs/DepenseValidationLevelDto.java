package com.bzdata.gestimospringbackend.DTOs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DepenseValidationLevelDto {
  Integer levelOrder;
  String levelLabel;
  String validatorRoleName;
  Long validatorUserId;
  String validatorUserDisplayName;
  boolean active;
}
