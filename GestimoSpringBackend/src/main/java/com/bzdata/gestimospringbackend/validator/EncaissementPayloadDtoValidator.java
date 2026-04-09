package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.EncaissementPayloadDto;

public class EncaissementPayloadDtoValidator {
    public static List<String> validate(EncaissementPayloadDto dto) {
        List<String> errors = new ArrayList<>();
        if (dto == null) {
            errors.add("Aucun encaissement à enregistrer");
            return errors;
        }
        if (dto.getIdAppelLoyer()== null) {
            errors.add("Veuillez selectionner l'appel loyer");
        }
        if (dto.getMontantEncaissement() <= 0) {
            errors.add("Veuillez renseigner le montant du loyer paye");
        }

        return errors;
    }
}
