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
public class RelanceComptePrintView {
  private String agenceNom;
  private String agenceSigle;
  private String agenceLogoDataUrl;
  private String agenceAdresse;
  private String agenceTelephoneFixe;
  private String agencePortable;
  private String agenceEmail;
  private String agenceBoitePostale;
  private String agenceNcc;
  private String generationDate;
  private String locataireCivilite;
  private String locataireNom;
  private String locataireEmail;
  private String premierePeriode;
  private String dernierePeriode;
  private int nombrePeriodes;
  private String totalDu;
  private List<RelanceComptePrintLine> lignes;
}
