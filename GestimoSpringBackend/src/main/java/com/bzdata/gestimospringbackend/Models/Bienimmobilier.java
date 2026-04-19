package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.util.List;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "typeBienImmobilier", discriminatorType = DiscriminatorType.STRING)
public abstract class Bienimmobilier extends AbstractEntity {

    String codeAbrvBienImmobilier;
    String nomCompletBienImmobilier;
    String nomBaptiserBienImmobilier;
    String description;
    double superficieBien;
    boolean bienMeublerResidence;
    boolean isOccupied= false;
    @ManyToOne
    Utilisateur utilisateurProprietaire;
    int nombrePieceBien;
    @ManyToOne
    Chapitre chapitre;
    @OneToMany(mappedBy = "bienimmobilier")
    List<ImageData>imageDatas;
      @ManyToOne
    Site site;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getStatut() {
        return this.isOccupied ? "Occupé" : "Libre";
    }

}
