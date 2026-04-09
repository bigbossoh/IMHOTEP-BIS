package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.EncaissementPrincipalDTO;
import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationRequestDto;
import com.bzdata.gestimospringbackend.DTOs.ReservationAfficheDto;
import com.bzdata.gestimospringbackend.DTOs.ReservationRequestDto;
import com.bzdata.gestimospringbackend.DTOs.ReservationSaveOrUpdateDto;
import java.time.LocalDate;
import java.util.List;

public interface ReservationService
  extends AbstractService<ReservationSaveOrUpdateDto> {
  public ReservationAfficheDto saveOrUpdateGood(ReservationRequestDto dto);

  List<ReservationAfficheDto> findAlGood();

  public ReservationAfficheDto findByIdGood(Long id);

  public boolean saveOrUpdateReservation(ReservationRequestDto dto);

  List<EncaissementReservationDto> saveEncaissementReservationAvecREsrourDeList(
    EncaissementReservationRequestDto dto
  );
  List<EncaissementReservationDto> listeDesEncaissementReservationeEntreDeuxDateParAgence(
    Long agence,
    LocalDate dateDebut,
    LocalDate dateFin
  );
  List<ReservationAfficheDto> listeDesReservationParAgence(Long idAgence);
  ReservationAfficheDto findReservationById(Long idReservation);
  List<ReservationAfficheDto> listeDesReservationOuvertParAgence(Long idAgence);
  double sommeEncaissementReservationEntreDeuxPeriode(
    Long agence,
    LocalDate dateDebut,
    LocalDate dateFin
  );
  ReservationAfficheDto findPeriodeReservationByIdBien(Long idBien);
  
}
