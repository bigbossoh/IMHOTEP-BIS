package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.EtageAfficheDto;
import com.bzdata.gestimospringbackend.DTOs.EtageDto;
import com.bzdata.gestimospringbackend.Models.Etage;
import com.bzdata.gestimospringbackend.Models.Immeuble;
import com.bzdata.gestimospringbackend.Services.EtageService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.EtageRepository;
import com.bzdata.gestimospringbackend.repository.ImmeubleRepository;
import com.bzdata.gestimospringbackend.validator.EtageDtoValidator;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EtageServiceImpl implements EtageService {
    final EtageRepository etageRepository;
    final GestimoWebMapperImpl gestimoWebMapperImpl;
    final ImmeubleRepository immeubleRepository;

    @Override
    public EtageDto save(EtageDto dto) {
      //  int numEt = etageRepository.getMaxNumEtage() + 1;
        Optional<Etage> oldEtage = etageRepository.findById(dto.getId());
        log.info("We are going to create  a new Etage {}", dto);
        List<String> errors = EtageDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("l'Etage n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object Etage sont null.",
                    ErrorCodes.ETAGE_NOT_VALID, errors);
        }
        Immeuble immeuble = immeubleRepository.findById(dto.getIdImmeuble())
                .orElseThrow(() -> new InvalidEntityException(
                        "Impossible de trouver l'immeuble.",
                        ErrorCodes.IMMEUBLE_NOT_FOUND, errors));
        if (oldEtage.isPresent()) {
            oldEtage.get().setNomCompletEtage(dto.getNomCompletEtage());
            oldEtage.get().setImmeuble(immeuble);
            Etage etageSave = etageRepository.save(oldEtage.get());
            return EtageDto.fromEntity(etageSave);
        }
        Etage etage = new Etage();
       // etage.setCodeAbrvEtage( dto.getCodeAbrvEtage() + "-ETAGE-" + numEt);
        etage.setNomCompletEtage(dto.getNomCompletEtage());
       // etage.setNumEtage(numEt);
        etage.setImmeuble(immeuble);

        Etage etageSave = etageRepository.save(etage);
        return EtageDto.fromEntity(etageSave);
    }

    @Override
    public boolean delete(Long id) {
        log.info("We are going to delete a Etage with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Etage");
            return false;
        }
        boolean exist = etageRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucune Etage avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.ETAGE_NOT_FOUND);
        }
        Optional<Etage> eta = etageRepository.findById(id);
        if (eta.isPresent()) {
            if (!eta.get().getMagasins().isEmpty() || eta.get().getAppartements().size() != 0) {
                throw new EntityNotFoundException("l'Etage avec l'ID = " + id + " "
                        + "n' est pas vide ", ErrorCodes.IMMEUBLE_ALREADY_IN_USE);
            }
        }
        etageRepository.deleteById(id);
        return true;
    }

    @Override
    public List<EtageDto> findAll(Long idAgence) {
        return etageRepository.findAll().stream()
                .map(EtageDto::fromEntity)
                .filter(agence->agence.getIdAgence()==idAgence)
                .collect(Collectors.toList());
    }

    @Override
    public EtageDto findById(Long id) {
        log.info("We are going to get back the Etage By {}", id);
        if (id == null) {
            log.error("you are not provided a Etage.");
            return null;
        }
        return etageRepository.findById(id).map(EtageDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Etage has been found with Code " + id,
                        ErrorCodes.ETAGE_NOT_FOUND));
    }

    @Override
    public EtageDto findByName(String nom) {
        log.info("We are going to get back the Etage By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Etage.");
            return null;
        }
        return etageRepository.findByNomCompletEtage(nom).map(EtageDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucune Etage has been found with name " + nom,
                        ErrorCodes.ETAGE_NOT_FOUND));
    }

    @Override
    public List<EtageDto> findAllByIdImmeuble(Long id) {

        log.info("We are going to get back the Etage By {}", id);
        if (id == null || id == 0) {
            log.error("you are not provided a Etage.");
            return null;
        }
        Immeuble immeuble = immeubleRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException(
                        "Impossible de trouver l'immeuble.",
                        ErrorCodes.IMMEUBLE_NOT_FOUND));

        return etageRepository.findByImmeuble(immeuble).stream()
                .map(EtageDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<EtageAfficheDto> affichageDesEtageParImmeuble(Long id) {
        log.info("We are going to get back the Etage By {}", id);
        if (id == null || id == 0) {
            log.error("you are not provided a Etage.");
            return null;
        }
        Immeuble immeuble = immeubleRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException(
                        "Impossible de trouver l'immeuble.",
                        ErrorCodes.IMMEUBLE_NOT_FOUND));

        return etageRepository.findByImmeuble(immeuble).stream()
                .map(gestimoWebMapperImpl::fromEtage)
                .collect(Collectors.toList());
    }

}
