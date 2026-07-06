package com.bzdata.gestimospringbackend.newCertificationWay;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter @Setter
@ConfigurationProperties(prefix = "invoice.api")
public class InvoiceApiProperties {
    private String baseUrl;
    private String signPath;
    private String token;
}
