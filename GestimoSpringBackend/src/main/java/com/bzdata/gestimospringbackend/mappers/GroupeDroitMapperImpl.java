package com.bzdata.gestimospringbackend.mappers;

import jakarta.transaction.Transactional;


import org.springframework.stereotype.Service;

import com.bzdata.gestimospringbackend.DTOs.DroitAccesDTO;
import com.bzdata.gestimospringbackend.DTOs.DroitAccesPayloadDTO;
import com.bzdata.gestimospringbackend.DTOs.GroupeDroitDto;
import com.bzdata.gestimospringbackend.Models.DroitAcces;
import com.bzdata.gestimospringbackend.Models.GroupeDroit;
import org.springframework.beans.BeanUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupeDroitMapperImpl {

    public GroupeDroit fromGroupeDroitDto(GroupeDroitDto dto){
        GroupeDroit groupeDroit = new GroupeDroit();
        BeanUtils.copyProperties(dto, groupeDroit);
        return groupeDroit; 
    }
    public GroupeDroitDto fromGroupeDroit(GroupeDroit groupeDroit){
        GroupeDroitDto groupeDroitDto = new GroupeDroitDto();
        BeanUtils.copyProperties(groupeDroit, groupeDroitDto);
        return groupeDroitDto; 
    }
    public DroitAcces fromDroitAccesDto(DroitAccesDTO dto){
        DroitAcces droitAcces = new DroitAcces();
        BeanUtils.copyProperties(dto, droitAcces);
        return droitAcces; 
    }
    public DroitAcces fromDroitAccesPayloadDto(DroitAccesPayloadDTO dto){
        DroitAcces droitAcces = new DroitAcces();
        BeanUtils.copyProperties(dto, droitAcces);
        return droitAcces; 
    }
    public DroitAccesPayloadDTO fromDroitAccesPayload(DroitAcces droitAcces){
        DroitAccesPayloadDTO droitAccesPayloadDTO = new DroitAccesPayloadDTO();
        BeanUtils.copyProperties(droitAcces, droitAccesPayloadDTO);
        return droitAccesPayloadDTO; 
    }

    public DroitAccesDTO fromDroitAcces(DroitAcces droitAcces){
        DroitAccesDTO droitAccesDTO = new DroitAccesDTO();
        BeanUtils.copyProperties(droitAcces, droitAccesDTO);
        return droitAccesDTO; 
    }
    
}
