package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.ImmeubleDto;

public class ImmeubleDtoValidator {
    public static List<String> validate(ImmeubleDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            // errors.add("Veuillez renseigner l'abréviation.");
            // errors.add("Veuillez renseigner le Statut.");
            // errors.add("Veuillez renseigner l'état.");
            errors.add("Veuillez selectionner un utilisateur");
            errors.add("Veuillez selectionner une le site");
            return errors;
        }
        // if (!StringUtils.hasLength(dto.getAbrvNomImmeuble())) {
        // errors.add("Veuillez renseigner l'abréviation.");
        // }
        // if (!StringUtils.hasLength(dto.getStatutBien())) {
        // errors.add("Veuillez renseigner le Statut.");
        // }
        // if (!StringUtils.hasLength(dto.getEtatBien())) {
        // errors.add("Veuillez renseigner l'état.");
        // }
        if (dto.getIdSite() == null) {
            errors.add("Veuillez selectionner le site de l'immeuble");
        }
        if (dto.getIdUtilisateur() == null) {
            errors.add("Veuillez selectionner un utilisateur");
        }
        return errors;
    }
}
