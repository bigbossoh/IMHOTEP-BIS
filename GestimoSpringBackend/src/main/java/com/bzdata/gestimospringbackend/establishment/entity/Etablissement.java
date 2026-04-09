package com.bzdata.gestimospringbackend.establishment.entity;

import com.bzdata.gestimospringbackend.Models.AbstractEntity;
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
public class Etablissement extends AbstractEntity {
  Long idChapitre;
  String libChapitre;
  @OneToMany(mappedBy = "etabl")
  List<EtablissementUtilisateur> chapitreUsers;
}
