package com.bzdata.gestimospringbackend.validator;

import com.bzdata.gestimospringbackend.DTOs.MontantLoyerBailDto;

import java.util.ArrayList;
import java.util.List;

public class MontantLoyerBailDtoValidator {
    public static List<String> validate(MontantLoyerBailDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le montant du loyer");
            errors.add("Veuillez renseigner la date d'affection du prix du loyer");
            return errors;
        }
        if (dto.getNouveauMontantLoyer() == 0) {
            errors.add("Veuillez renseigner le montant du loyer");
        }

        if (dto.getBailLocation() == null || dto.getBailLocation() == null) {
            errors.add("Veuillez renseigner le bail de location.");
        }
        return errors;
    }
}
