package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailAppartementDto;

import org.springframework.util.StringUtils;

public class BailAppartementDtoValidator {
    public static List<String> validate(BailAppartementDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom");
            errors.add("Veuillez renseigner l'abréviation ");
            return errors;
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
