package com.bzdata.gestimospringbackend.fne.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Réponse de succès (HTTP 200) de {@code /external/invoices/sign}. Seuls les
 * champs utiles à l'affichage/traçabilité de la facture sont mappés ; le
 * détail complet de l'objet {@code invoice} n'est pas exploité ici.
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FneSignInvoiceResponse {

  private String ncc;
  private String reference;
  private String token;
  private boolean warning;

  @JsonProperty("balance_sticker")
  private Integer balanceSticker;
}
