package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailMagasinDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;

public interface BailMagasinService {
    OperationDto save(BailMagasinDto dto);

    boolean delete(Long id);

    List<BailMagasinDto> findAll(Long idAgence);

    BailMagasinDto findById(Long id);

    BailMagasinDto findByName(String nom);

    List<BailMagasinDto> findAllByIdBienImmobilier(Long id);

    List<BailMagasinDto> findAllByIdLocataire(Long id);
}
