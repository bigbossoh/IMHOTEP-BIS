package com.bzdata.gestimospringbackend.repository;

import java.util.List;
import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.Commune;
import com.bzdata.gestimospringbackend.Models.Quartier;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuartierRepository extends JpaRepository<Quartier, Long> {

    Optional<Quartier> findByNomQuartier(String nom);

    List<Quartier> findByCommune(Commune entity);

}
