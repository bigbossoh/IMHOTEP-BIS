package com.bzdata.gestimospringbackend.DTOs;

import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SuivieDepenseEncaissementDto {
   
   Long idAgence;
   LocalDate dateEncaissement;
   String designation;
   String codeTransaction;
   
   
}
