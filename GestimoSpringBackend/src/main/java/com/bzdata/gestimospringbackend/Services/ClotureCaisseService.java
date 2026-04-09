package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.ClotureCaisseDto;

import java.time.Instant;
import java.util.List;

public interface ClotureCaisseService
  extends AbstractService<ClotureCaisseDto> {
  int countClotureCaisse(Long idCaisse);
  boolean saveClotureCaisse(ClotureCaisseDto dto);
  List<ClotureCaisseDto> findNonCloturerByDInferieurOuEgaleDate(
    Instant dateEnCours,Long idCaisse
  );
  List<ClotureCaisseDto> findNonCloturerByDateAndCaisseAndChapitre(Instant dateEnCours,Long idCaisse,String idChapitre);
  List<ClotureCaisseDto> findAllCloturerCaisseByDateAndChapitre(Instant dateEnCours,Long idCaisse,String idChapitre);
  List<ClotureCaisseDto>findAllByCaissierAndChapitre(Long idCaisse,String idChapitre);
  int countInitClotureByCaissiaireAndChampitre(Long idCaissiaire,String idChapitre);
   List<ClotureCaisseDto> findAllCloturerCaisseAgence();
}
