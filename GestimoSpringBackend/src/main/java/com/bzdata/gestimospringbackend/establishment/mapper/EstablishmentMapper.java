package com.bzdata.gestimospringbackend.establishment.mapper;

import com.bzdata.gestimospringbackend.establishment.dto.request.EstablishmentRequestDto;
import com.bzdata.gestimospringbackend.establishment.dto.response.EstablishmentResponseDto;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class EstablishmentMapper {

  public Etablissement toEntity(EstablishmentRequestDto requestDto) {
    if (requestDto == null) {
      return null;
    }
    Etablissement entity = new Etablissement();
    entity.setId(requestDto.getId());
    entity.setIdAgence(requestDto.getIdAgence());
    entity.setIdCreateur(requestDto.getIdCreateur());
    entity.setIdChapitre(requestDto.getIdChapitre());
    entity.setLibChapitre(requestDto.getLibChapitre());
    return entity;
  }

  public EstablishmentResponseDto toResponse(
    Etablissement entity,
    List<EtablissementUtilisateur> users
  ) {
    if (entity == null) {
      return null;
    }
    List<Long> userIds = users == null
      ? List.of()
      : users
        .stream()
        .map(aff -> aff.getUtilisateurEtabl().getId())
        .collect(Collectors.toList());

    return new EstablishmentResponseDto(
      entity.getId(),
      entity.getIdAgence(),
      entity.getIdCreateur(),
      entity.getIdChapitre(),
      entity.getLibChapitre(),
      userIds
    );
  }
}
