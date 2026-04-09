package com.bzdata.gestimospringbackend.repository;

import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.Site;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, Long> {

    Optional<Site> findByNomSite(String nom);

}
