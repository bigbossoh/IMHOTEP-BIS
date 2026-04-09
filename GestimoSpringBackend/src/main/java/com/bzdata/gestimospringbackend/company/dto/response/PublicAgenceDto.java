package com.bzdata.gestimospringbackend.company.dto.response;

import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublicAgenceDto {

  Long id;
  Long idAgence;
  String nomAgence;
  String sigleAgence;
  String telAgence;
  String mobileAgence;
  String mobileAgenceSecondaire;
  String emailAgence;
  String adresseAgence;
  String boitePostaleAgence;

  public static PublicAgenceDto fromEntity(AgenceImmobiliere agence) {
    if (agence == null) {
      return null;
    }

    return PublicAgenceDto
      .builder()
      .id(agence.getId())
      .idAgence(agence.getIdAgence())
      .nomAgence(agence.getNomAgence())
      .sigleAgence(agence.getSigleAgence())
      .telAgence(agence.getTelAgence())
      .mobileAgence(agence.getMobileAgence())
      .mobileAgenceSecondaire(agence.getMobileAgenceSecondaire())
      .emailAgence(agence.getEmailAgence())
      .adresseAgence(agence.getAdresseAgence())
      .boitePostaleAgence(agence.getBoitePostaleAgence())
      .build();
  }
}
