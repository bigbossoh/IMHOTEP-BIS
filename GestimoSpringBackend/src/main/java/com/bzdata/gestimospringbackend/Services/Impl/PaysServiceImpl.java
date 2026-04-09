package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.PaysDto;
import com.bzdata.gestimospringbackend.Models.Pays;
import com.bzdata.gestimospringbackend.Services.PaysService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.repository.PaysRepository;
import com.bzdata.gestimospringbackend.validator.PaysDtoValidator;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
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
public class PaysServiceImpl implements PaysService {
    final PaysRepository paysRepository;
    // final VilleService villeService;

    @Override
    public PaysDto save(PaysDto dto) {
        log.info("We are going to create  a new agence {}", dto);
        List<String> errors = PaysDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("le Pays n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object Pays sont null.",
                    ErrorCodes.PAYS_NOT_VALID, errors);
        }
        Pays pays = paysRepository.save(PaysDto.toEntity(dto));
        return PaysDto.fromEntity(pays);
    }

    @Override
    public boolean delete(Long id) {
        log.info("We are going to delete a Pays with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Pays");
            return false;
        }

        boolean exist = paysRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucune Pays avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.PAYS_NOT_FOUND);
        }
        Optional<Pays> pays = paysRepository.findById(id);
        if (pays.isPresent()) {
            if (pays.get().getVilles().size() != 0) {
                throw new EntityNotFoundException("Il estist des ville dans ce Pays", ErrorCodes.PAYS_ALREADY_IN_USE);
            }
        }
        paysRepository.deleteById(id);
        return true;
    }

    @Override
    public List<PaysDto> findAll() {

        return paysRepository.findAll(Sort.by(Direction.ASC, "nomPays")).stream()
                .map(PaysDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public PaysDto findById(Long id) {
        log.info("We are going to get back the Pays By {}", id);
        if (id == null) {
            log.error("you are not provided a Pays.");
            return null;
        }
        return paysRepository.findById(id).map(PaysDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Pays has been found with Code " + id,
                        ErrorCodes.PAYS_NOT_FOUND));
    }

    @Override
    public PaysDto findByName(String nom) {
        log.info("We are going to get back the Pays By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Pays.");
            return null;
        }
        return paysRepository.findByNomPays(nom).map(PaysDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Pays has been found with name " + nom,
                        ErrorCodes.PAYS_NOT_FOUND));
    }

}
