package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.enumeration.EntiteOperation;
import com.bzdata.gestimospringbackend.enumeration.ModePaiement;
import com.bzdata.gestimospringbackend.enumeration.OperationType;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class EncaissementPrincipal extends AbstractEntity {

  @Enumerated(EnumType.STRING)
  private ModePaiement modePaiement;

  @Enumerated(EnumType.STRING)
  private OperationType operationType;

  LocalDate dateEncaissement;

  double montantEncaissement;
  double soldeEncaissement;
  double encienSoldReservation;
  double nvoSoldeReservation;
  boolean cloturerEncaissement;
  private String intituleDepense;

  @Enumerated(EnumType.STRING)
  private EntiteOperation entiteOperation;

  @ManyToOne
  private AppelLoyer appelLoyerEncaissement;

  String typePaiement;
  String statureCloture;
}
