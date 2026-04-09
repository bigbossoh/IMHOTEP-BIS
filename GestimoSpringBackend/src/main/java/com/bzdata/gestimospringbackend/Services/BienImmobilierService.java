package com.bzdata.gestimospringbackend.Services;

import java.util.List;

import com.bzdata.gestimospringbackend.DTOs.BienImmobilierAffiheDto;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;

public interface BienImmobilierService {
    List<BienImmobilierAffiheDto> findAll(Long idAgence, Long chapitre);

    List<BienImmobilierAffiheDto> findAllBienOccuper(Long idAgence, Long chapitre);

    Bienimmobilier findBienByBailEnCours(Long idBail);

    BienImmobilierAffiheDto rattacherUnBienAUnChapitre(Long idBail, Long chapitre);
}
