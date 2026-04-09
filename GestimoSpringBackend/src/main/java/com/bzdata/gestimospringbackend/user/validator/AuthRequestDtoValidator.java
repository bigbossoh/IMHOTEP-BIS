package com.bzdata.gestimospringbackend.user.validator;

import com.bzdata.gestimospringbackend.user.dto.request.AuthRequestDto;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class AuthRequestDtoValidator {

    public static List<String> validate(AuthRequestDto authRequestDto) {
        List<String> errors = new ArrayList<>();

        if (authRequestDto == null) {
            errors.add("Veuillez renseigner l'email");
            errors.add("Veuillez renseigner le mot de passe");
            return errors;
        }
        if (!StringUtils.hasLength(authRequestDto.getUsername())) {
            errors.add("Veuillez renseigner l'email");
        }
        if (!StringUtils.hasLength(authRequestDto.getPassword())) {
            errors.add("Veuillez renseigner le mot de passe");
        }
        return errors;
    }

}
