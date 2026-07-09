package com.bzdata.gestimospringbackend.newCertificationWay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour les taxes d'un article, utilisé pour l'envoi à l'API FNE.
 * Différent de ItemTax qui est une entité JPA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItemTaxDto {
    private String name;
    private String shortName;
    private String vatRateId;
    private Integer amount;
}