package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.CommuneRequestDto;
import com.bzdata.gestimospringbackend.DTOs.CommuneResponseDto;
import com.bzdata.gestimospringbackend.DTOs.VilleDto;
import com.bzdata.gestimospringbackend.Models.Commune;
import com.bzdata.gestimospringbackend.Models.Ville;
import com.bzdata.gestimospringbackend.Services.CommuneService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.repository.CommuneRepository;
import com.bzdata.gestimospringbackend.repository.VilleRepository;
import com.bzdata.gestimospringbackend.validator.CommuneValidator;

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
public class CommuneServiceImpl implements CommuneService {
    final CommuneRepository communeRepository;
    final VilleRepository villeRepository;

    @Override
    public CommuneRequestDto save(CommuneRequestDto dto) {
        Optional<Commune> oldCommune = communeRepository.findById(dto.getId());

        log.info("We are going to create  a new Commune {}", dto);
        List<String> errors = CommuneValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("la Commune n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object Commune sont null.",
                    ErrorCodes.COMMUNE_NOT_VALID, errors);
        }
        if (oldCommune.isPresent()) {

            Ville ville = villeRepository.findById(dto.getIdVille())
                    .orElseThrow(
                            () -> new InvalidEntityException("Impossible de trouver la ville",
                                    ErrorCodes.VILLE_NOT_FOUND));
            oldCommune.get().setAbrvCommune(ville.getAbrvVille() + "-" + dto.getAbrvCommune());
            oldCommune.get().setNomCommune(dto.getNomCommune());
            oldCommune.get().setVille(ville);
            Commune communeSave = communeRepository.save(oldCommune.get());
            return CommuneRequestDto.fromEntity(communeSave);
        } else {
            Commune commune = new Commune();
            Ville ville = villeRepository.findById(dto.getIdVille())
                    .orElseThrow(
                            () -> new InvalidEntityException("Impossible de trouver la ville",
                                    ErrorCodes.VILLE_NOT_FOUND));
            commune.setAbrvCommune(ville.getAbrvVille() + "-" + dto.getAbrvCommune());
            commune.setNomCommune(dto.getNomCommune());
            commune.setVille(ville);
            Commune communeSave = communeRepository.save(commune);
            return CommuneRequestDto.fromEntity(communeSave);
        }

    }

    @Override
    public boolean delete(Long id) {
        log.info("We are going to delete a Commune with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Commune");
            return false;
        }
        boolean exist = communeRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucune Commune avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.COMMUNE_NOT_FOUND);
        }
        communeRepository.deleteById(id);
        return true;
    }

    @Override
    public List<CommuneRequestDto> findAll() {
        return communeRepository.findAll()
                // Sort.by(Direction.ASC, "nomCommune"))
                .stream()

                .sorted(Comparator.comparing(Commune::getNomCommune))
                .map(CommuneRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CommuneRequestDto findById(Long id) {
        log.info("We are going to get back the Commune By {}", id);
        if (id == null) {
            log.error("you are not provided a Commune.");
            return null;
        }
        return communeRepository.findById(id).map(CommuneRequestDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucune Ville has been found with Code " + id,
                        ErrorCodes.COMMUNE_NOT_FOUND));
    }

    @Override
    public CommuneRequestDto findByName(String nom) {
        log.info("We are going to get back the Commune By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Commune.");
            return null;
        }
        return communeRepository.findByNomCommune(nom).map(CommuneRequestDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Commune has been found with name " + nom,
                        ErrorCodes.COMMUNE_NOT_FOUND));
    }

    @Override
    public List<CommuneRequestDto> findAllByVille(VilleDto villeDto) {
        log.info("We are going to get back the Commune By {}", villeDto);
        if (!StringUtils.hasLength(villeDto.getNomVille())) {
            log.error("you are not provided a Ville.");
            return null;
        }

        return communeRepository.findByVille(villeDto).stream().map(CommuneRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommuneResponseDto> findAllByIdVille(Long id) {
        Optional<Ville> v = villeRepository.findById(id);

        log.info("We are going to get back the Ville By {}", id);

        if (id == null) {
            log.error("you are not provided a Ville.");
            return null;
        }

        if (!v.isPresent()) {
            log.error("Commune not found for the Ville.");
            return null;
        }
        log.info("We are going to get back the Ville  {}", v.get());
        return communeRepository.findByVille(v.get()).stream()
                .map(CommuneResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

}
