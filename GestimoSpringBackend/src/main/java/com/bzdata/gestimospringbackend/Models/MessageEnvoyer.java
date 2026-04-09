package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MessageEnvoyer extends AbstractEntity {
    Long idDestinaire;
    String nomDestinaire;
    String textMessage;
    boolean envoer;
    String typeMessage;
    String login;
}
