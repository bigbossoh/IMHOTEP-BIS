package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.enumeration.EntiteOperation;
import com.bzdata.gestimospringbackend.enumeration.ModePaiement;
import com.bzdata.gestimospringbackend.enumeration.OperationType;
import java.time.Instant;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncaissementPrincipalDTO {

  private Long id;
  private Long idAgence;
  private Long idCreateur;
  private Instant creationDate;
  private ModePaiement modePaiement;
  double soldeEncaissement;
  private OperationType operationType;
  private LocalDate dateEncaissement;
  private double montantEncaissement;
  private String intituleDepense;
  private EntiteOperation entiteOperation;
  private AppelLoyersFactureDto appelLoyersFactureDto;
  private String typePaiement;
  private String statureCloture;
  private String entite;
}
