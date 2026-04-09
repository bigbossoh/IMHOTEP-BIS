package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClotureCaisseDto {

  Long id;
  Long idAgence;
  Long idCreateur;

  double totalEncaisse;
  String chapitreCloture;
  LocalDate dateDeDCloture;
  int intervalNextCloture;
  LocalDate dateFinCloture;
  String caissiere;
  LocalDate dateNextCloture;
}
/** 
 *  idAgence: number;
  idCreateur: number;
  totalEncaisse: number;
  chapitreCloture: string;
  dateDeDCloture: string;
  intervalNextCloture: 3;
  dateFinCloture: string;
*/