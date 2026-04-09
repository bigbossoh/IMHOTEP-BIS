package com.bzdata.gestimospringbackend.repository;

import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.Pays;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {
    Optional<Pays> findByAbrvPays(String string);

    Optional<Pays> findByNomPays(String nom);

}
