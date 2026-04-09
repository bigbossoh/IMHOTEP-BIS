package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.ImmeubleEtageDto;

public class ImmeubleEtageDtoValidator {
    public static List<String> validate(ImmeubleEtageDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {

            errors.add("Veuillez selectionner un utilisateur");
            errors.add("Veuillez selectionner une le site");
            errors.add("Veuillez renseigner le nombre d'etage de l'immeuble");
            return errors;
        }
        if (dto.getNbrEtage() == 0) {
            errors.add("Veuillez renseigner le nombre d'etage de l'immeuble");
        }
        if (dto.getIdSite() == null) {
            errors.add("Veuillez selectionner le site de l'immeuble");
        }
        if (dto.getIdUtilisateur() == null) {
            errors.add("Veuillez selectionner un utilisateur");
        }
        return errors;
    }
}
