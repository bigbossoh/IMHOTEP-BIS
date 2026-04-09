package com.bzdata.gestimospringbackend.validator;

import com.bzdata.gestimospringbackend.DTOs.VillaDto;

import java.util.ArrayList;
import java.util.List;

public class VillaDtoValidator {
    public static List<String> validate(VillaDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseignez l'Id de l'agence");
            errors.add("Veuillez selectionner un utilisateur ayant comme role PROPRIETAIRE");
            errors.add("Veuillez selectionner un utilisateur");
            return errors;
        }

        if (dto.getIdAgence() == null) {
            errors.add("Veuillez renseignez l'Id de l'agence");
        }
        if (dto.getIdSite() == null) {
            errors.add("Veuillez selectionner une le site");
        }
        // if (dto.getIdUtilisateur() == null) {
        //     errors.add("Veuillez selectionner un utilisateur");
        // }

        return errors;
    }

}
