package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.hotel.PrixParCategorieChambre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrixParCategorieChambreRepository
  extends JpaRepository<PrixParCategorieChambre, Long> {
   
  }
