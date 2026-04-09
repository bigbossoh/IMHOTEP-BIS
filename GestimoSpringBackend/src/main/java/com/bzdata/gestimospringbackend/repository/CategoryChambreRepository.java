package com.bzdata.gestimospringbackend.repository;

import com.bzdata.gestimospringbackend.Models.hotel.CategorieChambre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryChambreRepository
  extends JpaRepository<CategorieChambre, Long> {}
