package com.bzdata.gestimospringbackend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.Models.SuivieDepense;

public interface SuivieDepenseRepository extends JpaRepository<SuivieDepense, Long> {

    Optional<SuivieDepense> findByCodeTransaction(String codeTransation);
    Optional<SuivieDepense> findByReferenceDepenseIgnoreCaseAndIdAgence(String referenceDepense, Long idAgence);
    List<SuivieDepense> findAllByIdAgenceOrderByIdDesc(Long idAgence);
    List<SuivieDepense> findAllByIdAgenceAndDateEncaissementBetweenOrderByIdDesc(Long idAgence, LocalDate debut, LocalDate fin);
}
