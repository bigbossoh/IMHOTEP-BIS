package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.CronMail;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CronMailRepository extends JpaRepository<CronMail, Long> {
  Optional<CronMail> findTopByIdAgenceOrderByIdDesc(Long idAgence);

  List<CronMail> findAllByEnabledTrueOrderByIdDesc();
}
