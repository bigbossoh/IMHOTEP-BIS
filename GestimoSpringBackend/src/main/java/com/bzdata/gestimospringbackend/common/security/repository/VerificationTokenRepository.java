package com.bzdata.gestimospringbackend.common.security.repository;

import com.bzdata.gestimospringbackend.common.security.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken,Long> {
    Optional<VerificationToken> findByToken(String token);
}
