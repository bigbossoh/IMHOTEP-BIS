package com.bzdata.gestimospringbackend.repository;

import java.util.List;
import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.Etage;
import com.bzdata.gestimospringbackend.Models.Immeuble;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EtageRepository extends JpaRepository<Etage, Long> {

    Optional<Etage> findByNomCompletEtage(String nom);

    List<Etage> findByImmeuble(Immeuble entity);

}
