package com.bzdata.gestimospringbackend.repository;

import java.time.LocalDate;
import java.util.List;

import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EncaissementPrincipalRepository extends JpaRepository<EncaissementPrincipal, Long> {

    List<EncaissementPrincipal> findByAppelLoyerEncaissement(AppelLoyer object);

    // operationType = CREDIT car cette requete alimente le registre des recettes (encaissements) :
    // les lignes DEBIT de cette meme table representent des annulations/contre-passations.
    @Query("""
        select e from EncaissementPrincipal e
        join e.appelLoyerEncaissement al
        join al.bailLocationAppelLoyer bail
        join bail.bienImmobilierOperation bien
        where bien.site.id = :siteId
        and e.operationType = com.bzdata.gestimospringbackend.enumeration.OperationType.CREDIT
        and e.dateEncaissement between :debut and :fin
        order by e.dateEncaissement asc, e.id asc
        """)
    List<EncaissementPrincipal> findBySiteAndPeriode(
        @Param("siteId") Long siteId,
        @Param("debut") LocalDate debut,
        @Param("fin") LocalDate fin
    );
}
