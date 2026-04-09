package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Pays;

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
public class PaysDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String abrvPays;
    String nomPays;


    public static PaysDto fromEntity(Pays pays) {
        if (pays == null) {
            return null;
        }
        return PaysDto.builder()
                .id(pays.getId())
                .abrvPays(pays.getAbrvPays())
                .nomPays(pays.getNomPays())
                .idAgence(pays.getIdAgence())
                .build();
    }

    public static Pays toEntity(PaysDto dto) {
        if (dto == null) {
            return null;
        }
        Pays pays = new Pays();
        pays.setAbrvPays(dto.getAbrvPays());
        pays.setId(dto.getId());
        pays.setNomPays(dto.getNomPays());
        pays.setIdAgence(dto.getIdAgence());
        return pays;
    }
}