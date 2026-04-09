package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.CommuneRequestDto;
import com.bzdata.gestimospringbackend.DTOs.CommuneResponseDto;
import com.bzdata.gestimospringbackend.DTOs.VilleDto;

public interface CommuneService {
    CommuneRequestDto save(CommuneRequestDto dto);

    boolean delete(Long id);

    List<CommuneRequestDto> findAll();

    CommuneRequestDto findById(Long id);

    CommuneRequestDto findByName(String nom);

    List<CommuneRequestDto> findAllByVille(VilleDto villeDto);

    List<CommuneResponseDto> findAllByIdVille(Long id);
}
