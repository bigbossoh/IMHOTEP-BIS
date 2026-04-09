package com.bzdata.gestimospringbackend.establishment.service;

import com.bzdata.gestimospringbackend.Services.AbstractService;
import com.bzdata.gestimospringbackend.establishment.dto.response.EtablissementUtilisateurDto;

public interface EtablissementUtilsateurService
  extends AbstractService<EtablissementUtilisateurDto> {
  EtablissementUtilisateurDto saveorUpdateChapitreUser(
    EtablissementUtilisateurDto dto
  );
  EtablissementUtilisateurDto findDefaultChapitreUserByIdUser(Long idUser);
}
