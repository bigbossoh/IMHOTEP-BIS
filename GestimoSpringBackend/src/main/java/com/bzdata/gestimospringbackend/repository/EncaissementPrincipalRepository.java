package com.bzdata.gestimospringbackend.repository;

import java.util.List;

import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncaissementPrincipalRepository extends JpaRepository<EncaissementPrincipal, Long> {

    List<EncaissementPrincipal> findByAppelLoyerEncaissement(AppelLoyer object);
}
