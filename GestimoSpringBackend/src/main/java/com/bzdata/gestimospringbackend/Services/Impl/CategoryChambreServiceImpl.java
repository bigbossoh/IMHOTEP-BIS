package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.CategoryChambreSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Models.hotel.CategorieChambre;
import com.bzdata.gestimospringbackend.Services.CategoryChambreService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.CategoryChambreRepository;
import com.bzdata.gestimospringbackend.validator.ObjectsValidator;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class CategoryChambreServiceImpl implements CategoryChambreService {

  final GestimoWebMapperImpl gestimoWebMapperImpl;
  final CategoryChambreRepository categoryChambreRepository;
  private final ObjectsValidator<CategoryChambreSaveOrUpdateDto> validator;

  @Override
  public Long save(CategoryChambreSaveOrUpdateDto dto) {
    throw new UnsupportedOperationException("Unimplemented method 'save'");
  }

  @Override
  public List<CategoryChambreSaveOrUpdateDto> findAll() {
    return categoryChambreRepository
      .findAll()
      .stream()
      .sorted(Comparator.comparing(CategorieChambre::getName))
      .map(gestimoWebMapperImpl::fromCategoryChambre)
      .collect(Collectors.toList());
  }

  @Override
  public CategoryChambreSaveOrUpdateDto findById(Long id) {
    CategorieChambre categorieChambre = categoryChambreRepository
      .findById(id)
      .orElse(null);
    if (categorieChambre != null) {
      return gestimoWebMapperImpl.fromCategoryChambre(categorieChambre);
    } else {
      return null;
    }
  }

  @Override
  public void delete(Long id) {
    CategorieChambre categorieChambre = categoryChambreRepository
      .findById(id)
      .orElse(null);
    if (categorieChambre != null) {
      categoryChambreRepository.delete(categorieChambre);
    } else {
      throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }
  }

  @Override
  public CategoryChambreSaveOrUpdateDto saveOrUpdate(
    CategoryChambreSaveOrUpdateDto dto
  ) {
    CategorieChambre categorieChambre = categoryChambreRepository
      .findById(dto.getId())
      .orElse(null);

    validator.validate(dto);
    if (categorieChambre != null) {
      categorieChambre.setDescription(dto.getDescription());
      categorieChambre.setName(dto.getName());

      categorieChambre.setIdAgence(dto.getIdAgence());
      categorieChambre.setIdCreateur(dto.getIdCreateur());

      CategorieChambre savCategorieChambre = categoryChambreRepository.save(
        categorieChambre
      );
      return gestimoWebMapperImpl.fromCategoryChambre(savCategorieChambre);
    } else {
      CategorieChambre newCategorieChambre = new CategorieChambre();
      newCategorieChambre.setDescription(dto.getDescription());
      newCategorieChambre.setName(dto.getName());

      newCategorieChambre.setIdCreateur(dto.getIdCreateur());
      newCategorieChambre.setIdAgence(dto.getIdAgence());

      CategorieChambre savCategorieChambre = categoryChambreRepository.save(
        newCategorieChambre
      );
      return gestimoWebMapperImpl.fromCategoryChambre(savCategorieChambre);
    }
  }

  @Override
  public CategoryChambreSaveOrUpdateDto saveOrUpdateCategoryChambre(
    CategoryChambreSaveOrUpdateDto dto
  ) {
    log.info("Info sur le dto est : {}", dto);
    CategorieChambre categorieChambre = categoryChambreRepository
      .findById(dto.getId())
      .orElse(null);
    if (categorieChambre != null) {
      categorieChambre.setDescription(dto.getDescription());
      categorieChambre.setName(dto.getName());
categorieChambre.setPourcentReduc(0L);
    categorieChambre.setPrice(0L);
    categorieChambre.setNbrDiffJour(0);
      categoryChambreRepository.save(categorieChambre);
      return gestimoWebMapperImpl.fromCategoryChambre(categorieChambre);
    }
    CategorieChambre newCategite = new CategorieChambre();
    newCategite.setIdCreateur(dto.getIdCreateur());
    newCategite.setIdAgence(dto.getIdAgence());
    newCategite.setDescription(dto.getDescription());
    newCategite.setName(dto.getName());
    newCategite.setPourcentReduc(0L);
    newCategite.setPrice(0L);
    newCategite.setNbrDiffJour(0);
    categoryChambreRepository.save(newCategite);
    return gestimoWebMapperImpl.fromCategoryChambre(newCategite);
  }

  @Override
  public List<CategoryChambreSaveOrUpdateDto> findAllCategorie(Long idAgnce) {
    return categoryChambreRepository
      .findAll()
      .stream()
      .filter(t -> t.getIdAgence() == idAgnce)
      .map(gestimoWebMapperImpl::fromCategoryChambre)
      .collect(Collectors.toList());
  }

  @Override
  public CategoryChambreSaveOrUpdateDto findCategorieByIdAppartement(
    Long idBien
  ) {
    List<CategoryChambreSaveOrUpdateDto> findCat = categoryChambreRepository
      .findAll()
      .stream()
      .filter(t -> t.getAppartements().get(0).getId() == idBien)
      .map(gestimoWebMapperImpl::fromCategoryChambre)
      .collect(Collectors.toList());
    if (findCat.size() > 0) {
      log.info("Info sur le dto est : {}", findCat);
      return findCat.get(0);
    }

    return null;
    //
  }
}
