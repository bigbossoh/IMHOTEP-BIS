package com.bzdata.gestimospringbackend.newCertificationWay;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.OffsetDateTime;
import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "invoice_item_custom_tax")
public class ItemCustomTax {

    @Id
    @Column(length = 36)
    private String id;

    private String invoiceItemId;
    private Integer amount;

    @Column(columnDefinition = "TEXT")
    private String name;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_fk", nullable = false)
    private Item item;
}

