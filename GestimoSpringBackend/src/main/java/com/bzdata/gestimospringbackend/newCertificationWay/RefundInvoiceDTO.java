package com.bzdata.gestimospringbackend.newCertificationWay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class RefundInvoiceDTO {
    // Recu du frontend pour construire l'URL /external/invoices/{id}/refund,
    // mais absent du corps JSON envoye a l'API FNE (qui n'attend que "items").
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String invoiceId;
    private List<RefundItemDTO> items;
}
