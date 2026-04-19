package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.hotel.Prestation;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestationRepository extends JpaRepository<Prestation,Long>{

    List<Prestation> findAllByIdAgenceOrderByNameAsc(Long idAgence);
}
