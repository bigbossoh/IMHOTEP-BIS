package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Commune;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class CommuneResponseDto {
    Long id;
    Long idAgence;
    String abrvCommune;
    String nomCommune;
    VilleDto villeDto;
    public static CommuneResponseDto fromEntity(Commune commune) {
        if (commune == null) {
            return null;
        }
        log.info("We are going to create  a new Commune {}", commune);
        return CommuneResponseDto.builder()
                .id(commune.getId())
                .abrvCommune(commune.getAbrvCommune())
                .nomCommune(commune.getNomCommune())
                .idAgence(commune.getIdAgence())
                .villeDto(VilleDto.fromEntity(commune.getVille()))
                .build();
    }
}
