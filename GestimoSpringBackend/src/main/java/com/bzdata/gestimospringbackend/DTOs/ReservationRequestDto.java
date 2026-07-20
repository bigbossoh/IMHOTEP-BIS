package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDate;
import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationRequestDto {

  Long id;
  Long idAgence;
  Long idCreateur;

  Long idAppartementdDto;

  String dateDebut;
  String dateFin;
  Long idClient;
  Long idBien;

  Long idUtilisateur;
  String nom;
  String prenom;
  String username;
  double pourcentageReduction;
  double montantReduction;
  double soldReservation;
  double montantPaye;
  double montantReservation;
  double montantDeReservation;

  int nmbreAdulte;
  int nmbrEnfant;
  String vatType;
  String email;
  String paymentMode;
  String clientReservation;
  String taxes;
  String statutReservation; // Pré-réservation, À confirmer, Acompte versé, Soldée, Ferme, Annule

  String typeSejour; // "SEJOUR" (par défaut) ou "PASSAGE"
  String typePassage; // "JOUR" ou "NUIT", si typeSejour = "PASSAGE"
  String heureArrivee; // format "HH:mm"
  String heureDepart; // format "HH:mm"
}
