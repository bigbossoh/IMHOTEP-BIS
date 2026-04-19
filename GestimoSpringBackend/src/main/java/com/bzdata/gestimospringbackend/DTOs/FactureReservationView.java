package com.bzdata.gestimospringbackend.DTOs;

import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FactureReservationView {
    // Agence
    String agenceNom;
    String agenceSigle;
    String agenceAdresse;
    String agenceTelephone;
    String agenceEmail;
    String agenceLogoDataUrl;

    // En-tête facture
    String factureNumero;
    String factureDate;

    // Client
    String clientNom;
    String clientContact;

    // Chambre
    String chambreNom;
    String chambreCategorie;

    // Séjour
    String dateDebut;
    String dateFin;
    int nombreNuits;
    String prixParNuit;

    // Montants
    String sousTotal;
    String pourcentageReduction;
    String montantReduction;
    String montantTotal;
    String montantPaye;
    String soldeRestant;
    String statut;

    // Voyageurs
    int nombreAdultes;
    int nombreEnfants;

    // Prestations additionnelles
    List<FacturePrestationLine> prestations;
    String totalPrestations;
    boolean hasPrestations;
}
