package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.MagasinDto;
import com.bzdata.gestimospringbackend.DTOs.MagasinResponseDto;
import com.bzdata.gestimospringbackend.DTOs.SiteRequestDto;

import java.util.List;

public interface MagasinService {

   // boolean save(MagasinDto dto);
    MagasinDto saveUnMagasin(MagasinDto dto);
    boolean delete(Long id);

    Long maxOfNumBienMagasin(Long idAgence);

    List<MagasinResponseDto> findAll(Long idAgence);
    List<MagasinResponseDto> findAllLibre(Long idAgence);
    MagasinDto findById(Long id);

    MagasinDto findByName(String nom);

    List<MagasinDto> findAllBySite(SiteRequestDto siteRequestDto);

    List<MagasinDto> findAllByIdSite(Long id);

    List<MagasinDto> findAllByIdEtage(Long id);
}
