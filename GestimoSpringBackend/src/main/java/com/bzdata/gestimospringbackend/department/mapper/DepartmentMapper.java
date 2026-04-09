package com.bzdata.gestimospringbackend.department.mapper;

import com.bzdata.gestimospringbackend.department.dto.request.DepartmentRequestDto;
import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

  public Chapitre toEntity(DepartmentRequestDto requestDto) {
    if (requestDto == null) {
      return null;
    }
    Chapitre chapitre = new Chapitre();
    chapitre.setId(requestDto.getId());
    chapitre.setLibelleChapitre(requestDto.getLibelle());
    return chapitre;
  }

  public DepartmentResponseDto toResponse(Chapitre chapitre) {
    if (chapitre == null) {
      return null;
    }
    return new DepartmentResponseDto(chapitre.getId(), chapitre.getLibelleChapitre());
  }
}
