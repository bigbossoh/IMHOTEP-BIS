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
public class BailPrintView {
  private Long bailId;
  private String agenceNom;
  private String agenceSigle;
  private String agenceAdresse;
  private String agenceTelephone;
  private String agenceEmail;
  private String bailCode;
  private String designationBail;
  private String typeBien;
  private String bienCode;
  private String bienNom;
  private String bienAdresse;
  private String bienDescription;
  private String dateSignature;
  private String dateDebut;
  private String dateFin;
  private String dureeLabel;
  private String periodicitePaiement;
  private String loyerMensuel;
  private String loyerAnnuel;
  private String cautionAmount;
  private Integer cautionMonths;
  private String locataireNom;
  private String locataireEmail;
  private String locataireMobile;
  private String bailleurNom;
  private String bailleurEmail;
  private String bailleurMobile;
  private String signatureVille;
}
