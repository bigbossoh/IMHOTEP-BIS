package com.bzdata.gestimospringbackend.DTOs;

import java.util.List;
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
public class AppelLoyerPeriodPrintView {
  private String periodeCode;
  private String periodeLabel;
  private String agenceNom;
  private String agenceSigle;
  private String agenceLogoDataUrl;
  private String agenceAdresse;
  private String agenceTelephone;
  private String agenceTelephoneFixe;
  private String agencePortable;
  private String agenceEmail;
  private String agenceBoitePostale;
  private String agenceNcc;
  private String proprietaireNom;
  private String generationDate;
  private int nombreLignes;
  private String totalLoyer;
  private String totalEncaisse;
  private String totalRestant;
  private List<AppelLoyerPrintLine> lignes;
}
