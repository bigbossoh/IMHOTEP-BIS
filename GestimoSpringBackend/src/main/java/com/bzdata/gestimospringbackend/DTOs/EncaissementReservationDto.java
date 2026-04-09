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
public class EncaissementReservationDto {

  Long id;
  Long idReservation;
  private Long idAgence;
  private Long idCreateur;
  private Instant creationDate;

  private String modePaiement;

  private String operationType;

  LocalDate dateEncaissement;
  Long idLastEncaissement;
  double montantEncaissement;
  double soldeEncaissement;
  double encienSoldReservation;
  double nvoSoldeReservation;

  String intituleDepense;

  EntiteOperation entiteOperation;

  private ReservationAfficheDto reservationAfficheDto;

  String typePaiement;
}
