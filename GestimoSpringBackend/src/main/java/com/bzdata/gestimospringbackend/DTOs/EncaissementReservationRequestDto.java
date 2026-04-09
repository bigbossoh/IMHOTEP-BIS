package com.bzdata.gestimospringbackend.DTOs;

import java.time.Instant;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncaissementReservationRequestDto {

  Long idReservation;
  private Long idAgence;
  private Long idCreateur;
 // private LocalDate creationDate;
  private String modePaiement;
  LocalDate dateEncaissement;
  double montantEncaissement;
  double encienSoldReservation;
  double nvoSoldeReservation;

  Long idAppartement;
}
