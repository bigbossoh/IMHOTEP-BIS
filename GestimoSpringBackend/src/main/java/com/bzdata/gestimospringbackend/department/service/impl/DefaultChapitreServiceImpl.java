package com.bzdata.gestimospringbackend.department.service.impl;

import com.bzdata.gestimospringbackend.department.dto.response.DefaultChapitreDto;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.department.service.DefaultChapitreService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DefaultChapitreServiceImpl implements DefaultChapitreService {

  final EtablissementRepository defaultChapitreRepository;
  final ChapitreRepository chapitreRepository;
  final GestimoWebMapperImpl gestimoWebMapperImpl;

  @Override
  public Long save(DefaultChapitreDto dto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'save'");
  }

  @Override
  public List<DefaultChapitreDto> findAll() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'findAll'");
  }

  @Override
  public DefaultChapitreDto findById(Long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'findById'");
  }

  @Override
  public void delete(Long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'delete'");
  }

  @Override
  public DefaultChapitreDto saveOrUpdate(DefaultChapitreDto dto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException(
      "Unimplemented method 'saveOrUpdate'"
    );
  }

  @Override
  public DefaultChapitreDto saveOrUpDefaultChapitre(DefaultChapitreDto dto) {
    Chapitre chapitre = chapitreRepository .findById(dto.getIdChapite()).orElse(null);

    if (chapitre != null) {
      Etablissement defaultChapitre = new Etablissement();
    defaultChapitre.setIdChapitre(dto.getIdChapite());
    defaultChapitre.setLibChapitre(dto.getLibChapitre());
  Etablissement defaultChapitreSave=  defaultChapitreRepository.save(defaultChapitre);
      return gestimoWebMapperImpl.fromDefaultChapitre(defaultChapitreSave);
    }
    return null;
  }
}
