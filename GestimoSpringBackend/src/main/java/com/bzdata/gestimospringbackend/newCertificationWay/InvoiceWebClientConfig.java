package com.bzdata.gestimospringbackend.newCertificationWay;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableConfigurationProperties(InvoiceApiProperties.class)
public class InvoiceWebClientConfig {

    @Bean
    public WebClient invoiceWebClient(InvoiceApiProperties props) {
        return WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .build();
    }
}
