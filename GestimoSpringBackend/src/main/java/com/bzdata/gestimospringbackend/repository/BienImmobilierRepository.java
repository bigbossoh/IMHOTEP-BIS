package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.Bienimmobilier;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BienImmobilierRepository extends JpaRepository<Bienimmobilier, Long> {

}
