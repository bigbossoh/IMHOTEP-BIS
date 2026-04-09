package com.bzdata.gestimospringbackend.DTOs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrixParCategorieChambreDto {
  Long id;
  Long idAgence;
  Long idCreateur;
  String nombreDeJour;
  double prix;
  int intervalPrix;
  String description;
  int nbrDiffJour;
  Long idCategorieChambre;
}
