package com.bzdata.gestimospringbackend.newCertificationWay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Autre taxe (customTaxes) telle qu'attendue par l'API FNE : { "name": ...,
 * "amount": ... }. Utilisée à la fois au niveau facture et au niveau ligne.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomTaxe {

  private String name;
  private double amount;
}
