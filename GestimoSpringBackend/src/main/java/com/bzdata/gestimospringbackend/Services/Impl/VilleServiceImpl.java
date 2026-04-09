package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.bzdata.gestimospringbackend.DTOs.CommuneResponseDto;
import com.bzdata.gestimospringbackend.DTOs.PaysDto;
import com.bzdata.gestimospringbackend.DTOs.VilleDto;
import com.bzdata.gestimospringbackend.Models.Ville;
import com.bzdata.gestimospringbackend.Services.CommuneService;
import com.bzdata.gestimospringbackend.Services.PaysService;
import com.bzdata.gestimospringbackend.Services.VilleService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.repository.VilleRepository;
import com.bzdata.gestimospringbackend.validator.VilleDtoValidator;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VilleServiceImpl implements VilleService {

    final VilleRepository villeRepository;

    final CommuneService communeService;
    final PaysService paysService;

    @Override
    public VilleDto save(VilleDto dto) {

        log.info("We are going to create  a new Ville {}", dto);
        List<String> errors = VilleDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("la Ville n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object Ville sont null.",
                    ErrorCodes.VILLE_NOT_VALID, errors);
        }
        Optional<Ville> oldVille = villeRepository.findById(dto.getId());
        if (!oldVille.isPresent()) {
            Ville ville = new Ville();
            ville.setIdAgence(dto.getIdAgence());
            PaysDto paysDto = paysService.findById(dto.getIdPays());
            ville.setAbrvVille(paysDto.getAbrvPays() + "-" + dto.getAbrvVille());
            ville.setNomVille(dto.getNomVille());
            ville.setPays(PaysDto.toEntity(paysDto));
            Ville villeSave = villeRepository.save(ville);
            return VilleDto.fromEntity(villeSave);
        } else {

            PaysDto paysDto = paysService.findById(dto.getIdPays());
            oldVille.get().setAbrvVille(paysDto.getAbrvPays() + "-" + dto.getAbrvVille());
            oldVille.get().setNomVille(dto.getNomVille());
            oldVille.get().setPays(PaysDto.toEntity(paysDto));
            oldVille.get().setIdAgence(dto.getIdAgence());
            Ville villeSave = villeRepository.save(oldVille.get());
            return VilleDto.fromEntity(villeSave);
        }

    }

    @Override
    public boolean delete(Long id) {

        log.info("We are going to delete a Ville with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Ville");
            return false;
        }
        List<CommuneResponseDto> communeVille = communeService.findAllByIdVille(id);
        if (communeVille.size() != 0) {
            log.error("Ville Contains Contains");
            return false;
        }
        boolean exist = villeRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucune Ville avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.VILLE_NOT_FOUND);
        }
        villeRepository.deleteById(id);
        return true;
    }

    @Override
    public List<VilleDto> findAll() {
        return villeRepository.findAll(Sort.by(Direction.ASC, "nomVille")).stream()
                .map(VilleDto::fromEntity)
                
                .collect(Collectors.toList());
    }

    @Override
    public VilleDto findById(Long id) {
        log.info("We are going to get back the Ville By {}", id);
        if (id == null) {
            log.error("you are not provided a Ville.");
            return null;
        }
        return villeRepository.findById(id).map(VilleDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucune Ville has been found with Code " + id,
                        ErrorCodes.VILLE_NOT_FOUND));
    }

    @Override
    public VilleDto findByName(String nom) {
        log.info("We are going to get back the Ville By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Ville.");
            return null;
        }
        return villeRepository.findByNomVille(nom).map(VilleDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Ville has been found with name " + nom,
                        ErrorCodes.VILLE_NOT_FOUND));
    }

    @Override
    public List<VilleDto> findAllByPays(PaysDto paysDto) {
        log.info("We are going to get back the Ville By {}", paysDto);
        if (!StringUtils.hasLength(paysDto.getNomPays())) {
            log.error("you are not provided a Ville.");
            return null;
        }
        return villeRepository.findByPays(PaysDto.toEntity(paysDto)).stream().map(VilleDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<VilleDto> findAllByIdPays(Long id) {

        PaysDto p = paysService.findById(id);

        return villeRepository.findByPays(PaysDto.toEntity(p)).stream()
                .map(VilleDto::fromEntity)
                .collect(Collectors.toList());
    }

}
