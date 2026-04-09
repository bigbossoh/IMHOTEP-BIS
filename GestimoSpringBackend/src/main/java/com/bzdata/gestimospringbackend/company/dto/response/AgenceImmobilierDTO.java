package com.bzdata.gestimospringbackend.company.dto.response;

import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AgenceImmobilierDTO {
    Long id;
    String nomAgence;
    String telAgence;
    String compteContribuable;
    double capital;
    String emailAgence;
    String mobileAgence;
    String mobileAgenceSecondaire;
    String regimeFiscaleAgence;
    String faxAgence;
    String sigleAgence;
    Long idAgence;
    String profileAgenceUrl;
    String adresseAgence;
    String boitePostaleAgence;
    Long idImage;
    String nameImage;
    String typeImage;
    MultipartFile logoAgence;
}
