package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.enumeration.OperationType;
import java.time.Instant;
import java.time.LocalDate;
import jakarta.persistence.Basic;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class SuivieDepense extends AbstractEntity {

  private LocalDate dateEncaissement;
  private String designation;
  @Column(unique = true)
  private String referenceDepense;
  private String categorieDepense;
  private String libelleDepense;
  @Column(length = 4000)
  private String descriptionDepense;
  private String codeTransaction;
  private Double montantDepense;
  private String statutPaiement;
  private LocalDate datePaiement;
  private Long bienImmobilierId;
  private String bienImmobilierCode;
  private String bienImmobilierLibelle;
  private String typeBienImmobilier;
  private Long appartementLocalId;
  private String appartementLocalLibelle;
  private String fournisseurNom;
  private String fournisseurTelephone;
  private String fournisseurEmail;
  private String justificatifNom;
  private String justificatifType;
  @Lob
  @Basic(fetch = FetchType.LAZY)
  private byte[] justificatifData;
  private String workflowStatus;
  private Integer currentValidationLevel;
  private Integer maxValidationLevel;
  private Boolean workflowRequired;
  private Long demandeurId;
  private String demandeurNom;
  private Instant submittedAt;
  private Instant validatedAt;
  private Instant rejectedAt;
  private Instant cancelledAt;
  private String validationNiveau1Label;
  private String validationNiveau1Role;
  private Long validationNiveau1UserId;
  private String validationNiveau1UserName;
  private String validationNiveau2Label;
  private String validationNiveau2Role;
  private Long validationNiveau2UserId;
  private String validationNiveau2UserName;
  private String validationNiveau3Label;
  private String validationNiveau3Role;
  private Long validationNiveau3UserId;
  private String validationNiveau3UserName;

  private String modePaiement;

  @Enumerated(EnumType.STRING)
  private OperationType operationType;
  @ManyToOne
  private Chapitre chapitreSuivis;
}
