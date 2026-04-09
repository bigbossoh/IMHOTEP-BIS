package com.bzdata.gestimospringbackend.DTOs;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.hotel.PrixParCategorieChambre;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryChambreSaveOrUpdateDto {

  Long id;
  Long idAgence;
  Long idCreateur;

  @NotNull(message = "La Description ne doit pas etre null")
  @NotEmpty(message = "La Description ne doit pas etre vide")
  @NotBlank(message = "La Description ne doit pas etre vide")
  String name;
  

  @NotNull(message = "Le Nom ne doit pas etre null")
  @NotEmpty(message = "Le Nom ne doit pas etre vide")
  @NotBlank(message = "Le Nom ne doit pas etre vide")
 String description;

   List<PrixParCategorieChambreDto> prixGategorieDto;
   List<AppartementDto> appartements;
}
