package com.bzdata.gestimospringbackend.repository;

import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.BailLocation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BailLocationRepository extends JpaRepository<BailLocation, Long> {

    Optional<BailLocation> findByDesignationBail(String nom);

}
