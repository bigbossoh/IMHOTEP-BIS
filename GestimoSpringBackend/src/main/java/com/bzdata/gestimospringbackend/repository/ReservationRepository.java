package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.hotel.Reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation,Long>{

    @Query("SELECT r FROM Reservation r WHERE r.idAppartementdDto = :idAppartement " +
           "AND ((r.dateDebut BETWEEN :dateDebut AND :dateFin) " +
           "OR (r.dateFin BETWEEN :dateDebut AND :dateFin) " +
           "OR (:dateDebut BETWEEN r.dateDebut AND r.dateFin))")
    List<Reservation> findReservationsOverlap(
        @Param("idAppartement") Long idAppartement,
        @Param("dateDebut") java.time.LocalDate dateDebut,
        @Param("dateFin") java.time.LocalDate dateFin
    );
}