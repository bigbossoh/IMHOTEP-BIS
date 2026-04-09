package com.bzdata.gestimospringbackend.user.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserEstablishmentAssignmentRequestDto {
  Long userId;
  Long establishmentId;
  boolean defaultEtablissement;
}
