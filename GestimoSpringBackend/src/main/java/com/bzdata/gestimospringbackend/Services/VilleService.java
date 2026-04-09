package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PaysDto;
import com.bzdata.gestimospringbackend.DTOs.VilleDto;

public interface VilleService {
    VilleDto save(VilleDto dto);

    boolean delete(Long id);

    List<VilleDto> findAll();

    VilleDto findById(Long id);

    VilleDto findByName(String nom);

    List<VilleDto> findAllByPays(PaysDto paysDto);

    List<VilleDto> findAllByIdPays(Long id);
}
