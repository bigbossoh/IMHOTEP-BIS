package com.bzdata.gestimospringbackend.fne;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FneFactureCertificationRepository
  extends JpaRepository<FneFactureCertification, Long> {

  List<FneFactureCertification> findAllByIdAgenceOrderByCreationDateDesc(
    Long idAgence
  );
}
