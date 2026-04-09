package com.bzdata.gestimospringbackend.Utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import jakarta.json.Json;
import jakarta.json.JsonObject;

import com.bzdata.gestimospringbackend.Models.MessageEnvoyer;
import com.bzdata.gestimospringbackend.Services.MessageEnvoyerService;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
@RequiredArgsConstructor
public class SmsOrangeConfig {
    final MessageEnvoyerService messageEnvoyerService;
    String telephoneDuDetinataire;
    String telephoneQuiEnvoiLesSms;
    String messageEnvyer;
    String accessToken;

    // SMS désactivé temporairement — réactiver quand les credentials Orange seront configurés
    public boolean sendSms(String accessToken, String sms, String telEnvoi, String telRecepteur, String nomSociete)
            throws Exception {
        return false;
    }

    // SMS désactivé temporairement
    public String getTokenSmsOrange() throws Exception {
        return null;
    }

}
