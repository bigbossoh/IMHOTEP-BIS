package com.bzdata.gestimospringbackend.repository;

import java.util.List;
import java.util.Optional;

import com.bzdata.gestimospringbackend.DTOs.VilleDto;
import com.bzdata.gestimospringbackend.Models.Commune;
import com.bzdata.gestimospringbackend.Models.Ville;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommuneRepository extends JpaRepository<Commune, Long> {

    Optional<Commune> findByNomCommune(String nom);

    List<Commune> findByVille(Ville ville);

    List<Commune> findByVille(VilleDto villeDto);
}
