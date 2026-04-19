package com.bzdata.gestimospringbackend.Models.hotel;

import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import com.bzdata.gestimospringbackend.Models.Operation;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
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
@DiscriminatorValue("Reservation")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Reservation extends Operation {

  double montantDeReservation;
  double pourcentageReduction;
  double montantReduction;
  double soldReservation;
  double montantPaye;
  int nmbreAdulte;
  int nmbrEnfant;
  String statutReservation;
  @OneToMany(mappedBy = "reservation")
  List<PrestationAdditionnelReservation> serviceAdditionnelreservations;

  @OneToMany(mappedBy="reservation")
  List<EncaissementReservation> encaisssementsreservation;
}
