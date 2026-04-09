package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.EspeceEncaissement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspeceEncaissementRepository extends JpaRepository<EspeceEncaissement, Long> {

}
