package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.PrestationSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Models.hotel.Prestation;
import com.bzdata.gestimospringbackend.Services.PrestaionService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.InvalidOperationException;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.PrestationAdditionnelReservationRepository;
import com.bzdata.gestimospringbackend.repository.PrestationRepository;
import com.bzdata.gestimospringbackend.validator.ObjectsValidator;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrestaionServiceImpl implements PrestaionService{
    final PrestationRepository serviceAdditionnelRepository;
    final PrestationAdditionnelReservationRepository prestationAdditionnelReservationRepository;

    private final ObjectsValidator<PrestationSaveOrUpdateDto> validator;

    @Override
    public Long save(PrestationSaveOrUpdateDto dto) {
        validator.validate(dto);

        Prestation prestation = new Prestation();
        prestation.setName(dto.getName());
        prestation.setAmount(dto.getAmount());
        prestation.setIdAgence(dto.getIdAgence());
        prestation.setIdCreateur(dto.getIdCreateur());

        Prestation saved = serviceAdditionnelRepository.save(prestation);
        return saved.getId();
    }

    @Override
    public List<PrestationSaveOrUpdateDto> findAll() {
        return serviceAdditionnelRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Prestation::getName))
                .map(GestimoWebMapperImpl::fromServiceAditionnel)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrestationSaveOrUpdateDto> findAllByAgence(Long idAgence) {
        return serviceAdditionnelRepository.findAllByIdAgenceOrderByNameAsc(idAgence)
                .stream()
                .map(GestimoWebMapperImpl::fromServiceAditionnel)
                .collect(Collectors.toList());
    }

    @Override
    public PrestationSaveOrUpdateDto findById(Long id) {
        Prestation prestation = serviceAdditionnelRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prestation introuvable (id=" + id + ")"));
        return GestimoWebMapperImpl.fromServiceAditionnel(prestation);
    }

    @Override
    public void delete(Long id) {
        Prestation prestation = serviceAdditionnelRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prestation introuvable (id=" + id + ")"));

        long usageCount = prestationAdditionnelReservationRepository.countByServiceAdditionnelle_Id(id);
        if (usageCount > 0) {
            throw new InvalidOperationException(
                    "Impossible de supprimer la prestation : elle est déjà utilisée sur des réservations ("
                            + usageCount + ").");
        }

        serviceAdditionnelRepository.delete(prestation);
    }

    @Override
    public PrestationSaveOrUpdateDto saveOrUpdate(PrestationSaveOrUpdateDto dto) {
        validator.validate(dto);

        Long id = dto.getId();
        boolean isNew = id == null || id == 0;
        if (isNew) {
            Prestation prestation = new Prestation();
            prestation.setName(dto.getName());
            prestation.setAmount(dto.getAmount());
            prestation.setIdAgence(dto.getIdAgence());
            prestation.setIdCreateur(dto.getIdCreateur());

            Prestation saved = serviceAdditionnelRepository.save(prestation);
            return GestimoWebMapperImpl.fromServiceAditionnel(saved);
        }

        Prestation prestation = serviceAdditionnelRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prestation introuvable (id=" + id + ")"));

        prestation.setName(dto.getName());
        prestation.setAmount(dto.getAmount());
        prestation.setIdAgence(dto.getIdAgence());
        prestation.setIdCreateur(dto.getIdCreateur());

        Prestation saved = serviceAdditionnelRepository.save(prestation);
        return GestimoWebMapperImpl.fromServiceAditionnel(saved);
    }

}
