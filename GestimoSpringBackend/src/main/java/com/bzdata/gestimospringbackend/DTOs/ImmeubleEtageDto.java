package com.bzdata.gestimospringbackend.DTOs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImmeubleEtageDto  {
    Long id;
    private Long idAgence;
    private  Long idCreateur;
    String codeNomAbrvImmeuble;
    String nomCompletImmeuble;
    String nomBaptiserImmeuble;
    String descriptionImmeuble;
    int numImmeuble;
    int nbrEtage;
    int nbrePiecesDansImmeuble;
    boolean isGarrage;
    Long idSite;
    Long idUtilisateur;

    String nomPropio;
    String prenomProprio;
}
