package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PaysDto;

public interface PaysService {
    PaysDto save(PaysDto dto);
    boolean delete(Long id);
    List<PaysDto>findAll();
    PaysDto findById(Long id);   
    PaysDto  findByName(String nom);

}
