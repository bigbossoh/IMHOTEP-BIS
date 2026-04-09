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
public class DepenseManagementUpsertRequestDto {
  Long id;
  Long idAgence;
  Long idCreateur;
  String demandeurNom;
  String action;
  String referenceDepense;
  LocalDate dateEncaissement;
  String categorieDepense;
  String libelleDepense;
  String descriptionDepense;
  Double montantDepense;
  String modePaiement;
  String statutPaiement;
  LocalDate datePaiement;
  Long bienImmobilierId;
  String bienImmobilierCode;
  String bienImmobilierLibelle;
  String typeBienImmobilier;
  Long appartementLocalId;
  String appartementLocalLibelle;
  String fournisseurNom;
  String fournisseurTelephone;
  String fournisseurEmail;
  Long idChapitre;
}
