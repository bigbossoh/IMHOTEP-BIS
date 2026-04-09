package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.QuartierRequestDto;

public interface QuartierService {
    QuartierRequestDto save(QuartierRequestDto dto);

    boolean delete(Long id);

    List<QuartierRequestDto> findAll(Long idAgence);

    QuartierRequestDto findById(Long id);

    QuartierRequestDto findByName(String nom);

    List<QuartierRequestDto> findAllByIdCommune(Long id);
}
