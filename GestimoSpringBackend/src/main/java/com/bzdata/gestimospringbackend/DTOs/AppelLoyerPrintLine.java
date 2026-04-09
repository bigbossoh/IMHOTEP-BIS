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
public class AppelLoyerPrintLine {
  private String locataireCivilite;
  private String locataireNom;
  private String bienCode;
  private String bienNom;
  private String typeBien;
  private String bailCode;
  private String datePaiementPrevue;
  private String dateDebut;
  private String dateFin;
  private String statut;
  private String montantLoyer;
  private String montantPaye;
  private String montantRestant;
}
