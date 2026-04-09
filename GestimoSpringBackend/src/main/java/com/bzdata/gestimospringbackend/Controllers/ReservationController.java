package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationDto;
import com.bzdata.gestimospringbackend.DTOs.EncaissementReservationRequestDto;
import com.bzdata.gestimospringbackend.DTOs.ReservationAfficheDto;
import com.bzdata.gestimospringbackend.DTOs.ReservationRequestDto;
import com.bzdata.gestimospringbackend.DTOs.ReservationSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Services.ReservationService;
import com.bzdata.gestimospringbackend.Services.EncaissementReservationService.SaveEncaissementReservationAvecRetourDeListService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/reservation")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
//@SecurityRequirement(name = "gestimoapi")
@Slf4j
public class ReservationController {

  final ReservationService reservationService;
final SaveEncaissementReservationAvecRetourDeListService encaissementReservationAvecRetourDeListService;
  @PostMapping("/saveorupdate")
  @Operation(
    summary = "Creation et mise à jour d'une Reservation",
    security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<ReservationSaveOrUpdateDto> saveorupdateRes(
    @RequestBody ReservationSaveOrUpdateDto dto
  ) {
    return ResponseEntity.ok(reservationService.saveOrUpdate(dto));
  }

  @PostMapping("/saveorupdatereservation")
  @Operation(
    summary = "Creation et mise à jour d'une Reservation avec le bon dto"
  )
  public ResponseEntity<Boolean> saveorupdatereservation(
    @RequestBody ReservationRequestDto dto
  ) {
    log.info(" Reserrr ; {}", dto);
    return ResponseEntity.ok(reservationService.saveOrUpdateReservation(dto));
  }

  @PostMapping("/saveorupdategood")
  @Operation(
    summary = "Creation et mise à jour d'une Reservation bon"
    // ,
    // security = @SecurityRequirement(name = "bearerAuth")
  )
  public ResponseEntity<ReservationAfficheDto> saveorupdategood(
    @RequestBody ReservationRequestDto dto
  ) {
    return ResponseEntity.ok(reservationService.saveOrUpdateGood(dto));
  }

  // SUPPRESSION D'UNE COMMUNE
  @Operation(
    summary = "Suppression d'une Reservation avec l'ID en paramètre"
    // ,
    // security = @SecurityRequirement(name = "bearerAuth")
  )
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteReservation(@PathVariable("id") Long id) {
    reservationService.delete(id);
    return ResponseEntity.ok().build();
  }

  @Operation(
    summary = "Trouver une Reservation par son ID"
  )
  @GetMapping("/findReservationById/{id}")
  public ResponseEntity<ReservationAfficheDto> findCategorieChambreByIDReservation(
    @PathVariable("id") Long id
  ) {
    return ResponseEntity.ok(reservationService.findReservationById(id));
  }
   @GetMapping("/findPeriodeReservationByIdBien/{idBien}")
  public ResponseEntity<ReservationAfficheDto> findPeriodeReservationByIdBien(
    @PathVariable("idBien") Long idBien
  ) {
    return ResponseEntity.ok(reservationService.findPeriodeReservationByIdBien(idBien));
  }
  
  // TOUTES LES RESERVATION
  @Operation(
    summary = "Liste de toutes les Reservations"
    // ,
    // security = @SecurityRequirement(name = "bearerAuth")
  )
  @GetMapping("/allreservationparagence/{idAgence}")
  public ResponseEntity<List<ReservationAfficheDto>> allreservationparagence(
    @PathVariable("idAgence") Long idAgence
  ) {
    return ResponseEntity.ok(
      reservationService.listeDesReservationParAgence(idAgence)
    );
  }

  //
  @GetMapping("/allreservation")
  public ResponseEntity<List<ReservationAfficheDto>> allreservation() {
    return ResponseEntity.ok(reservationService.findAlGood());
  }

    @GetMapping("/listeDesReservationOuvertParAgence/{idAgence}")
  public ResponseEntity<List<ReservationAfficheDto>> listeDesReservationOuvertParAgence(@PathVariable("idAgence") Long idAgence) {
    return ResponseEntity.ok(reservationService.listeDesReservationOuvertParAgence(idAgence));
  }

  @GetMapping("/findAllEncaissementReservationByIdBien/{idReser}")
  public ResponseEntity<List<EncaissementReservationDto>> findAllEncaissementReservationByIdBien(
    @PathVariable("idReser") Long idReser
  ) {
    return ResponseEntity.ok(
      encaissementReservationAvecRetourDeListService.findAllEncaissementByReservation(idReser)
    );
  }
  
    @PostMapping("/saveencaissementreservation")

  public ResponseEntity<List<EncaissementReservationDto>> saveencaissementreservation(
    @RequestBody EncaissementReservationRequestDto dto
  ) {
    return ResponseEntity.ok(encaissementReservationAvecRetourDeListService.saveEncaissementReservationAvecRetourDeList(dto));
  }
}
