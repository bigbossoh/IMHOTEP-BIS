package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Quartier;
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
public class QuartierRequestDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String abrvQuartier;
    String nomQuartier;
    Long idCommune;


    public static QuartierRequestDto fromEntity(Quartier quartier) {
        if (quartier == null) {
            return null;
        }
        return QuartierRequestDto.builder()
                .id(quartier.getId())
                .abrvQuartier(quartier.getAbrvQuartier())
                .nomQuartier(quartier.getNomQuartier())
                .idCommune(quartier.getCommune().getId())
                .idAgence(quartier.getIdAgence())
                .build();
    }
}
