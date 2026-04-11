package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.Services.OperationService;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service

@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OperationServiceImpl implements OperationService {
    final BailLocationRepository bailLocationRepository;
    final UtilisateurRepository utilisateurRepository;
    final BienImmobilierRepository bienImmobilierRepository;
final BailMapperImpl bailMapperImpl;

    @Override
    public List<OperationDto> getAllOperation(Long idAgence) {

        return bailLocationRepository.findAll().stream()
                .map(bailMapperImpl::fromOperation)
                .filter(operation -> Objects.equals(operation.getIdAgence(), idAgence))
                .collect(Collectors.toList());

    }
    @Override
    public List<OperationDto> getAllOperationByLocataire(Long id) {
      Utilisateur  userOp = utilisateurRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Aucun Utilisateur trouvé avec l'id : " +
                        id,
                        ErrorCodes.BIEN_IMMOBILIER_NOT_FOUND));
        return bailLocationRepository.findAll().stream()
        .map(bailMapperImpl::fromOperation)
        .filter(utilis->utilis.getUtilisateurOperation().equals(userOp))
        .collect(Collectors.toList());
    }
    @Override
    public List<OperationDto> getAllOperationByBienImmobilier(Long id) {
        Bienimmobilier bienImmobilier = bienImmobilierRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Aucun Bien a été trouvé avec l'adresse " +
                        id,
                        ErrorCodes.BIEN_IMMOBILIER_NOT_FOUND));
        return bailLocationRepository.findAll().stream()
        .map(bailMapperImpl::fromOperation)
        .filter(utilis->utilis.getBienImmobilierOperation().equals(bienImmobilier))
        .collect(Collectors.toList());
    }


}
