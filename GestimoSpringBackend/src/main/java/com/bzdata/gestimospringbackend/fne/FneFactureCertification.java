package com.bzdata.gestimospringbackend.fne;

import com.bzdata.gestimospringbackend.Models.AbstractEntity;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Trace persistée de chaque tentative de certification FNE (succès ou
 * échec), afin de pouvoir présenter un historique/recapitulatif des
 * factures certifiées aupres de la DGI.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FneFactureCertification extends AbstractEntity {

  String typeDocument;
  Long idReservation;
  String factureNumero;
  String clientNom;
  String etablissement;
  String pointOfSale;
  String modePaiement;
  double montant;

  boolean certifiee;
  String fneReference;
  String fneNcc;
  String fneVerificationUrl;
  Integer fneBalanceSticker;
  boolean fneWarning;
  String messageErreur;
}
