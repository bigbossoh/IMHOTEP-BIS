package com.bzdata.gestimospringbackend.Services.Impl.EncaissementReservationServiceImpl;

import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationRequestDto;
import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import com.bzdata.gestimospringbackend.Models.hotel.EncaissementReservation;
import com.bzdata.gestimospringbackend.Models.hotel.Reservation;
import com.bzdata.gestimospringbackend.Services.EncaissementReservationService.SaveEncaissementReservationAvecRetourDeListService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.AppartementRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementReservationRepository;
import com.bzdata.gestimospringbackend.repository.ReservationRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class SaveEncaissementReservationAvecRetourDeListImpl
  implements SaveEncaissementReservationAvecRetourDeListService {

  final GestimoWebMapperImpl gestimoWebMapperImpl;
  final EncaissementReservationRepository encaissementReservationRepository;
  final ReservationRepository reservationRepository;
  final AppartementRepository appartementRepository;

  @Override
  public List<EncaissementReservationDto> saveEncaissementReservationAvecRetourDeList(
    EncaissementReservationRequestDto dto
  ) {
    log.info("EncaissementReservationRequestDto {}",dto);
    Appartement saveApp = appartementRepository
      .findById(dto.getIdAppartement())
      .orElse(null);

    Reservation reservation = reservationRepository.getById(
      dto.getIdReservation()
    );
    if (reservation != null) {
      reservation.setSoldReservation(dto.getNvoSoldeReservation());
      if (dto.getNvoSoldeReservation() == 0) {
        if (saveApp != null) {
          saveApp.setOccupied(false);
          appartementRepository.saveAndFlush(saveApp);
        }
        reservation.setStatutReservation("Ferme");
      }
      reservationRepository.saveAndFlush(reservation);
    }
    EncaissementReservation encaissementReservation = new EncaissementReservation();
    encaissementReservation.setIdAgence(dto.getIdAgence());
    encaissementReservation.setCreationDate(
      LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC)
    );
    encaissementReservation.setIdCreateur(dto.getIdCreateur());
    encaissementReservation.setModePaiement(dto.getModePaiement());
    encaissementReservation.setDateEncaissement(dto.getDateEncaissement());
    encaissementReservation.setEncienSoldReservation(
      dto.getEncienSoldReservation()
    );
    // encaissementReservation.setEntiteOperation(dto.getEntiteOperation());
    //encaissementReservation.setModePaiement(dto.getModePaiement());
    encaissementReservation.setMontantEncaissement(
      dto.getMontantEncaissement()
    );
    encaissementReservation.setNvoSoldeReservation(
      dto.getNvoSoldeReservation()
    );

    encaissementReservation.setReservation(reservation);
    EncaissementReservation encaissementReservationSave = encaissementReservationRepository.save(
      encaissementReservation
    );
    if (reservation == null) {
      return null;
    } else {
      return encaissementReservationRepository
        .findAll()
        .stream()
        .filter(res -> res.getReservation().getId() == reservation.getId())
        .map(x -> gestimoWebMapperImpl.fromEncaissementReservation(x))
        .distinct()
        .collect(Collectors.toList());
    }
  }

  @Override
  public List<EncaissementReservationDto> findAllEncaissementByReservation(
    Long idBien
  ) {
    Comparator<EncaissementReservation> compareBydatecreation = Comparator.comparing(
      EncaissementReservation::getCreationDate
    );
    return encaissementReservationRepository
      .findAll()
      .stream()
      .sorted(compareBydatecreation.reversed())
      .filter(res ->
        res.getReservation().getId() == idBien &&
        res.getReservation().getStatutReservation().contains("Ouv")
      )
      .map(x -> gestimoWebMapperImpl.fromEncaissementReservation(x))
      .distinct()
      .collect(Collectors.toList());
  }
}
