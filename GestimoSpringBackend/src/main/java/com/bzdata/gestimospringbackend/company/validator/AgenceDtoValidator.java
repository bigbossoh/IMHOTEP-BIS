package com.bzdata.gestimospringbackend.company.validator;

import com.bzdata.gestimospringbackend.company.dto.request.AgenceRequestDto;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class AgenceDtoValidator {

    public static List<String> validate(AgenceRequestDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom de l'agence");
            errors.add("Veuillez renseigner l'email de l'agence'");
            errors.add("Veuillez renseigner le mobile de l'agence");
            return errors;
        }
        if (!StringUtils.hasLength(dto.getNomAgence())) {
            errors.add("Veuillez renseigner le nom de l'agence");
        }
        if (!StringUtils.hasLength(dto.getEmailAgence())) {
            errors.add("Veuillez renseigner l'email de l'agence'");
        }
        if (!StringUtils.hasLength(dto.getMobileAgence())) {
            errors.add("Veuillez renseigner le mobile de l'agence");
        }
        return errors;
    }

}
