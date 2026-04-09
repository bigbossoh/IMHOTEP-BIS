package com.bzdata.gestimospringbackend.Services.Impl;

import jakarta.transaction.Transactional;

import com.bzdata.gestimospringbackend.Services.GestimoWebInitDataAgenceImmoService;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
// @Slf4j
@RequiredArgsConstructor
public class GestimoWebInitDataAgenceImmoServiceImpl implements GestimoWebInitDataAgenceImmoService {
  // private final AgenceImmobiliereServiceImpl agenceImmobiliereService;
  // private final UtilisateurServiceImpl utilisateurService;
  // @Override
  public void initAgenceImmobilier() {
    //
    // AgenceImmobiliere agenceImmobiliere= new AgenceImmobiliere();
    // agenceImmobiliere.setNomAgence("Seve Investissement");
    // agenceImmobiliere.setTelAgence("0102030405");
    // agenceImmobiliere.setMobileAgence("+2250777880885");
    // agenceImmobiliere.setCompteContribuable("CPt0102");
    // agenceImmobiliere.setCapital(5000000);
    // agenceImmobiliere.setEmailAgence("seve@yahoo.fr");
    // agenceImmobiliere.setRegimeFiscaleAgence("Sa");
    // agenceImmobiliere.setFaxAgence("+2250102030405");
    // agenceImmobiliere.setSigleAgence("Seve");
    // Utilisateur utilisateur= new Utilisateur();
    // utilisateur= UtilisateurRequestDto.toEntity(utilisateurService.findById(1L));
    // agenceImmobiliere.setCreateur(utilisateur);
    // agenceImmobiliereService.save(AgenceRequestDto.fromEntity(agenceImmobiliere));
    //
  }
}
