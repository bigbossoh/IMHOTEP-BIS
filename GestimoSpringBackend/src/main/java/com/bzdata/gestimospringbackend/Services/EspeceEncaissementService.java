package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.EspeceEncaissementDto;

public interface EspeceEncaissementService {
    EspeceEncaissementDto save(EspeceEncaissementDto dto);

    boolean delete(Long id);

    List<EspeceEncaissementDto> findAll();

    EspeceEncaissementDto findById(Long id);

    EspeceEncaissementDto findByName(String nom);

    List<EspeceEncaissementDto> findAllByIdBienImmobilier(Long id);

    List<EspeceEncaissementDto> findAllByIdLocataire(Long id);
}
