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

public class ImmeubleAfficheDto {
    Long id;
    int nbrEtage;
    int nbrePieceImmeuble;
    String abrvNomImmeuble;
    String descriptionImmeuble;
    int numeroImmeuble;
    boolean isGarrage;
    String nomPropio;
    String prenomProprio;

}
