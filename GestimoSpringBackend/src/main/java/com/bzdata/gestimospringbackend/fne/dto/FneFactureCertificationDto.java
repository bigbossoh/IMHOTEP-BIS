package com.bzdata.gestimospringbackend.fne.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FneFactureCertificationDto {

  private Long id;
  private Instant dateCertification;
  private String typeDocument;
  private Long idReservation;
  private String factureNumero;
  private String clientNom;
  private String etablissement;
  private String pointOfSale;
  private String modePaiement;
  private double montant;

  private boolean certifiee;
  private String fneReference;
  private String fneNcc;
  private String fneVerificationUrl;
  private Integer fneBalanceSticker;
  private boolean fneWarning;
  private String messageErreur;
}
