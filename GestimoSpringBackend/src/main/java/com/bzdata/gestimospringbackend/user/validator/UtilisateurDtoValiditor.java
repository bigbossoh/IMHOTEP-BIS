package com.bzdata.gestimospringbackend.user.validator;

import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UtilisateurDtoValiditor {
    public static List<String> validate(UtilisateurRequestDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            // errors.add("Veuillez renseigner l'email de l'utilisateur");
            errors.add("Veuillez renseigner le mot de passe de l'utilisateur");
            errors.add("Veuillez renseigner le nom de l'utilisateur");
            errors.add("Veuillez renseigner le mobile de l'utilisateur");
            errors.add("Veuillez renseigner l'utilisateur responsable de la création de cet utilisateur");
            // errors.addAll(AgenceDtoValidator.validate(null));
            // errors.addAll(RoleDtoValidator.validate(null));
            return errors;
        }
        // if (!StringUtils.hasLength(dto.getEmail())) {
        //     errors.add("Veuillez renseigner l'email de l'utilisateur");
        // }
        if (!StringUtils.hasLength(dto.getPassword())) {
            errors.add("Veuillez renseigner le mot de passe de l'utilisateur");
        }
        if (!StringUtils.hasLength(dto.getNom())) {
            errors.add("Veuillez renseigner le nom de l'utilisateur");
        }
        if (!StringUtils.hasLength(dto.getMobile())) {
            errors.add("Veuillez renseigner le mobile de l'utilisateur");
        }
        if (dto.getUserCreate() == null) {
            errors.add("Veuillez renseigner l'utilisateur responsable de la création de cet utilisateur");
        }
        // errors.addAll(AgenceDtoValidator.validate(dto.getAgenceDto()));
        // errors.addAll(RoleDtoValidator.validate(dto.getRoleRequestDto()));
        return errors;
    }

}
