package com.bzdata.gestimospringbackend.newCertificationWay;

import java.time.OffsetDateTime;
import java.util.List;

import lombok.Data;

@Data
public class InvoiceFneCertifyDto {
    private String invoiceType;
    private String id;
    private String numeroFactureInterne;
    private String utilisateurCreateur;

    private String reference;
    private OffsetDateTime date;

    private Long totalTTC;
    private  Long totalHorsTaxes;
    private Long totalTaxes;
    private Integer balanceFunds;
    private Integer discount;

    private String token;
    private List<ItemDto> items;
}
