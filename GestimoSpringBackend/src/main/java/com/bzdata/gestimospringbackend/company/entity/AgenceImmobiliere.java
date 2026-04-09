package com.bzdata.gestimospringbackend.company.entity;

import com.bzdata.gestimospringbackend.Models.AbstractEntity;
import com.bzdata.gestimospringbackend.Models.ImageModel;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AgenceImmobiliere extends AbstractEntity {
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
    String adresseAgence;
    String boitePostaleAgence;

    @OneToMany(mappedBy = "logoAgence")
    List<ImageModel> imageModels;

}
