package com.bzdata.gestimospringbackend.newCertificationWay;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration pour l'API de certification FNE (Facture Normalisée Electronique) de la DGI.
 * base-url et token sont definis par profil (application-dev.yml / application-prod.yml).
 */
@Getter @Setter
@ConfigurationProperties(prefix = "invoice.api")
public class InvoiceApiProperties {
    private String baseUrl;
    private String signPath = "/external/invoices/sign";
    private String token;
    /** Indique si l'API de certification est activee. Par defaut true. */
    private boolean enabled = true;
}