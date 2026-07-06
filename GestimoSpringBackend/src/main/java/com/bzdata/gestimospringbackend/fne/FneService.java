package com.bzdata.gestimospringbackend.fne;

import com.bzdata.gestimospringbackend.fne.config.FneProperties;
import com.bzdata.gestimospringbackend.fne.dto.FneRefundRequest;
import com.bzdata.gestimospringbackend.fne.dto.FneSignInvoiceRequest;
import com.bzdata.gestimospringbackend.fne.dto.FneSignInvoiceResponse;
import com.bzdata.gestimospringbackend.fne.exception.FneApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Client de la plateforme FNE (Facture Normalisée Electronique) de la DGI,
 * conforme à la "Procédure d'interfaçage des entreprises par API" (Mai
 * 2025) : certification de factures de vente / bordereaux d'achat via
 * POST {@code /external/invoices/sign}, et certification d'avoirs via
 * POST {@code /external/invoices/{id}/refund}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FneService {

  final FneProperties fneProperties;
  final ObjectMapper objectMapper;

  public FneSignInvoiceResponse signInvoice(FneSignInvoiceRequest request) {
    if (!fneProperties.isEnabled()) {
      log.info("Certification FNE desactivee (fne.enabled=false) : facture non certifiee.");
      return null;
    }

    return post(fneProperties.getBaseUrl() + fneProperties.getSignPath(), request);
  }

  public FneSignInvoiceResponse refundInvoice(
    String invoiceId,
    FneRefundRequest request
  ) {
    if (!fneProperties.isEnabled()) {
      log.info("Certification FNE desactivee (fne.enabled=false) : avoir non certifie.");
      return null;
    }

    String path = String.format(fneProperties.getRefundPathTemplate(), invoiceId);
    return post(fneProperties.getBaseUrl() + path, request);
  }

  private FneSignInvoiceResponse post(String url, Object body) {
    String payloadJson = toJsonForLog(body);
    log.info("Appel FNE : POST {}\nPayload envoye : {}", url, payloadJson);

    try {
      HttpURLConnection connection = openConnection(url);

      byte[] payload = objectMapper.writeValueAsBytes(body);
      try (OutputStream outputStream = connection.getOutputStream()) {
        outputStream.write(payload);
      }

      int status = connection.getResponseCode();
      String responseBody = readConnectionBody(connection);

      if (status < 200 || status >= 300) {
        log.warn(
          "Reponse FNE en erreur pour POST {} (statut={})\nPayload envoye : {}\nReponse recue : {}",
          url,
          status,
          payloadJson,
          responseBody
        );
        throw toApiException(status, responseBody);
      }

      return objectMapper.readValue(responseBody, FneSignInvoiceResponse.class);
    } catch (FneApiException e) {
      throw e;
    } catch (Exception e) {
      log.warn(
        "Echec technique de l'appel FNE POST {}\nPayload envoye : {}",
        url,
        payloadJson,
        e
      );
      throw new FneApiException("Echec de l'appel a la plateforme FNE (" + url + ")", e);
    }
  }

  private String toJsonForLog(Object body) {
    try {
      return objectMapper.writeValueAsString(body);
    } catch (Exception e) {
      return String.valueOf(body);
    }
  }

  private HttpURLConnection openConnection(String url) throws Exception {
    HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
    connection.setRequestMethod("POST");
    connection.setConnectTimeout(fneProperties.getConnectTimeoutMs());
    connection.setReadTimeout(fneProperties.getReadTimeoutMs());
    connection.setDoOutput(true);
    connection.setRequestProperty("Content-Type", "application/json");
    connection.setRequestProperty("Accept", "application/json");
    connection.setRequestProperty(
      "Authorization",
      "Bearer " + fneProperties.getBearerToken()
    );
    return connection;
  }

  private FneApiException toApiException(int status, String responseBody) {
    try {
      JsonNode json = objectMapper.readTree(responseBody);
      String message = json.path("message").asText("Erreur FNE (statut " + status + ")");
      String error = json.path("error").asText("fne_error");
      return new FneApiException(status, error, message);
    } catch (Exception parseError) {
      return new FneApiException(status, "fne_error", "Erreur FNE (statut " + status + ")");
    }
  }

  private String readConnectionBody(HttpURLConnection connection) {
    try {
      int status = connection.getResponseCode();
      InputStream stream = (status >= 200 && status < 300)
        ? connection.getInputStream()
        : connection.getErrorStream();

      if (stream == null) {
        return "";
      }

      return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
    } catch (Exception e) {
      return "";
    }
  }
}
