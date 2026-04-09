package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter

@Entity
@DiscriminatorValue("espece")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EspeceEncaissement extends Encaissement {

}
