package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.PrestationSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Models.hotel.Prestation;
import com.bzdata.gestimospringbackend.Services.PrestaionService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
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

    private final ObjectsValidator<PrestationSaveOrUpdateDto> validator;

    @Override
    public Long save(PrestationSaveOrUpdateDto dto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
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
    public PrestationSaveOrUpdateDto findById(Long id) {
        Prestation serviceAdditionnelle = serviceAdditionnelRepository.findById(id).orElse(null);
        if (serviceAdditionnelle != null) {
            return GestimoWebMapperImpl.fromServiceAditionnel(serviceAdditionnelle);
        } else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        Prestation serviceAdditionnelle = serviceAdditionnelRepository.findById(id).orElse(null);
        if (serviceAdditionnelle != null) {
            serviceAdditionnelRepository.delete(serviceAdditionnelle);
        } else {
            throw new UnsupportedOperationException("Unimplemented method 'delete'");
        }
    }

    @Override
    public PrestationSaveOrUpdateDto saveOrUpdate(PrestationSaveOrUpdateDto dto) {
        Prestation serviceAdditionnelle = serviceAdditionnelRepository.findById(dto.getId()).orElse(null);

        validator.validate(dto);
        if (serviceAdditionnelle != null) {
            //serviceAdditionnelle.setType(dto.g());
            serviceAdditionnelle.setName(dto.getName());
            serviceAdditionnelle.setAmount(dto.getAmount());
            serviceAdditionnelle.setIdAgence(dto.getIdAgence());
            serviceAdditionnelle.setIdCreateur(dto.getIdCreateur());
            Prestation saveServiceAdditionnelle = serviceAdditionnelRepository.save(serviceAdditionnelle);
            return GestimoWebMapperImpl.fromServiceAditionnel(saveServiceAdditionnelle);
        } else {
            Prestation newsServiceAdditionnelle = new Prestation();
           // newCategorieChambre.setDescription(dto.getDescription());
           newsServiceAdditionnelle.setName(dto.getName());
           newsServiceAdditionnelle.setAmount(dto.getAmount());
           newsServiceAdditionnelle.setIdCreateur(dto.getIdCreateur());
           newsServiceAdditionnelle.setIdAgence(dto.getIdAgence());
           Prestation saveServiceAdditionnelle = serviceAdditionnelRepository.save(newsServiceAdditionnelle);
            return GestimoWebMapperImpl.fromServiceAditionnel(saveServiceAdditionnelle);
        }
    }

}
