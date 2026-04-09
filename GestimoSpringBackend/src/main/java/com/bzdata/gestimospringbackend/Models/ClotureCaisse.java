package com.bzdata.gestimospringbackend.Models;

import java.time.LocalDate;
import jakarta.persistence.Entity;
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
public class ClotureCaisse extends AbstractEntity {

  double totalEncaisse;
  String statutCloture;
  String chapitreCloture;
  LocalDate dateDeDCloture;
  int intervalNextCloture;
  LocalDate dateFinCloture;
  LocalDate dateNextCloture;
}
