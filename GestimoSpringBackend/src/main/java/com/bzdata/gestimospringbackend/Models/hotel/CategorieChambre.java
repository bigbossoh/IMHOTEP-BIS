package com.bzdata.gestimospringbackend.Models.hotel;

import com.bzdata.gestimospringbackend.Models.AbstractEntity;
import com.bzdata.gestimospringbackend.Models.Appartement;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
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
public class CategorieChambre extends AbstractEntity {

  String description;
  String name;

  double price;
  int nbrDiffJour;
  double pourcentReduc;

  @OneToMany
  @JoinColumn(name = "categorieChambreAppartement")
  List<Appartement> appartements;

  @OneToMany
  @JoinColumn(name = "categorieChambrePrix")
  List<PrixParCategorieChambre> prixGategories;
}
