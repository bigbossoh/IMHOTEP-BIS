package com.bzdata.gestimospringbackend.fne.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FneCustomTaxRequest {

  private String name;
  private double amount;
}
