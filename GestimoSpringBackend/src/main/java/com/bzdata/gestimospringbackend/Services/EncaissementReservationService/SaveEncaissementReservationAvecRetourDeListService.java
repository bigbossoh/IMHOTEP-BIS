package com.bzdata.gestimospringbackend.Services.EncaissementReservationService;

import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationRequestDto;

import java.util.List;

public interface SaveEncaissementReservationAvecRetourDeListService {
  List<EncaissementReservationDto> saveEncaissementReservationAvecRetourDeList(
    EncaissementReservationRequestDto dto
  );
  List<EncaissementReservationDto>findAllEncaissementByReservation(Long idBien);
}
