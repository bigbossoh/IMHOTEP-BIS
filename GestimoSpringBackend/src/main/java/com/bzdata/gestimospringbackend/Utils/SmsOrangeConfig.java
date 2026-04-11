package com.bzdata.gestimospringbackend.Utils;

import com.bzdata.gestimospringbackend.Models.MessageEnvoyer;
import com.bzdata.gestimospringbackend.Services.MessageEnvoyerService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SmsOrangeConfig {

  final MessageEnvoyerService messageEnvoyerService;
  final ObjectMapper objectMapper;

  @Value("${app.sms.orange.enabled:false}")
  boolean enabled;

  @Value("${app.sms.orange.client-id:}")
  String clientId;

  @Value("${app.sms.orange.client-secret:}")
  String clientSecret;

  @Value("${app.sms.orange.token-url:https://api.orange.com/oauth/v3/token}")
  String tokenUrl;

  @Value("${app.sms.orange.send-url-template:https://api.orange.com/smsmessaging/v1/outbound/tel:%s/requests}")
  String sendUrlTemplate;

  @Value("${app.sms.orange.default-sender:}")
  String defaultSender;

  @Value("${app.sms.orange.country-prefix:+225}")
  String countryPrefix;

  @Value("${app.sms.orange.connect-timeout-ms:10000}")
  int connectTimeoutMs;

  @Value("${app.sms.orange.read-timeout-ms:10000}")
  int readTimeoutMs;

  @Value("${app.sms.orange.persist-messages:true}")
  boolean persistMessages;

  public boolean sendSms(
    String accessToken,
    String sms,
    String telEnvoi,
    String telRecepteur,
    String nomSociete
  ) throws Exception {
    if (!enabled) {
      log.debug("SMS Orange desactive (app.sms.orange.enabled=false).");
      persistMessageIfEnabled(
        telRecepteur,
        nomSociete,
        sms,
        false,
        "SMS_ORANGE_DISABLED"
      );
      return false;
    }

    String sender = normalizePhoneNumber(
      (telEnvoi != null && !telEnvoi.isBlank()) ? telEnvoi : defaultSender
    );
    String recipient = normalizePhoneNumber(telRecepteur);

    if (recipient == null || recipient.isBlank()) {
      log.warn(
        "SMS Orange: numero destinataire manquant/invalid: '{}'",
        telRecepteur
      );
      persistMessageIfEnabled(
        telRecepteur,
        nomSociete,
        sms,
        false,
        "SMS_ORANGE_INVALID_RECIPIENT"
      );
      return false;
    }

    if (sender == null || sender.isBlank()) {
      log.warn("SMS Orange: numero emetteur manquant/invalid: '{}'", telEnvoi);
      persistMessageIfEnabled(
        telRecepteur,
        nomSociete,
        sms,
        false,
        "SMS_ORANGE_INVALID_SENDER"
      );
      return false;
    }

    String token = accessToken;
    if (token == null || token.isBlank()) {
      token = getTokenSmsOrange();
    }

    if (token == null || token.isBlank()) {
      log.warn("SMS Orange: token d'acces introuvable.");
      persistMessageIfEnabled(
        telRecepteur,
        nomSociete,
        sms,
        false,
        "SMS_ORANGE_NO_TOKEN"
      );
      return false;
    }

    String endpoint = String.format(sendUrlTemplate, sender);
    HttpURLConnection connection = (HttpURLConnection) new URL(endpoint)
      .openConnection();
    connection.setRequestMethod("POST");
    connection.setConnectTimeout(connectTimeoutMs);
    connection.setReadTimeout(readTimeoutMs);
    connection.setDoOutput(true);
    connection.setRequestProperty("Authorization", "Bearer " + token);
    connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
    connection.setRequestProperty("Accept", "application/json");

    byte[] payload = buildSmsPayload(sender, recipient, sms);
    try (OutputStream outputStream = connection.getOutputStream()) {
      outputStream.write(payload);
    }

    int status = connection.getResponseCode();
    String responseBody = readConnectionBody(connection);
    boolean sent = status >= 200 && status < 300;

    if (!sent) {
      log.warn(
        "SMS Orange: echec envoi (status={}) body={}",
        status,
        responseBody
      );
    }

    persistMessageIfEnabled(telRecepteur, nomSociete, sms, sent, "SMS_ORANGE");
    return sent;
  }

  public String getTokenSmsOrange() throws Exception {
    if (!enabled) {
      return null;
    }

    if (
      clientId == null ||
      clientId.isBlank() ||
      clientSecret == null ||
      clientSecret.isBlank()
    ) {
      log.warn(
        "SMS Orange active mais credentials manquants (client-id/client-secret)."
      );
      return null;
    }

    HttpURLConnection connection = (HttpURLConnection) new URL(tokenUrl)
      .openConnection();
    connection.setRequestMethod("POST");
    connection.setConnectTimeout(connectTimeoutMs);
    connection.setReadTimeout(readTimeoutMs);
    connection.setDoOutput(true);
    connection.setRequestProperty("Accept", "application/json");
    connection.setRequestProperty(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=utf-8"
    );

    String basicAuth = Base64
      .getEncoder()
      .encodeToString(
        (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
      );
    connection.setRequestProperty("Authorization", "Basic " + basicAuth);

    byte[] body = "grant_type=client_credentials".getBytes(StandardCharsets.UTF_8);
    try (OutputStream outputStream = connection.getOutputStream()) {
      outputStream.write(body);
    }

    int status = connection.getResponseCode();
    String responseBody = readConnectionBody(connection);
    if (status < 200 || status >= 300) {
      log.warn(
        "SMS Orange: echec recuperation token (status={}) body={}",
        status,
        responseBody
      );
      return null;
    }

    JsonNode json = objectMapper.readTree(responseBody);
    String token = json.path("access_token").asText(null);
    if (token == null || token.isBlank()) {
      log.warn("SMS Orange: reponse token invalide (access_token absent).");
      return null;
    }

    return token;
  }

  private String normalizePhoneNumber(String phoneNumber) {
    if (phoneNumber == null) {
      return null;
    }

    String normalized = phoneNumber.trim();
    if (normalized.isEmpty()) {
      return null;
    }

    if (normalized.startsWith("tel:")) {
      normalized = normalized.substring(4);
    }

    normalized =
      normalized
        .replace(" ", "")
        .replace("-", "")
        .replace("(", "")
        .replace(")", "");

    if (normalized.startsWith("00")) {
      normalized = "+" + normalized.substring(2);
    }

    if (normalized.startsWith("+")) {
      return normalized;
    }

    String prefix = (countryPrefix != null) ? countryPrefix.trim() : "";
    if (!prefix.isEmpty()) {
      String local = normalized;
      if (local.startsWith("0")) {
        local = local.substring(1);
      }
      return prefix + local;
    }

    return "+" + normalized;
  }

  private byte[] buildSmsPayload(String sender, String recipient, String message)
    throws Exception {
    String safeMessage = message != null ? message : "";

    JsonNode payload = objectMapper
      .createObjectNode()
      .set(
        "outboundSMSMessageRequest",
        objectMapper
          .createObjectNode()
          .put("address", "tel:" + recipient)
          .put("senderAddress", "tel:" + sender)
          .set(
            "outboundSMSTextMessage",
            objectMapper.createObjectNode().put("message", safeMessage)
          )
      );

    return objectMapper.writeValueAsBytes(payload);
  }

  private String readConnectionBody(HttpURLConnection connection) {
    try {
      InputStream stream;
      int status = connection.getResponseCode();
      if (status >= 200 && status < 300) {
        stream = connection.getInputStream();
      } else {
        stream = connection.getErrorStream();
      }

      if (stream == null) {
        return "";
      }

      return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
    } catch (Exception e) {
      return "";
    }
  }

  private void persistMessageIfEnabled(
    String telRecepteur,
    String nomSociete,
    String sms,
    boolean sent,
    String type
  ) {
    if (!persistMessages) {
      return;
    }

    try {
      MessageEnvoyer messageEnvoyer = new MessageEnvoyer();
      messageEnvoyer.setLogin(telRecepteur);
      messageEnvoyer.setNomDestinaire(nomSociete != null ? nomSociete : telRecepteur);
      messageEnvoyer.setTextMessage(sms != null ? sms : "");
      messageEnvoyer.setEnvoer(sent);
      messageEnvoyer.setTypeMessage(type);
      messageEnvoyerService.saveMesageEnvoyer(messageEnvoyer);
    } catch (Exception e) {
      log.debug("Impossible de persister le message SMS.", e);
    }
  }
}

