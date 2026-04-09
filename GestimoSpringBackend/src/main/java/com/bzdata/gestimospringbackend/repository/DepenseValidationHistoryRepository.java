package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.DepenseValidationHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepenseValidationHistoryRepository extends JpaRepository<DepenseValidationHistory, Long> {
  List<DepenseValidationHistory> findAllBySuivieDepenseIdOrderByActionAtAsc(Long suivieDepenseId);

  List<DepenseValidationHistory> findAllBySuivieDepenseIdInOrderByActionAtAsc(List<Long> suivieDepenseIds);
}
