package com.bzdata.gestimospringbackend.Services;

import java.time.LocalDate;
import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.MontantLoyerBailDto;

public interface MontantLoyerBailService {

    boolean saveNewMontantLoyerBail(Long currentIdMontantLoyerBail, double nouveauMontantLoyer,
                                    double ancienMontantLoyer,Long idBailLocation, Long idAgence,LocalDate datePriseEnCompDate);

    MontantLoyerBailDto updateNewMontantLoyerBail(MontantLoyerBailDto dto);

    boolean delete(Long id);

    List<MontantLoyerBailDto> findAll(Long idAgence);

    MontantLoyerBailDto findById(Long id);

    List<MontantLoyerBailDto> findAllMontantLoyerBailByBailId(Long idBailLocation);

    boolean supprimerUnMontantParIdBail(Long idBail);
}
