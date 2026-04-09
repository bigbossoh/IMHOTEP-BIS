package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("cheque")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChequeEncaissement extends Encaissement {
    String numeroCheque;
}
