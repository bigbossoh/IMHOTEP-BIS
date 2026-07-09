package com.bzdata.gestimospringbackend.fne.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration de l'interfaçage avec la plateforme FNE (Facture Normalisée
 * Electronique) de la DGI. base-url et bearer-token sont définis par profil
 * (application-dev.yml pour l'environnement de test, application-prod.yml
 * pour la production) car la DGI fournit une URL et une clé API différentes
 * pour chaque environnement.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "fne")
public class FneProperties {

  private String baseUrl;
  private String signPath = "/external/invoices/sign";
  private String refundPathTemplate = "/external/invoices/%s/refund";
  private String bearerToken;
  private int connectTimeoutMs = 10000;
  private int readTimeoutMs = 15000;
private String defaultTaxe = "TVAC";
  private boolean enabled = true;
}
