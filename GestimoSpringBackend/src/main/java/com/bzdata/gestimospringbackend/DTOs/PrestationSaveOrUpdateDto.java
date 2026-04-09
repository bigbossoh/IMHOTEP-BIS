package com.bzdata.gestimospringbackend.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrestationSaveOrUpdateDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    @NotNull(message = "La Description ne doit pas etre null")
    @NotEmpty(message = "La Description ne doit pas etre vide")
    @NotBlank(message = "La Description ne doit pas etre vide")
    String name;
    double amount;

}
