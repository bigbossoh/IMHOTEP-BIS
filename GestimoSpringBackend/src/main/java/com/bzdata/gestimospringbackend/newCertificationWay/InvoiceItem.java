package com.bzdata.gestimospringbackend.newCertificationWay;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InvoiceItem {
    private String reference;
    private String description;
    private int quantity;
    private double amount;
    private double discount;
    private String measurementUnit;
    private List<String> taxes;
    private List<CustomTaxe> customTaxes = List.of();
}