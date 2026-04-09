package com.bzdata.gestimospringbackend.DTOs;
 import java.time.LocalDate;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;

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
public class ReservationSaveOrUpdateDto {

    Long id;
    Long idAgence;
    Long idCreateur;

    UtilisateurRequestDto utilisateurRequestDto;
    Long idAppartementdDto;
Long idUtilisateur;
    LocalDate dateDebut;
    LocalDate dateFin;
   // UtilisateurAfficheDto utilisateurOperation;
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
    public void setUtilisateurRequestDto(String string) {
    }
}
