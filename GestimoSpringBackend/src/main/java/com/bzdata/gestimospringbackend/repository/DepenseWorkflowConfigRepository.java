package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.DepenseWorkflowConfig;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepenseWorkflowConfigRepository extends JpaRepository<DepenseWorkflowConfig, Long> {
  Optional<DepenseWorkflowConfig> findFirstByIdAgenceOrderByIdDesc(Long idAgence);
}
