package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.SiteRequestDto;
import com.bzdata.gestimospringbackend.DTOs.VillaDto;

public interface VillaService {

    //boolean save(VillaDto dto);
    VillaDto saveUneVilla(VillaDto dto);
    boolean delete(Long id);

    Long maxOfNumBien(Long idAgence);

    List<VillaDto> findAll(Long idAgence);
    List<VillaDto> findAllLibre(Long idAgence);
    VillaDto findById(Long id);

    VillaDto findByName(String nom);

    List<VillaDto> findAllBySite(SiteRequestDto siteRequestDto);

    List<VillaDto> findAllByIdSite(Long id);

  //  Map<Site, Long> getNumberVillaBySite();
}
