package com.bzdata.gestimospringbackend.repository;

import java.util.List;
import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.Etage;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppartementRepository extends JpaRepository<Appartement, Long> {
    Optional<Appartement> findByNomCompletBienImmobilier(String nom);
    List<Appartement> findByEtageAppartement(Etage entity);

}
