package com.bzdata.gestimospringbackend.DTOs;

import java.util.ArrayList;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DepenseWorkflowConfigDto {
  Long id;
  Long idAgence;
  Long idCreateur;
  boolean active;
  Double validationThreshold;
  Integer levelCount;
  List<String> categories = new ArrayList<>();
  List<String> paymentModes = new ArrayList<>();
  List<DepenseValidationLevelDto> levels = new ArrayList<>();
}
