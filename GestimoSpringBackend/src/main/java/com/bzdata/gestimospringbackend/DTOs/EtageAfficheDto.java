package com.bzdata.gestimospringbackend.DTOs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EtageAfficheDto {
    Long id;
    String nomEtage;
    String AbrvEtage;
    int numEtage;
    String nomImmeuble;
    String nomPropio;
    String prenomProprio;
}
