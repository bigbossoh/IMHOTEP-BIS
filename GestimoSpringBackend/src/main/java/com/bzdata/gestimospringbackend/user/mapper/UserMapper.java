package com.bzdata.gestimospringbackend.user.mapper;

import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public UtilisateurAfficheDto toResponse(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return null;
    }
    UtilisateurAfficheDto dto = new UtilisateurAfficheDto();
    BeanUtils.copyProperties(utilisateur, dto);
    return dto;
  }

  public Utilisateur toEntity(UtilisateurRequestDto requestDto) {
    if (requestDto == null) {
      return null;
    }
    Utilisateur utilisateur = new Utilisateur();
    BeanUtils.copyProperties(requestDto, utilisateur);
    return utilisateur;
  }
}
