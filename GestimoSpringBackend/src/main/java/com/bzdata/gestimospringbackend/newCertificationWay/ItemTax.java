package com.bzdata.gestimospringbackend.newCertificationWay;
import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "invoice_item_tax")
public class ItemTax {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceItemId;
    private String vatRateId;
    private Integer amount;

    @Column(columnDefinition = "TEXT")
    private String name;

    private String shortName;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_fk", nullable = false)
    private Item item;
}
