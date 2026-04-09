package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bzdata.gestimospringbackend.DTOs.GroupeDroitDto;
import com.bzdata.gestimospringbackend.Models.GroupeDroit;
import com.bzdata.gestimospringbackend.Services.GroupeDroitService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.mappers.GroupeDroitMapperImpl;
import com.bzdata.gestimospringbackend.repository.GroupeDroitRepository;
import com.bzdata.gestimospringbackend.validator.ObjectsValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@RequiredArgsConstructor
@Slf4j
public class GroupeDroitServiceImpl implements GroupeDroitService {

    private final GroupeDroitRepository repository;
    private final ObjectsValidator<GroupeDroitDto> validator;
    private final GroupeDroitMapperImpl mapper;
    @Override
    public Long save(GroupeDroitDto dto) {
        log.info("We are going to validate {}", dto);
        validator.validate(dto);
        GroupeDroit groupeDroit = mapper.fromGroupeDroitDto(dto);
    return repository.save(groupeDroit).getId();

    }
    @Override
    public List<GroupeDroitDto> findAll() {
        return repository.findAll()
        .stream()
        .map(mapper::fromGroupeDroit)
        .collect(Collectors.toList());
    }
    @Override
    public GroupeDroitDto findById(Long id) {
        return repository.findById(id)
        .map(mapper::fromGroupeDroit)
        .orElseThrow(() -> new EntityNotFoundException("No groupe Droit found with the ID : " + id));
    }
    @Override
    public void delete(Long id) {
         // todo check delete
        repository.deleteById(id);
    }
    @Override
    public GroupeDroitDto saveOrUpdate(GroupeDroitDto dto) {
       
        throw new UnsupportedOperationException("Unimplemented method 'saveOrUpdate'");
    }
}