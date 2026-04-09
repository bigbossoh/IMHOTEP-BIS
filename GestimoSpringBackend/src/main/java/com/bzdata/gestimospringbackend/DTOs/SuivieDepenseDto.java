package com.bzdata.gestimospringbackend.DTOs;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.enumeration.OperationType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SuivieDepenseDto {
   Long id;
   Long idAgence;
   Long idCreateur;
   LocalDate dateEncaissement;
   String designation;
   String referenceDepense;
   String categorieDepense;
   String libelleDepense;
   String descriptionDepense;
   String codeTransaction;
   Double montantDepense;
   String modePaiement;  
   OperationType operationType;
   String cloturerSuivi;
   Long idChapitre;
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
   String justificatifNom;
   String justificatifType;
   Boolean hasJustificatif;
   String workflowStatus;
   Integer currentValidationLevel;
   Integer maxValidationLevel;
   Boolean workflowRequired;
   Long demandeurId;
   String demandeurNom;
   Instant submittedAt;
   Instant validatedAt;
   Instant rejectedAt;
   Instant cancelledAt;
   String validationNiveau1Label;
   String validationNiveau1Role;
   Long validationNiveau1UserId;
   String validationNiveau1UserName;
   String validationNiveau2Label;
   String validationNiveau2Role;
   Long validationNiveau2UserId;
   String validationNiveau2UserName;
   String validationNiveau3Label;
   String validationNiveau3Role;
   Long validationNiveau3UserId;
   String validationNiveau3UserName;
   List<DepenseValidationHistoryDto> history = new ArrayList<>();
}
