package com.bzdata.gestimospringbackend.repository;

import java.util.List;

import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MontantLoyerBailRepository extends JpaRepository<MontantLoyerBail, Long> {

    List<MontantLoyerBail> findByBailLocation(BailLocation bailLocation);
    @Query(value = "SELECT m FROM MontantLoyerBail m WHERE m.statusLoyer= true and m.bailLocation= ?1")
    List<MontantLoyerBail> findMontantLoyerBailbyStatusAndBailId( BailLocation bailLocation);
}
