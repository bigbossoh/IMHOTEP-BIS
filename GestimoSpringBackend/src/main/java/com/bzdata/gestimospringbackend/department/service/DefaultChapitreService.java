package com.bzdata.gestimospringbackend.department.service;

import com.bzdata.gestimospringbackend.Services.AbstractService;
import com.bzdata.gestimospringbackend.department.dto.response.DefaultChapitreDto;

public interface DefaultChapitreService
  extends AbstractService<DefaultChapitreDto> {
  DefaultChapitreDto saveOrUpDefaultChapitre(DefaultChapitreDto dto);
   
}
