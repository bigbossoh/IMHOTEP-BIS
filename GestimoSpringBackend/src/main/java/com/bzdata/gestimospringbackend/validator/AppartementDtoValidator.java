package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.AppartementDto;

public class AppartementDtoValidator {
    public static List<String> validate(AppartementDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Aucune données à enregistrer.");
            errors.add("Veuillez selectionner un etage");
            return errors;
        }
        // if (dto.getIdEtageAppartement() == null) {
        //     errors.add("Veuillez selectionner un etage");
        // }
        return errors;
    }
}
