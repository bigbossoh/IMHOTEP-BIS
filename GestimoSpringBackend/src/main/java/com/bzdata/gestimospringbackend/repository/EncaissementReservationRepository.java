package com.bzdata.gestimospringbackend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.Models.hotel.EncaissementReservation;

public interface EncaissementReservationRepository  extends JpaRepository<EncaissementReservation,Long>{

    void deleteAllByReservation_Id(Long reservationId);

    List<EncaissementReservation> findAllByReservation_Id(Long reservationId);
}
