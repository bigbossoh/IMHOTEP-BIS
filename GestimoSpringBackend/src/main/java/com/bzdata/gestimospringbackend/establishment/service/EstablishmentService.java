package com.bzdata.gestimospringbackend.establishment.service;

import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import com.bzdata.gestimospringbackend.establishment.dto.request.EstablishmentRequestDto;
import com.bzdata.gestimospringbackend.establishment.dto.response.EstablishmentResponseDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import java.util.List;

public interface EstablishmentService {
  EstablishmentResponseDto create(EstablishmentRequestDto requestDto);

  EstablishmentResponseDto update(Long id, EstablishmentRequestDto requestDto);

  EstablishmentResponseDto getById(Long id);

  List<EstablishmentResponseDto> getAll();

  void delete(Long id);

  List<UtilisateurAfficheDto> listUsersByEstablishment(Long idEtablissement);

  List<DepartmentResponseDto> listDepartmentsByEstablishment(Long idEtablissement);
}
