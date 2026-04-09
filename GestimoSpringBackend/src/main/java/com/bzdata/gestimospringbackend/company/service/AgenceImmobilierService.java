package com.bzdata.gestimospringbackend.company.service;

import java.io.IOException;
import java.util.List;

import com.bzdata.gestimospringbackend.company.dto.response.AgenceImmobilierDTO;
import com.bzdata.gestimospringbackend.company.dto.request.AgenceRequestDto;
import com.bzdata.gestimospringbackend.company.dto.response.AgenceResponseDto;
import com.bzdata.gestimospringbackend.company.dto.request.ImageLogoDto;
import com.bzdata.gestimospringbackend.common.security.entity.VerificationToken;

public interface AgenceImmobilierService {

    boolean save(AgenceRequestDto dto);

    AgenceImmobilierDTO  saveUneAgence(AgenceRequestDto dto);
    AgenceResponseDto findAgenceById(Long id);

    List<AgenceImmobilierDTO> listOfAgenceImmobilier();
    List<AgenceImmobilierDTO> listAllAgences();

    List<AgenceImmobilierDTO> listOfAgenceOrderByNomAgenceAsc(Long idAgence);

    void deleteAgence(Long id);

    AgenceImmobilierDTO findAgenceByEmail(String email);

    void verifyAccount(String token);

    void feachUserAndEnable(VerificationToken verificationToken);

    AgenceImmobilierDTO uploadLogoAgence(ImageLogoDto dto)throws IOException;
}
