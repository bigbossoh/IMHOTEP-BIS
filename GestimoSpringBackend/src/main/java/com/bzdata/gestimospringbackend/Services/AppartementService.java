package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.AppartementDto;

public interface AppartementService {
    AppartementDto save(AppartementDto dto);
 AppartementDto saveForCategorie(AppartementDto dto);
    boolean delete(Long id);

    List<AppartementDto> findAll(Long idAgence);
    List<AppartementDto> findAllLibre(Long idAgence);
    List<AppartementDto> findAllMeuble(Long idAgence);
    AppartementDto findById(Long id);

    AppartementDto findByName(String nom);

    List<AppartementDto> findAllByIdEtage(Long id);

    List<AppartementDto> findAllAppartementByIdCategorie(Long idCategorie);
}
