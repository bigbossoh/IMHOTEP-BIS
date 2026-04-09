package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.MessageEnvoyerDto;
import com.bzdata.gestimospringbackend.Models.MessageEnvoyer;
import com.bzdata.gestimospringbackend.Services.MessageEnvoyerService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.MessageEnvoyerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageEnvoyerServiceImp implements MessageEnvoyerService {
    final MessageEnvoyerRepository messageEnvoyerRepository;
    final GestimoWebMapperImpl gestimoWebMapperImpl;

    @Override
    public boolean saveMesageEnvoyer(MessageEnvoyer messageEnvoyer) {

        if (messageEnvoyer.getId()==0) {
            messageEnvoyerRepository.save(messageEnvoyer);
            return true;
        }
        return false;
    }
    @Override
    public List<MessageEnvoyerDto> listMessageEnvoyerAUnLocataire(String login) {
        List<MessageEnvoyerDto> messageEnvoyerDtos = messageEnvoyerRepository.findAll().stream()
                .filter(mes -> mes.getLogin().equals(login) )
                .map(gestimoWebMapperImpl::fromMessageEnvoyer)
                .collect(Collectors.toList());
        return messageEnvoyerDtos;
    }

}
