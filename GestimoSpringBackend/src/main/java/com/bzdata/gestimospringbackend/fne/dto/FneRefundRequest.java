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
public class FneRefundRequest {

  private List<FneRefundItemRequest> items;
}
