package com.bzdata.gestimospringbackend.Services;


import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.DroitAccesDTO;
import com.bzdata.gestimospringbackend.DTOs.DroitAccesPayloadDTO;

public interface DroitAccesService extends AbstractService<DroitAccesPayloadDTO> {
    List<DroitAccesDTO> findAllDroit() ;
    DroitAccesDTO findByDroitAccesDTOId(Long id);
}
