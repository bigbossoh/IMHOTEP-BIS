package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bzdata.gestimospringbackend.DTOs.DroitAccesDTO;
import com.bzdata.gestimospringbackend.DTOs.DroitAccesPayloadDTO;
import com.bzdata.gestimospringbackend.Models.DroitAcces;
import com.bzdata.gestimospringbackend.Services.DroitAccesService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.mappers.GroupeDroitMapperImpl;
import com.bzdata.gestimospringbackend.repository.DroitAccesRepository;
import com.bzdata.gestimospringbackend.validator.ObjectsValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@RequiredArgsConstructor
@Slf4j
public class DroitAccesServiceImpl implements DroitAccesService {

    private final DroitAccesRepository repository;
    private final ObjectsValidator<DroitAccesPayloadDTO> validator;
    private final GroupeDroitMapperImpl mapper;

    @Override
    public Long save(DroitAccesPayloadDTO dto) {
        log.info("We are going to validate {}", dto);
        validator.validate(dto);
        DroitAcces droitAcces = mapper.fromDroitAccesPayloadDto(dto);
        droitAcces.setCodeDroit( UUID.randomUUID().toString());
    return repository.save(droitAcces).getId();
    }

    @Override
    public List<DroitAccesPayloadDTO> findAll() {
        return repository.findAll()
        .stream()
        .map(mapper::fromDroitAccesPayload)
        .collect(Collectors.toList());
    }

    @Override
    public DroitAccesPayloadDTO findById(Long id) {
        return repository.findById(id)
        .map(mapper::fromDroitAccesPayload)
        .orElseThrow(() -> new EntityNotFoundException("No Droit access found with the ID : " + id));
    }

    @Override
    public void delete(Long id) {
        // todo check delete
        repository.deleteById(id);
    }

    @Override
    public List<DroitAccesDTO> findAllDroit() {
        return repository.findAll()
        .stream()
        .map(mapper::fromDroitAcces)
        .collect(Collectors.toList());
    }

    @Override
    public DroitAccesDTO findByDroitAccesDTOId(Long id) {
        return repository.findById(id)
        .map(mapper::fromDroitAcces)
        .orElseThrow(() -> new EntityNotFoundException("No Droit access found with the ID : " + id));
    }

    @Override
    public DroitAccesPayloadDTO saveOrUpdate(DroitAccesPayloadDTO dto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'saveOrUpdate'");
    }

}
