package com.bzdata.gestimospringbackend.repository;

import java.util.List;

import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppelLoyerRepository extends JpaRepository<AppelLoyer, Long> {

    List<AppelLoyer> findAllByBailLocationAppelLoyer(BailLocation bailLocation);

    @Query("select sum(soldeAppelLoyer) from AppelLoyer where periodeAppelLoyer=:periode ")
    double impayerParMois(@Param("periode") String periode);

    @Query("select sum(montantLoyerBailLPeriode)-sum(soldeAppelLoyer) from AppelLoyer where periodeAppelLoyer=:periode ")
    double payeParMois(@Param("periode") String periode);

    @Query("select sum(soldeAppelLoyer) from AppelLoyer where anneeAppelLoyer=:annee")
    double impayerParAnnee(@Param("annee") int periode);

    @Query("select sum(montantLoyerBailLPeriode)-sum(soldeAppelLoyer) from AppelLoyer where anneeAppelLoyer=:annee  ")
    double payeParAnnee(@Param("annee") int periode);

    @Query("select a from AppelLoyer as a where periodeAppelLoyer=:periode  ")
    AppelLoyer findByPeriodeAppelLoyer(@Param("periode") String periode);

    AppelLoyer findByPeriodeAppelLoyerAndIdAgence(String periode, Long idAgence);
}
