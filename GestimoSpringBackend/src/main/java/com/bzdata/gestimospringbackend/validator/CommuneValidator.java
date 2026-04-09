package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.CommuneRequestDto;

import org.springframework.util.StringUtils;

public class CommuneValidator {
    public static List<String> validate(CommuneRequestDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom de Commune");
            errors.add("Veuillez renseigner l'abréviation de la commune");
            return errors;
        }
        if (!StringUtils.hasLength(dto.getNomCommune())) {
            errors.add("Veuillez renseigner le nom de la Commune");
        }
        if (!StringUtils.hasLength(dto.getAbrvCommune())) {
            errors.add("Veuillez renseigner l'abréviation de la Commune");
        }
        return errors;
    }
}
