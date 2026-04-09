package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.RoleRequestDto;

import org.springframework.util.StringUtils;

public class RoleDtoValidator {
    public static List<String> validate(RoleRequestDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Veuillez renseigner le nom du role");
            return errors;
        }
        if (!StringUtils.hasLength(dto.getRoleName())) {
            errors.add("Veuillez renseigner le nom du role");
        }

        return errors;
    }

}

