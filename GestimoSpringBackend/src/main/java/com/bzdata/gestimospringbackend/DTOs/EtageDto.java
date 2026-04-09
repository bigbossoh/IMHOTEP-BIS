package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Etage;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EtageDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    int numEtage;
    Long idImmeuble;
    String nomCompletEtage;
     String codeAbrvEtage;
    String nomBaptiserEtage;
     int nombrePieceSurEtage;

    public static EtageDto fromEntity(Etage etage) {
        if (etage == null) {
            return null;
        }
        return EtageDto.builder()
                .id(etage.getId())
                .idAgence(etage.getIdAgence())
                .idCreateur(etage.getIdCreateur())
                .numEtage(etage.getNumEtage())
                .idImmeuble(etage.getImmeuble().getId())
                .nomCompletEtage(etage.getNomCompletEtage())
                .codeAbrvEtage(etage.getCodeAbrvEtage())
                .nomBaptiserEtage(etage.getNomBaptiserEtage())
                .nombrePieceSurEtage(etage.getNombrePieceSurEtage())
                .build();
    }


}
