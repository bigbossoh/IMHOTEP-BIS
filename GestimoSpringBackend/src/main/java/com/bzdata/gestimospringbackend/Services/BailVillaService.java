package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailVillaDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;

public interface BailVillaService {

    OperationDto saveNewBailVilla(BailVillaDto dto);

    boolean delete(Long id);

    List<BailVillaDto> findAll(Long idAgence);

    BailVillaDto findById(Long id);

    BailVillaDto findByName(String nom);

    List<BailVillaDto> findAllByIdBienImmobilier(Long id);

    List<BailVillaDto> findAllByIdLocataire(Long id);
}
