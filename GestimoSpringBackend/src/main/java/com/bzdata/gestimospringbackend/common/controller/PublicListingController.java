package com.bzdata.gestimospringbackend.common.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.company.dto.response.PublicAgenceDto;
import com.bzdata.gestimospringbackend.user.dto.response.PublicUtilisateurDto;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(APP_ROOT + "/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicListingController {

  private final AgenceImmobiliereRepository agenceImmobiliereRepository;
  private final UtilisateurRepository utilisateurRepository;

  @GetMapping("/agences")
  public ResponseEntity<List<PublicAgenceDto>> listAllAgencesWithoutAuth() {
    List<PublicAgenceDto> agences = agenceImmobiliereRepository
      .findAll()
      .stream()
      .sorted(
        Comparator.comparing(
          AgenceImmobiliere::getNomAgence,
          Comparator.nullsLast(String::compareToIgnoreCase)
        )
      )
      .map(PublicAgenceDto::fromEntity)
      .toList();

    return ResponseEntity.ok(agences);
  }

  @GetMapping("/utilisateurs")
  public ResponseEntity<List<PublicUtilisateurDto>> listAllUsersWithoutAuth() {
    List<PublicUtilisateurDto> utilisateurs = utilisateurRepository
      .findAll()
      .stream()
      .sorted(
        Comparator.comparing(
          Utilisateur::getNom,
          Comparator.nullsLast(String::compareToIgnoreCase)
        )
      )
      .map(PublicUtilisateurDto::fromEntity)
      .toList();

    return ResponseEntity.ok(utilisateurs);
  }
}
