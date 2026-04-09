package com.bzdata.gestimospringbackend.audit.repository;

import com.bzdata.gestimospringbackend.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByIdAgenceOrderByIdDesc(Long idAgence);

    Optional<AuditLog> findFirstByIdAgenceOrderByIdDesc(Long idAgence);

    long countByIdAgence(Long idAgence);

    @Query("select avg(a.durationMs) from AuditLog a where a.idAgence = :idAgence and a.durationMs is not null")
    Double findAverageDurationMsByIdAgence(@Param("idAgence") Long idAgence);

    void deleteAllByIdAgence(Long idAgence);
}
