package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.MessageEnvoyerDto;
import com.bzdata.gestimospringbackend.Models.MessageEnvoyer;

public interface MessageEnvoyerService {
    boolean saveMesageEnvoyer(MessageEnvoyer messageEnvoyer);

    List<MessageEnvoyerDto> listMessageEnvoyerAUnLocataire(String login);
}
