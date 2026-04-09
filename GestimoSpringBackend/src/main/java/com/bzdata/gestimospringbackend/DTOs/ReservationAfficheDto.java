package com.bzdata.gestimospringbackend.DTOs;

import java.time.Instant;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationAfficheDto {

  Long id;
  Long idAgence;
  Long idCreateur;

  Instant creationDate;
  Instant lastModifiedDate;
  Long idUtilisateur;
  String email;
  String mobile;
  String username;
  Long idAppartementdDto;
  Long idLastEncaissement;
  LocalDate dateDebut;
  LocalDate dateFin;
  String utilisateurOperation;
  String bienImmobilierOperation;

  String designationBail;
  String abrvCodeBail;
  boolean enCoursBail;
  boolean archiveBail;
  double montantCautionBail;
  int nbreMoisCautionBail;
  double nouveauMontantLoyer;
  Long idBienImmobilier;
  long idLocataire;
  String codeAbrvBienImmobilier;
  double pourcentageReduction;
  double montantReduction;
  double soldReservation;
  double montantPaye;
  int nmbreAdulte;
  double montantReservation;
  int nmbrEnfant;
  String descriptionCategori;
  String nameCategori;
  double priceCategori;
  int nbrDiffJourCategori;
  double pourcentReducCategori;
}
