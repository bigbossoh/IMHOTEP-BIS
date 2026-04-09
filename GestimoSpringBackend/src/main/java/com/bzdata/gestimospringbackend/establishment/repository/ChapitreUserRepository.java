package com.bzdata.gestimospringbackend.establishment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;

public interface ChapitreUserRepository extends JpaRepository<EtablissementUtilisateur,Long>{
    
}
