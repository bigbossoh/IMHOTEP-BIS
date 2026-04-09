package com.bzdata.gestimospringbackend.department.service.impl;

import com.bzdata.gestimospringbackend.department.dto.request.DepartmentRequestDto;
import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.department.mapper.DepartmentMapper;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.department.service.DepartmentService;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

  private final ChapitreRepository chapitreRepository;
  private final DepartmentMapper departmentMapper;

  @Override
  public DepartmentResponseDto create(DepartmentRequestDto requestDto) {
    Chapitre chapitre = departmentMapper.toEntity(requestDto);
    return departmentMapper.toResponse(chapitreRepository.save(chapitre));
  }

  @Override
  public DepartmentResponseDto update(Long id, DepartmentRequestDto requestDto) {
    Chapitre chapitre = chapitreRepository
      .findById(id)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun departement trouve avec l'id " + id,
          ErrorCodes.SITE_NOT_FOUND
        )
      );
    chapitre.setLibelleChapitre(requestDto.getLibelle());
    return departmentMapper.toResponse(chapitreRepository.save(chapitre));
  }

  @Override
  public DepartmentResponseDto getById(Long id) {
    Chapitre chapitre = chapitreRepository
      .findById(id)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun departement trouve avec l'id " + id,
          ErrorCodes.SITE_NOT_FOUND
        )
      );
    return departmentMapper.toResponse(chapitre);
  }

  @Override
  public List<DepartmentResponseDto> getAll() {
    return chapitreRepository
      .findAll()
      .stream()
      .map(departmentMapper::toResponse)
      .toList();
  }

  @Override
  public void delete(Long id) {
    if (!chapitreRepository.existsById(id)) {
      throw new InvalidEntityException(
        "Aucun departement trouve avec l'id " + id,
        ErrorCodes.SITE_NOT_FOUND
      );
    }
    chapitreRepository.deleteById(id);
  }
}
