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
public class QuartierResponseDto {
    Long id;
    String abrvQuartier;
    String nomQuartier;
    CommuneResponseDto communeResponseDto;
    Long idAgence;
    public static QuartierResponseDto fromEntity(Quartier quartier) {
        if (quartier == null) {
            return null;
        }
        return QuartierResponseDto.builder()
                .id(quartier.getId())
                .abrvQuartier(quartier.getAbrvQuartier())
                .nomQuartier(quartier.getNomQuartier())
                .communeResponseDto(CommuneResponseDto.fromEntity(quartier.getCommune()))
                .idAgence(quartier.getIdAgence())
                .build();
    }
}
