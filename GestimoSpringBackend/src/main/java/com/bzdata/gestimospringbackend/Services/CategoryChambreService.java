package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.CategoryChambreSaveOrUpdateDto;


public interface CategoryChambreService extends AbstractService<CategoryChambreSaveOrUpdateDto>{
 CategoryChambreSaveOrUpdateDto saveOrUpdateCategoryChambre(CategoryChambreSaveOrUpdateDto dto);
 List<CategoryChambreSaveOrUpdateDto>findAllCategorie(Long idAgnce);
  CategoryChambreSaveOrUpdateDto findCategorieByIdAppartement(Long idBien);

}
