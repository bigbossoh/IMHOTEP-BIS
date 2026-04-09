package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.hotel.Reservation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation,Long>{

}
