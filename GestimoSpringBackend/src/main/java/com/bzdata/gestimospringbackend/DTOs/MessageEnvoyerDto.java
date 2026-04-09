package com.bzdata.gestimospringbackend.DTOs;

import java.time.Instant;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageEnvoyerDto {
    Long idDestinaire;
    Instant dateEnvoi;
    String destinaireNomPrenom;
    String login;
    String textMessage;
    boolean envoer;
    String typeMessage;

}
