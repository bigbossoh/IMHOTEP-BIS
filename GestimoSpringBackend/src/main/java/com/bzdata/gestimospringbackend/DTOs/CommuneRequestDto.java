package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Commune;

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
public class CommuneRequestDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String abrvCommune;
    String nomCommune;
    Long idVille;

    public static CommuneRequestDto fromEntity(Commune commune) {
        if (commune == null) {
            return null;
        }
        return CommuneRequestDto.builder()
                .id(commune.getId())
                .abrvCommune(commune.getAbrvCommune())
                .nomCommune(commune.getNomCommune())
                .idAgence(commune.getIdAgence())
                .idVille(commune.getVille().getId()).build();
    }
}
