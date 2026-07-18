package com.bzdata.gestimospringbackend.Services.Impl.EncaissementReservationServiceImpl;

import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationRequestDto;
import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.hotel.EncaissementReservation;
import com.bzdata.gestimospringbackend.Models.hotel.Reservation;
import com.bzdata.gestimospringbackend.Services.EncaissementReservationService.SaveEncaissementReservationAvecRetourDeListService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.AppartementRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementReservationRepository;
import com.bzdata.gestimospringbackend.repository.ReservationRepository;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
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
    log.info("EncaissementReservationRequestDto {}", dto);
    
    Reservation reservation = reservationRepository.findById(
      dto.getIdReservation()
    ).orElse(null);
    if (reservation == null) {
      throw new IllegalArgumentException("Réservation non trouvée avec l'ID : " + dto.getIdReservation());
    }
    
    Appartement saveApp = appartementRepository
      .findById(dto.getIdAppartement())
      .orElse(null);
    
    // Calcul du nouveau solde : ancien solde - montant encaissé
    double nouveauSolde = Math.max(0, dto.getEncienSoldReservation() - dto.getMontantEncaissement());
    
    // Mise à jour de la réservation avec le nouveau solde
    reservation.setSoldReservation(nouveauSolde);
    if (nouveauSolde == 0) {
      if (saveApp != null) {
        saveApp.setOccupied(false);
        appartementRepository.saveAndFlush(saveApp);
      }
      reservation.setStatutReservation("Ferme");
    }
    reservationRepository.saveAndFlush(reservation);
    
    // Création de l'encaissement
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
    encaissementReservation.setMontantEncaissement(
      dto.getMontantEncaissement()
    );
    encaissementReservation.setNvoSoldeReservation(nouveauSolde);
    encaissementReservation.setSoldeEncaissement(nouveauSolde);
    encaissementReservation.setReservation(reservation);
    
    encaissementReservationRepository.save(encaissementReservation);
    
    // Retourner la liste des encaissements de la réservation (triés par date décroissante)
    return encaissementReservationRepository
      .findAllByReservation_Id(reservation.getId())
      .stream()
      .sorted(Comparator.comparing(EncaissementReservation::getCreationDate).reversed())
      .map(x -> gestimoWebMapperImpl.fromEncaissementReservation(x))
      .collect(Collectors.toList());
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
