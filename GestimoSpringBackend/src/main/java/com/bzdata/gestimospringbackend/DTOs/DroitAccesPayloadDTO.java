package com.bzdata.gestimospringbackend.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DroitAccesPayloadDTO {
    Long id;
    Long idAgence;
    Long idCreateur;
    @NotNull(message = "Le libelleDroit ne doit pas etre null")
    @NotEmpty(message = "Le libelleDroit ne doit pas etre vide")
    @NotBlank(message = "Le libelleDroit ne doit pas etre vide")
    String libelleDroit;
}
