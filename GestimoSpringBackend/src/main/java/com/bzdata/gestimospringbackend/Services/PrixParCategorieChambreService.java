package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.PrixParCategorieChambreDto;

public interface PrixParCategorieChambreService extends AbstractService<PrixParCategorieChambreDto>{
    PrixParCategorieChambreDto saveOrUpDatePrixPArCategoryChambre(PrixParCategorieChambreDto dto);
    List<PrixParCategorieChambreDto> listPrixParIdCateogori(Long idCategori);
}
