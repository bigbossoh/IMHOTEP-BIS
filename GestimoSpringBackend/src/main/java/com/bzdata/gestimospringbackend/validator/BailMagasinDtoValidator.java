package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailMagasinDto;

import org.springframework.util.StringUtils;

public class BailMagasinDtoValidator {
    public static List<String> validate(BailMagasinDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom");
            errors.add("Veuillez renseigner l'abréviation ");
            errors.add("La date de fin ne peut être antérieur à la date de debut");
            return errors;
        }
        if(dto.getDateFin().compareTo(dto.getDateDebut())<=0){
            errors.add("La date de fin ne peut être antérieur à la date de debut");
        }
        if (!StringUtils.hasLength(dto.getAbrvCodeBail())) {
            errors.add("Veuillez renseigner l'abreviation");
        }
        if (!StringUtils.hasLength(dto.getDesignationBail())) {
            errors.add("Veuillez renseigner la désignation");
        }
        return errors;
    }
}
