package com.bzdata.gestimospringbackend.validator;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyerDto;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class AppelLoyerDtoValidator {
    public static List<String> validate(AppelLoyerDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("La date de fin ne peut être antérieur à la date de debut");
            errors.add("Veuillez renseigner le montant du bail en cours");
            errors.add("Veuillez renseigner l'la periode de l'appel de loyer.");
            errors.add("Veuillez renseigner le bail de location.");
            return errors;
        }
        if (dto.getDateFinMoisAppelLoyer().compareTo(dto.getDateDebutMoisAppelLoyer()) <= 0) {
            errors.add("La date de fin ne peut être antérieur à la date de debut");
        }
        if (dto.getMontantBailLPeriode() == 0) {
            errors.add("Veuillez renseigner le montant du bail en cours");
        }
        if (!StringUtils.hasLength(dto.getPeriodeAppelLoyer())) {
            errors.add("Veuillez renseigner l'la periode de l'appel de loyer.");
        }
        if (dto.getBailLocationAppelLoyer() == null ) {
            errors.add("Veuillez renseigner le bail de location.");
        }
        return errors;
    }
}
