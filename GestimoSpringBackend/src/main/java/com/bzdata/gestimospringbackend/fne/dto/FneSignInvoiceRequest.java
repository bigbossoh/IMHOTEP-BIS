package com.bzdata.gestimospringbackend.fne.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Corps de la requête POST {@code $url/external/invoices/sign} tel que décrit
 * dans la procédure d'interfaçage FNE (API #1 vente / API #3 bordereau
 * d'achat) : seul le champ {@code invoiceType} distingue les deux usages.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FneSignInvoiceRequest {

  private String invoiceType;
  private String paymentMethod;
  private String template;

  @JsonProperty("isRne")
  private boolean linkedToRne;

  private String rne;
  private String clientNcc;
  private String clientCompanyName;
  private String clientPhone;
  private String clientEmail;
  private String clientSellerName;
  private String pointOfSale;
  private String establishment;
  private String commercialMessage;
  private String footer;
  private String foreignCurrency;
  private Double foreignCurrencyRate;
  private List<FneInvoiceItemRequest> items;
  private List<FneCustomTaxRequest> customTaxes;
  private double discount;
}
