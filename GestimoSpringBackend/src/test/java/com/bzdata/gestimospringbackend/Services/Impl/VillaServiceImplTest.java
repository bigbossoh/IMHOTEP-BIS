package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.VillaDto;
import com.bzdata.gestimospringbackend.Models.Role;
import com.bzdata.gestimospringbackend.Models.Site;
import com.bzdata.gestimospringbackend.Models.Villa;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.RoleRepository;
import com.bzdata.gestimospringbackend.repository.SiteRepository;
import com.bzdata.gestimospringbackend.repository.VillaRepository;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VillaServiceImplTest {

  @Mock
  private GestimoWebMapperImpl gestimoWebMapperImpl;

  @Mock
  private VillaRepository villaRepository;

  @Mock
  private SiteRepository siteRepository;

  @Mock
  private UtilisateurRepository utilisateurRepository;

  @Mock
  private RoleRepository roleRepository;

  @Mock
  private ChapitreRepository chapitreRepository;

  private VillaServiceImpl service;

  @BeforeEach
  void setUp() {
    service =
      new VillaServiceImpl(
        gestimoWebMapperImpl,
        villaRepository,
        siteRepository,
        utilisateurRepository,
        roleRepository,
        chapitreRepository
      );
  }

  @Test
  void saveUneVilla_usesNextNumberWhenLegacyVillaHasNoSiteId() {
    Site site = new Site();
    site.setId(10L);
    site.setAbrSite("CI-ABJ-COCO-DOKU");
    site.setNomSite("COTE D'IVOIRE-ABIDJAN-COCODY-DOKUI");

    Role ownerRole = new Role();
    ownerRole.setId(7L);

    Utilisateur proprietaire = new Utilisateur();
    proprietaire.setId(20L);
    proprietaire.setNom("KOFFI");
    proprietaire.setPrenom("Jean");
    proprietaire.setUrole(ownerRole);

    Role persistedRole = new Role();
    persistedRole.setId(7L);
    persistedRole.setRoleName("PROPRIETAIRE");

    Chapitre chapitre = new Chapitre();
    chapitre.setId(1L);

    Villa legacyVilla = new Villa();
    legacyVilla.setId(1L);
    legacyVilla.setIdAgence(1L);
    legacyVilla.setNumVilla(1L);
    legacyVilla.setBienMeublerResidence(false);
    legacyVilla.setCodeAbrvBienImmobilier("CI-ABJ-COCO-DOKU-VILLA-1");

    VillaDto request = new VillaDto();
    request.setIdAgence(1L);
    request.setIdCreateur(99L);
    request.setIdSite(10L);
    request.setIdUtilisateur(20L);
    request.setIdChapitre(1L);
    request.setNbrePieceVilla(5);
    request.setNbrChambreVilla(3);
    request.setNbrSalonVilla(1);
    request.setNbrSalleEauVilla(2);
    request.setSuperficieBien(120D);
    request.setNomBaptiserBienImmobilier("Villa 2");

    when(siteRepository.findById(10L)).thenReturn(Optional.of(site));
    when(utilisateurRepository.findById(20L)).thenReturn(Optional.of(proprietaire));
    when(roleRepository.findById(7L)).thenReturn(Optional.of(persistedRole));
    when(chapitreRepository.getById(1L)).thenReturn(chapitre);
    when(villaRepository.findAll()).thenReturn(List.of(legacyVilla));
    when(villaRepository.save(any(Villa.class))).thenAnswer(invocation -> {
      Villa villa = invocation.getArgument(0);
      villa.setId(2L);
      return villa;
    });
    when(gestimoWebMapperImpl.fromVilla(any(Villa.class))).thenAnswer(invocation -> {
      Villa savedVilla = invocation.getArgument(0);
      VillaDto response = new VillaDto();
      response.setId(savedVilla.getId());
      response.setIdSite(
        savedVilla.getSite() != null ? savedVilla.getSite().getId() : null
      );
      response.setNumVilla(savedVilla.getNumVilla());
      response.setCodeAbrvBienImmobilier(savedVilla.getCodeAbrvBienImmobilier());
      return response;
    });

    VillaDto savedVilla = service.saveUneVilla(request);

    ArgumentCaptor<Villa> villaCaptor = ArgumentCaptor.forClass(Villa.class);
    verify(villaRepository).save(villaCaptor.capture());

    assertEquals(2L, savedVilla.getId());
    assertEquals(2L, savedVilla.getNumVilla());
    assertEquals(10L, savedVilla.getIdSite());
    assertTrue(savedVilla.getCodeAbrvBienImmobilier().endsWith("VILLA-2"));
    assertEquals(2L, villaCaptor.getValue().getNumVilla());
    assertEquals(10L, villaCaptor.getValue().getSite().getId());
  }
}
