package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.Models.hotel.Reservation;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.repository.ReservationRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Regle de gestion du numero de facture des reservations :
 * "FACT" + annee en cours + "RS" (agence SEVE INVESTISSEMENT) ou "MO" (agence MOLIBETY)
 * + numero d'ordre incremental, la sequence etant propre a chaque couple annee/agence.
 */
@Service
@RequiredArgsConstructor
public class FactureNumeroReservationService {

  private static final ZoneId ZONE = ZoneId.systemDefault();

  private final ReservationRepository reservationRepository;
  private final AgenceImmobiliereRepository agenceImmobiliereRepository;

  /** A utiliser a la creation d'une reservation, avant qu'elle n'ait d'id. */
  public String genererPourNouvelleReservation(Long idAgence) {
    int annee = LocalDate.now().getYear();
    return genererNumero(idAgence, annee, null);
  }

  /** A utiliser pour attribuer, a posteriori, un numero a une reservation existante qui n'en a pas encore. */
  public String genererPourReservationExistante(Reservation reservation) {
    Instant creation = reservation.getCreationDate() != null
      ? reservation.getCreationDate()
      : Instant.now();
    int annee = LocalDate.ofInstant(creation, ZONE).getYear();
    return genererNumero(reservation.getIdAgence(), annee, reservation.getId());
  }

  private String genererNumero(Long idAgence, int annee, Long idReservationLimite) {
    AgenceImmobiliere agence = resolveAgenceById(idAgence);
    boolean estMolibety = isEtablissementMolibety(agence);
    String suffixe = estMolibety ? "MO" : "RS";

    long rang = reservationRepository
      .findAll()
      .stream()
      .filter(r -> idReservationLimite == null || (r.getId() != null && r.getId() <= idReservationLimite))
      .filter(r -> {
        Instant date = r.getCreationDate() != null ? r.getCreationDate() : Instant.now();
        return LocalDate.ofInstant(date, ZONE).getYear() == annee;
      })
      .filter(r -> isEtablissementMolibety(resolveAgenceById(r.getIdAgence())) == estMolibety)
      .count();

    if (idReservationLimite == null) {
      rang = rang + 1;
    }

    return "FACT" + annee + suffixe + String.format("%05d", rang);
  }

  private boolean isEtablissementMolibety(AgenceImmobiliere agence) {
    if (agence == null) {
      return false;
    }
    String sigle = agence.getSigleAgence() != null ? agence.getSigleAgence().trim() : null;
    String nom = agence.getNomAgence() != null ? agence.getNomAgence().trim() : null;
    return
      "MOLIBETY".equalsIgnoreCase(sigle) ||
      "MOLIBETY".equalsIgnoreCase(nom) ||
      "MAGISER".equalsIgnoreCase(sigle) ||
      "MAGISER".equalsIgnoreCase(nom) ||
      "AGENCE MAGISER".equalsIgnoreCase(nom);
  }

  private AgenceImmobiliere resolveAgenceById(Long idAgence) {
    if (idAgence == null) {
      return null;
    }
    return agenceImmobiliereRepository.findById(idAgence).orElse(null);
  }
}
