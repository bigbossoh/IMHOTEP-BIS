package com.bzdata.gestimospringbackend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelanceComptePrintLine {
  private String periodeCode;
  private String periodeLabel;
  private String datePaiementPrevue;
  private String bienCode;
  private String bienNom;
  private String bailCode;
  private String statut;
  private String montantLoyer;
  private String montantRestant;
}
