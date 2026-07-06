package com.bzdata.gestimospringbackend.newCertificationWay;

import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "invoice_item")
public class Item {

    @Id
    @Column(length = 36)
    private String id;

    private Integer quantity;
    private String reference;
    private String description;

    private Long amount;
    private Integer discount;

    private String measurementUnit;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    private String invoiceId;
    private String parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_fk", nullable = false)
    private InvoiceFneCertify invoice;

    @OneToMany(mappedBy = "item")
    private List<ItemTax> taxes = new ArrayList<>();

    @OneToMany(mappedBy = "item")
    private List<ItemCustomTax> customTaxes = new ArrayList<>();
}

