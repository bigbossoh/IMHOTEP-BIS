package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.PrestationSaveOrUpdateDto;
import java.util.List;

public interface PrestaionService  extends AbstractService<PrestationSaveOrUpdateDto>{

  List<PrestationSaveOrUpdateDto> findAllByAgence(Long idAgence);
}
