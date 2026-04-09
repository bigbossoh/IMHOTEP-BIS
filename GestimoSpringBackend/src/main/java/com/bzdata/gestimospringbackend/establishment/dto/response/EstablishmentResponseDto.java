package com.bzdata.gestimospringbackend.establishment.dto.response;

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
public class EstablishmentResponseDto {
  Long id;
  Long idAgence;
  Long idCreateur;
  Long idChapitre;
  String libChapitre;
  List<Long> utilisateurIds;
}
