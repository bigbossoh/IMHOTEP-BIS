package com.bzdata.gestimospringbackend.fne.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FneInvoiceItemRequest {

  private List<String> taxes;
  private List<FneCustomTaxRequest> customTaxes;
  private String reference;
  private String description;
  private double quantity;
  private double amount;
  private double discount;
  private String measurementUnit;
}
