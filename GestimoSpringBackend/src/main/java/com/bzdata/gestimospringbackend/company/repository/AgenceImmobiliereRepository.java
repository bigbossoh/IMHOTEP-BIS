package com.bzdata.gestimospringbackend.company.repository;

import java.util.List;
import java.util.Optional;

import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AgenceImmobiliereRepository extends JpaRepository<AgenceImmobiliere, Long> {

    Optional<AgenceImmobiliere> findAgenceImmobiliereByEmailAgence(String email);

    @Query(value = "SELECT agence FROM AgenceImmobiliere agence,Utilisateur ut WHERE agence.id=ut.idAgence ")
    List<AgenceImmobiliere> findAllAgenceImmo();

    // @Query(value = "SELECT agen FROM AgenceImmobiliere agen")
    // List<AgenceImmobiliere> findAllByOrderByNomAgenceQuery();
}
