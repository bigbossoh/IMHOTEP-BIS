package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.Magasin;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MagasinRepository extends JpaRepository<Magasin, Long> {
    Magasin findMagasinByCodeAbrvBienImmobilier(String abrvBienimmobilier);

    Magasin findMagasinByNomCompletBienImmobilier(String nomBien);
}
