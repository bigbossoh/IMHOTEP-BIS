package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "token")
public class TokenVerification extends AbstractEntity{    
    private String token;
    private Instant expiryDate;
    @OneToOne(fetch = FetchType.LAZY)
    private Utilisateur utilisateur;
       
}
