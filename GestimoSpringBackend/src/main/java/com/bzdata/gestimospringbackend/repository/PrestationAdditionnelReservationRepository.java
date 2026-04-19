package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.hotel.PrestationAdditionnelReservation;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestationAdditionnelReservationRepository extends JpaRepository<PrestationAdditionnelReservation,Long> {

    Optional<PrestationAdditionnelReservation> findByReservation_IdAndServiceAdditionnelle_Id(Long reservationId, Long serviceAdditionnelleId);

    List<PrestationAdditionnelReservation> findAllByReservation_Id(Long reservationId);

    long countByServiceAdditionnelle_Id(Long serviceAdditionnelleId);

    void deleteAllByReservation_Id(Long reservationId);
}
