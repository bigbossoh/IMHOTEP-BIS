package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PaysDto;

import org.springframework.util.StringUtils;

public class PaysDtoValidator {
    public static List<String> validate(PaysDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom du Pays");
            errors.add("Veuillez renseigner l'abréviation du Pays");
            return errors;
        }
        if (!StringUtils.hasLength(dto.getNomPays())) {
            errors.add("Veuillez renseigner le nom du Pays");
        }
        if (!StringUtils.hasLength(dto.getAbrvPays())) {
            errors.add("Veuillez renseigner l'abréviation du Pays");
        }
        return errors;
    }
}
