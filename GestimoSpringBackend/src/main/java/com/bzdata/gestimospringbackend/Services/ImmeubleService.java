package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.ImmeubleDto;
import com.bzdata.gestimospringbackend.DTOs.ImmeubleEtageDto;

public interface ImmeubleService {



  ImmeubleEtageDto saveImmeubleEtageDto(ImmeubleEtageDto dto);

  ImmeubleDto updateImmeuble(ImmeubleDto dto);


  boolean delete(Long id);

  List<ImmeubleDto> findAll(Long idAgence);

  List<ImmeubleEtageDto> findAllPourAffichageImmeuble(Long idAgence);

  ImmeubleDto findById(Long id);

  ImmeubleDto findByName(String nom);

  List<ImmeubleDto> findAllByIdSite(Long id);
}
