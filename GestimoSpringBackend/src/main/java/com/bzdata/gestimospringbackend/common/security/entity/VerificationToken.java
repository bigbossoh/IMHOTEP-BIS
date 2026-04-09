package com.bzdata.gestimospringbackend.common.security.entity;

import com.bzdata.gestimospringbackend.Models.AbstractEntity;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@EqualsAndHashCode(callSuper = false)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="token")
public class VerificationToken extends AbstractEntity {

    private String token;
    private Instant expiryDate;
    @OneToOne(fetch = FetchType.LAZY)
    private Utilisateur utilisateur;
}
