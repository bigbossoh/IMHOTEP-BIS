package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDate;

import com.bzdata.gestimospringbackend.Models.AppelLoyer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
// @FieldDefaults(level = AccessLevel.PRIVATE)
public class AppelLoyerDto {
    private Long id;
    Long idAgence;
    Long idCreateur;
    private String periodeAppelLoyer;
    private String statusAppelLoyer;
    private LocalDate datePaiementPrevuAppelLoyer;
    private LocalDate dateDebutMoisAppelLoyer;
    private LocalDate dateFinMoisAppelLoyer;
    private int anneeAppelLoyer;
    private int moisChiffreAppelLoyer;
    private String descAppelLoyer;
    private double soldeAppelLoyer;
    private boolean isSolderAppelLoyer;
    private double montantBailLPeriode;
    private Long bailLocationAppelLoyer;

    public static AppelLoyerDto fromEntity(AppelLoyer appelLoyer) {
        if (appelLoyer == null) {
            return null;
        }
        return AppelLoyerDto.builder()
                .id(appelLoyer.getId())
                .idAgence(appelLoyer.getIdAgence())
                .periodeAppelLoyer(appelLoyer.getPeriodeAppelLoyer())
                .statusAppelLoyer(appelLoyer.getStatusAppelLoyer())
                .datePaiementPrevuAppelLoyer(appelLoyer.getDatePaiementPrevuAppelLoyer())
                .dateDebutMoisAppelLoyer(appelLoyer.getDateDebutMoisAppelLoyer())
                .dateFinMoisAppelLoyer(appelLoyer.getDateFinMoisAppelLoyer())
                .anneeAppelLoyer(appelLoyer.getAnneeAppelLoyer())
                .moisChiffreAppelLoyer(appelLoyer.getMoisChiffreAppelLoyer())
                .descAppelLoyer(appelLoyer.getDescAppelLoyer())
                .montantBailLPeriode(appelLoyer.getMontantLoyerBailLPeriode())
                .bailLocationAppelLoyer(appelLoyer.getBailLocationAppelLoyer().getId())
                .soldeAppelLoyer(appelLoyer.getSoldeAppelLoyer())
                .isSolderAppelLoyer(appelLoyer.isSolderAppelLoyer())
                .build();
    }

}
