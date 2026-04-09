package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDate;

import com.bzdata.gestimospringbackend.Models.EspeceEncaissement;

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
public class EspeceEncaissementDto {
    LocalDate dateEncaissement;
    double montantEncaissement;
    Long idUtilisateurEncaissement;
    Long idAppelLoyerEncaissement;

    public static EspeceEncaissementDto fromEntity(EspeceEncaissement especeEncaissement) {
        if (especeEncaissement == null) {
            return null;
        }
        return EspeceEncaissementDto.builder()
                .dateEncaissement(especeEncaissement.getDateEncaissement())
                .montantEncaissement(especeEncaissement.getMontantEncaissement())
                .idUtilisateurEncaissement(especeEncaissement.getUtilisateurEncaissement().getId())
                .idAppelLoyerEncaissement(especeEncaissement.getAppelLoyerEncaissement().getId())
                .build();
    }

}
