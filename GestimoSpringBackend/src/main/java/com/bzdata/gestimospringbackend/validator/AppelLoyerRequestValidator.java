package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyerRequestDto;

public class AppelLoyerRequestValidator {
    public static List<String> validate(AppelLoyerRequestDto dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {

            errors.add("Veuillez renseigner le montant du bail en cours");
            errors.add("Veuillez renseigner l'lID de l'agence");
            errors.add("Veuillez renseigner l' ID du bail de location.");
            return errors;
        }
        if(dto.getIdAgence()==null){
            errors.add("Veuillez renseigner l'lID de l'agence");
        }
        if(dto.getMontantLoyerEnCours()==0){
            errors.add("Veuillez renseigner le montant du bail en cours");
        }

        if ( dto.getIdBailLocation()==null) {
            errors.add("Veuillez renseigner le bail de location.");
        }
        return errors;
    }
}

