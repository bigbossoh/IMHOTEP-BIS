package com.bzdata.gestimospringbackend.company.mapper;

import com.bzdata.gestimospringbackend.company.dto.request.AgenceRequestDto;
import com.bzdata.gestimospringbackend.company.dto.response.AgenceImmobilierDTO;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {

  public AgenceImmobilierDTO toResponse(AgenceImmobiliere entity) {
    if (entity == null) {
      return null;
    }
    AgenceImmobilierDTO response = new AgenceImmobilierDTO();
    BeanUtils.copyProperties(entity, response);
    return response;
  }

  public AgenceImmobiliere toEntity(AgenceRequestDto request) {
    if (request == null) {
      return null;
    }
    AgenceImmobiliere entity = new AgenceImmobiliere();
    BeanUtils.copyProperties(request, entity);
    return entity;
  }
}
