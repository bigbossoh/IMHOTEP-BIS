package com.bzdata.gestimospringbackend.repository;

import java.util.Optional;

import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.Models.ImageModel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageModel, Long> {

    Optional<ImageModel> findByLogoAgence(AgenceImmobiliere agenceImmobiliere);

    Optional<ImageModel> findByName(String name);

}
