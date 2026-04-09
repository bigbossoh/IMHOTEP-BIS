package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.BailClotureRequestDto;
import com.bzdata.gestimospringbackend.DTOs.BailModifDto;
import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;

public interface BailService {
    List<OperationDto>  closeBail(Long id, Boolean compteSolde, BailClotureRequestDto requestDto);

    OperationDto modifierUnBail(BailModifDto dto);

    int nombreBauxActifs(Long idAgence);

    int nombreBauxNonActifs(Long idAgence);

    List<AppelLoyersFactureDto> findAllByIdBienImmobilier(Long id);

    List<OperationDto> findAllByIdLocataire(Long id);

    OperationDto findOperationById(Long id);

    List<OperationDto> findAllBauxLocation(Long idAgence);

    boolean deleteOperationById(Long id);

    LocataireEncaisDTO bailBayLocataireEtBien(Long locataire,Long bienImmobilier);

}
