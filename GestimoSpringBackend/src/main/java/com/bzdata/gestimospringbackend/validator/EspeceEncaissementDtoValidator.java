package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.EspeceEncaissementDto;

public class EspeceEncaissementDtoValidator {
    public static List<String> validate(EspeceEncaissementDto dto) {
        List<String> errors = new ArrayList<>();
        if (dto == null) {
            errors.add("Aucun encaissement à enregistrer");
            // return errors;
        }
        return errors;
    }
}
