package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.SiteRequestDto;
import com.bzdata.gestimospringbackend.DTOs.SiteResponseDto;

import java.util.List;

public interface SiteService {
    boolean save(SiteRequestDto dto);
    SiteResponseDto saveSite(SiteRequestDto dto);
    boolean delete(Long id);

    List<SiteResponseDto> findAll(Long id);


    SiteResponseDto findById(Long id);

    SiteResponseDto findByName(String nom);
}
