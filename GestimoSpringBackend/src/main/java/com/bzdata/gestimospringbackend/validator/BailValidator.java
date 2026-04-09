package com.bzdata.gestimospringbackend.validator;

import java.util.ArrayList;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailDto;

public class BailValidator {
    public static List<String> validate(BailDto dto) {
        List<String> errors = new ArrayList<>();
        if (dto == null) {
            errors.add("Aucun donnée à traiter");
            return errors;
        }
        return errors;
    }
}
