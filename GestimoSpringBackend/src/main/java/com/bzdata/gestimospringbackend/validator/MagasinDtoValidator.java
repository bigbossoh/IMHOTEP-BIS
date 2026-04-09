package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.MagasinDto;

public class MagasinDtoValidator {
    public static List<String> validate(MagasinDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {

            errors.add("Veuillez renseignez l'Id de l'agence");
            errors.add("Veuillez selectionner un utilisateur");
            return errors;
        }

        if (dto.getIdAgence() == null) {
            errors.add("Veuillez renseignez l'Id de l'agence");
        }
        // if (dto.getIdUtilisateur() == null) {
        //     errors.add("Veuillez selectionner un utilisateur");
        // }

        return errors;
    }

}
