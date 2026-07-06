package com.bzdata.gestimospringbackend.newCertificationWay;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "invoice_custom_tax")
public class InvoiceCertifierCustomTax {

    @Id
    @Column(length = 36)
    private String id;

    private String invoiceId;
    private Integer amount;

    @Column(columnDefinition = "TEXT")
    private String name;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_fk", nullable = false)
    private InvoiceFneCertify invoice;
}
