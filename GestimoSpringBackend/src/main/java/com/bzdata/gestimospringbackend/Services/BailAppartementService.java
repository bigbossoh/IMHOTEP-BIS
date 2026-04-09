package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BailAppartementDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;

public interface BailAppartementService {
    OperationDto save(BailAppartementDto dto);

    boolean delete(Long id);

    List<BailAppartementDto> findAll(Long idAgence);

    BailAppartementDto findById(Long id);

    BailAppartementDto findByName(String nom);


}
