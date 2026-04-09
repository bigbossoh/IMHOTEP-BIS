package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.OperationDto;

public interface OperationService {
    List<OperationDto> getAllOperation(Long idAgence);
     List<OperationDto>getAllOperationByLocataire(Long id);

     List<OperationDto> getAllOperationByBienImmobilier(Long id);


}
