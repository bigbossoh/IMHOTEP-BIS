package com.bzdata.gestimospringbackend.establishment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;

public interface EtablissementRepository extends JpaRepository<Etablissement,Long>{
    
}
