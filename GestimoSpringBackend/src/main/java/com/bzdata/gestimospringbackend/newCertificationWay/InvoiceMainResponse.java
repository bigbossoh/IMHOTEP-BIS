package com.bzdata.gestimospringbackend.newCertificationWay;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "invoice_main_response")
public class InvoiceMainResponse {

    @Id
    @Column(length = 60) // tu peux ajuster
    private String reference; // le plus simple: utiliser reference comme PK

    private String ncc;

    @Column(length = 500)
    private String token;

    private boolean warning;

    // JSON = balance_funds -> on le mappe vers balanceSticker
    @JsonProperty("balance_funds")
    private Integer balanceFunds;

    @OneToOne(orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id_fk")
    private InvoiceFneCertify invoice;
}

