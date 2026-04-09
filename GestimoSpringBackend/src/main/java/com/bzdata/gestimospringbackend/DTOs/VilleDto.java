package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Ville;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class VilleDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String abrvVille;
    String nomVille;
    Long idPays;

    public static VilleDto fromEntity(Ville ville) {
        if (ville == null) {
            return null;
        }
        return VilleDto.builder()
                .id(ville.getId())
                .idAgence(ville.getIdAgence())
                .abrvVille(ville.getAbrvVille())
                .nomVille(ville.getNomVille())
                .idPays(ville.getPays().getId())
                .build();
    }
}
