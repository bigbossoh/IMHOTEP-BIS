package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.VilleDto;

import org.springframework.util.StringUtils;

public class VilleDtoValidator {
    public static List<String> validate(VilleDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom de la Ville");
            errors.add("Veuillez renseigner l'abréviation de la Ville");
            return errors;
        }
        if (!StringUtils.hasLength(dto.getNomVille())) {
            errors.add("Veuillez renseigner le nom de la Ville");
        }
        if (!StringUtils.hasLength(dto.getAbrvVille())) {
            errors.add("Veuillez renseigner l'abréviation de la Ville");
        }
        return errors;
    }
}
