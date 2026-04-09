package com.bzdata.gestimospringbackend.mappers;

import com.bzdata.gestimospringbackend.company.dto.request.AgenceRequestDto;
import com.bzdata.gestimospringbackend.company.dto.response.AgenceImmobilierDTO;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.department.dto.response.DefaultChapitreDto;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.DTOs.*;
import com.bzdata.gestimospringbackend.establishment.dto.response.EtablissementUtilisateurDto;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;
import com.bzdata.gestimospringbackend.Models.*;
import com.bzdata.gestimospringbackend.Models.hotel.CategorieChambre;
import com.bzdata.gestimospringbackend.Models.hotel.EncaissementReservation;
import com.bzdata.gestimospringbackend.Models.hotel.Prestation;
import com.bzdata.gestimospringbackend.Models.hotel.PrestationAdditionnelReservation;
import com.bzdata.gestimospringbackend.Models.hotel.PrixParCategorieChambre;
import com.bzdata.gestimospringbackend.Models.hotel.Reservation;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.repository.*;
import com.bzdata.gestimospringbackend.user.dto.request.UtilisateurRequestDto;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.Utils.BailDisplayUtils;
import java.util.List;
import java.util.Base64;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jfree.util.Log;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class GestimoWebMapperImpl {

  final AgenceImmobiliereRepository agenceImmobiliereRepository;
  final ImageRepository imageRepository;
  final BienImmobilierRepository bienImmobilierRepository;
  final BailLocationRepository bailLocationRepository;
  final UtilisateurRepository utilisateurRepository;
  final AppelLoyerRepository appelLoyerRepository;
  final EtageRepository etageRepository;
  final AppartementRepository appartementRepository;
  final PrixParCategorieChambreRepository prixParCategorieChambreRepository;
  final CategoryChambreRepository categoryChambreRepository;
  final ChapitreRepository chapitreRepository;
  final EncaissementReservationRepository encaissementReservationRepository;

  // AppelLoyer
  public AppelLoyer fromAppelLoyerDto(
    AppelLoyersFactureDto appelLoyersFactureDto
  ) {
    AppelLoyer appelLoyer = new AppelLoyer();
    BeanUtils.copyProperties(appelLoyersFactureDto, appelLoyer);
    BailLocation bail = new BailLocation();
    bail =
      bailLocationRepository
        .findById(appelLoyersFactureDto.getIdBailLocation())
        .orElse(null);
    if (bail != null) appelLoyer.setBailLocationAppelLoyer(bail);
    return appelLoyer;
  }

  public AppelLoyersFactureDto fromAppelLoyer(AppelLoyer appelLoyer) {
    AppelLoyersFactureDto appelLoyersFactureDto = new AppelLoyersFactureDto();
    BeanUtils.copyProperties(appelLoyer, appelLoyersFactureDto);
    appelLoyersFactureDto.setAbrvCodeBail(
      BailDisplayUtils.resolveBailCode(appelLoyer.getBailLocationAppelLoyer())
    );
    // LOCATAIRE
    appelLoyersFactureDto.setPrenomLocataire(
      BailDisplayUtils.sanitizeDisplayValue(
        appelLoyer
          .getBailLocationAppelLoyer()
          .getUtilisateurOperation()
          .getPrenom()
      )
    );
    appelLoyersFactureDto.setNomLocataire(
      BailDisplayUtils.sanitizeDisplayValue(
        appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation().getNom()
      )
    );
    appelLoyersFactureDto.setGenreLocataire(
      BailDisplayUtils.resolveCivilite(
        appelLoyer
          .getBailLocationAppelLoyer()
          .getUtilisateurOperation()
      )
    );
    appelLoyersFactureDto.setEmailLocatire(
      appelLoyer
        .getBailLocationAppelLoyer()
        .getUtilisateurOperation()
        .getEmail()
    );
    appelLoyersFactureDto.setIdLocataire(
      appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation().getId()
    );
    appelLoyersFactureDto.setNouveauMontantLoyer(
      appelLoyer.getMontantLoyerBailLPeriode()
    );
    // AGENCE
    AgenceImmobiliere agenceImmobiliere = agenceImmobiliereRepository
      .findById(appelLoyer.getIdAgence())
      .orElse(null);
    if (agenceImmobiliere == null) throw new EntityNotFoundException(
      "Agence Immobilier  from GestimoMapper not found",
      ErrorCodes.AGENCE_NOT_FOUND
    );
    appelLoyersFactureDto.setNomAgence(agenceImmobiliere.getNomAgence());
    appelLoyersFactureDto.setTelAgence(agenceImmobiliere.getTelAgence());
    appelLoyersFactureDto.setCompteContribuableAgence(
      agenceImmobiliere.getCompteContribuable()
    );
    appelLoyersFactureDto.setEmailAgence(agenceImmobiliere.getEmailAgence());
    appelLoyersFactureDto.setMobileAgence(agenceImmobiliere.getMobileAgence());
    appelLoyersFactureDto.setRegimeFiscaleAgence(
      agenceImmobiliere.getRegimeFiscaleAgence()
    );
    appelLoyersFactureDto.setFaxAgence(agenceImmobiliere.getFaxAgence());
    appelLoyersFactureDto.setSigleAgence(agenceImmobiliere.getSigleAgence());

    // BienImmobilier
    Bienimmobilier bienImmobilier = bienImmobilierRepository
      .findById(
        appelLoyer
          .getBailLocationAppelLoyer()
          .getBienImmobilierOperation()
          .getId()
      )
      .orElse(null);
    if (bienImmobilier == null) throw new EntityNotFoundException(
      "Bien immobilier from GestimoMapper not found",
      ErrorCodes.BIEN_IMMOBILIER_NOT_FOUND
    );
    appelLoyersFactureDto.setAbrvBienimmobilier(
      bienImmobilier.getCodeAbrvBienImmobilier()
    );
    StringBuilder str = new StringBuilder(
      bienImmobilier.getNomCompletBienImmobilier()
    );
    str.delete(0, 14);
    appelLoyersFactureDto.setBienImmobilierFullName(str.toString());
    // Bail
    BailLocation bailLocation = bailLocationRepository
      .findById(appelLoyer.getBailLocationAppelLoyer().getId())
      .orElse(null);
    if (bailLocation == null) throw new EntityNotFoundException(
      "bail from GestimoMapper not found",
      ErrorCodes.BAILLOCATION_NOT_FOUND
    );
    appelLoyersFactureDto.setIdBailLocation(bailLocation.getId());
    appelLoyersFactureDto.setAbrvCodeBail(
      BailDisplayUtils.resolveBailCode(appelLoyer.getBailLocationAppelLoyer())
    );

    Utilisateur utilisateur = utilisateurRepository
      .findById(
        appelLoyer
          .getBailLocationAppelLoyer()
          .getBienImmobilierOperation()
          .getUtilisateurProprietaire()
          .getId()
      )
      .orElse(null);
    if (utilisateur == null) throw new EntityNotFoundException(
      "utilisateur from GestimoMapper not found",
      ErrorCodes.UTILISATEUR_NOT_FOUND
    );
    appelLoyersFactureDto.setNomPropietaire(utilisateur.getNom());
    appelLoyersFactureDto.setPrenomPropietaire(utilisateur.getPrenom());
    appelLoyersFactureDto.setGenrePropietaire(utilisateur.getGenre());
    return appelLoyersFactureDto;
  }

  public AnneeAppelLoyersDto fromAppelLoyerForAnnee(AppelLoyer appelLoyer) {
    AnneeAppelLoyersDto anneeAppelLoyersDto = new AnneeAppelLoyersDto();
    BeanUtils.copyProperties(appelLoyer, anneeAppelLoyersDto);
    return anneeAppelLoyersDto;
  }

  // AgenceImmobiliere
  public AgenceImmobiliere fromAgenceImmobilierDTO(
    AgenceImmobilierDTO agenceImmobilierDTO
  ) {
    AgenceImmobiliere agenceImmo = new AgenceImmobiliere();
    BeanUtils.copyProperties(agenceImmobilierDTO, agenceImmo);
    return agenceImmo;
  }

  public AgenceRequestDto fromEntity(AgenceImmobiliere agenceImmobiliere) {
    AgenceRequestDto agenceImmobilierDTO = new AgenceRequestDto();
    BeanUtils.copyProperties(agenceImmobiliere, agenceImmobilierDTO);
    ImageModel imageModel = imageRepository.findByLogoAgence(agenceImmobiliere).orElse(null);
    if (imageModel != null) {
      agenceImmobilierDTO.setIdImage(imageModel.getId());
      agenceImmobilierDTO.setNameImage(imageModel.getName());
      agenceImmobilierDTO.setTypeImage(imageModel.getType());
      agenceImmobilierDTO.setProfileAgenceUrl(toImageDataUrl(imageModel));
    }
    return agenceImmobilierDTO;
  }

  public CronMailDto fromCronMail(CronMail cronMail) {
    CronMailDto cronMailDto = new CronMailDto();
    BeanUtils.copyProperties(cronMail, cronMailDto);
    return cronMailDto;
  }

  private ImageModel getImageData(AgenceImmobiliere agenceImmobiliere) {
    ImageModel imageData = imageRepository
      .findByLogoAgence(agenceImmobiliere)
      .orElse(null);
    if (imageData == null) throw new EntityNotFoundException(
      "Image from GestimoMapper not found",
      ErrorCodes.IMAGE_NOT_FOUND
    );
    return imageData;
  }

  public AgenceImmobilierDTO fromAgenceImmobilier(
    AgenceImmobiliere agenceImmobilier
  ) {
    AgenceImmobilierDTO agenceImmoDTO = new AgenceImmobilierDTO();
    BeanUtils.copyProperties(agenceImmobilier, agenceImmoDTO);
    ImageModel imageModel = imageRepository.findByLogoAgence(agenceImmobilier).orElse(null);
    if (imageModel != null) {
      agenceImmoDTO.setIdImage(imageModel.getId());
      agenceImmoDTO.setNameImage(imageModel.getName());
      agenceImmoDTO.setTypeImage(imageModel.getType());
      agenceImmoDTO.setProfileAgenceUrl(toImageDataUrl(imageModel));
    }
    return agenceImmoDTO;
  }

  private String toImageDataUrl(ImageModel imageModel) {
    if (imageModel == null || imageModel.getPicByte() == null || imageModel.getPicByte().length == 0) {
      return null;
    }

    String contentType =
      imageModel.getType() != null && !imageModel.getType().isBlank()
        ? imageModel.getType()
        : "image/png";
    return "data:" +
    contentType +
    ";base64," +
    Base64.getEncoder().encodeToString(imageModel.getPicByte());
  }

  // Immeuble
  public ImmeubleAfficheDto fromImmeuble(Immeuble immeuble) {
    ImmeubleAfficheDto immeubleAfficheDto = new ImmeubleAfficheDto();
    BeanUtils.copyProperties(immeuble, immeubleAfficheDto);
    immeubleAfficheDto.setNomPropio(
      immeuble.getUtilisateurProprietaire().getNom()
    );
    immeubleAfficheDto.setPrenomProprio(
      immeuble.getUtilisateurProprietaire().getPrenom()
    );
    immeubleAfficheDto.setAbrvNomImmeuble(immeuble.getCodeNomAbrvImmeuble());
    return immeubleAfficheDto;
  }

  public Immeuble fromImmeubleDTO(ImmeubleAfficheDto immeubleAfficheDto) {
    Immeuble immeuble = new Immeuble();
    BeanUtils.copyProperties(immeubleAfficheDto, immeuble);
    return immeuble;
  }

  // Encaissement Principal
  public EncaissementPrincipal fromEncaissementPrincipalDto(
    EncaissementPayloadDto encaissementPayloadDto
  ) {
    EncaissementPrincipal encaissementPrincipal = new EncaissementPrincipal();
    BeanUtils.copyProperties(encaissementPayloadDto, encaissementPrincipal);

    AppelLoyer appelLoyer = appelLoyerRepository
      .findById(encaissementPayloadDto.getIdAppelLoyer())
      .orElse(null);
    if (appelLoyer == null) throw new EntityNotFoundException(
      "AppelLoyer from GestimoMapper not found",
      ErrorCodes.APPELLOYER_NOT_FOUND
    );
    encaissementPrincipal.setAppelLoyerEncaissement(appelLoyer);
    return encaissementPrincipal;
  }

  public EncaissementPrincipalDTO fromEncaissementPrincipal(
    EncaissementPrincipal encaissementPrincipal
  ) {
    EncaissementPrincipalDTO encaissementPrincipalDTO = new EncaissementPrincipalDTO();
    BeanUtils.copyProperties(encaissementPrincipal, encaissementPrincipalDTO);
    encaissementPrincipalDTO.setAppelLoyersFactureDto(
      fromAppelLoyer(encaissementPrincipal.getAppelLoyerEncaissement())
    );
    return encaissementPrincipalDTO;
  }

  public AppelLoyerEncaissDto fromEncaissementPrincipalAppelLoyerEncaissDto(
    EncaissementPrincipal encaissementPrincipal
  ) {
    AppelLoyerEncaissDto encaissementPrincipalDTO = new AppelLoyerEncaissDto();
    BeanUtils.copyProperties(encaissementPrincipal, encaissementPrincipalDTO);
    encaissementPrincipalDTO.setPeriodeAppelLoyer(
      encaissementPrincipal.getAppelLoyerEncaissement().getPeriodeAppelLoyer()
    );
    encaissementPrincipalDTO.setStatusAppelLoyer(
      encaissementPrincipal.getAppelLoyerEncaissement().getStatusAppelLoyer()
    );
    encaissementPrincipalDTO.setDatePaiementPrevuAppelLoyer(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getDatePaiementPrevuAppelLoyer()
    );
    encaissementPrincipalDTO.setDateDebutMoisAppelLoyer(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getDateDebutMoisAppelLoyer()
    );
    encaissementPrincipalDTO.setDateFinMoisAppelLoyer(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getDateFinMoisAppelLoyer()
    );
    encaissementPrincipalDTO.setPeriodeLettre(
      encaissementPrincipal.getAppelLoyerEncaissement().getPeriodeLettre()
    );
    encaissementPrincipalDTO.setMoisUniquementLettre(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getMoisUniquementLettre()
    );
    encaissementPrincipalDTO.setAnneeAppelLoyer(
      encaissementPrincipal.getAppelLoyerEncaissement().getAnneeAppelLoyer()
    );
    encaissementPrincipalDTO.setMoisChiffreAppelLoyer(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getMoisChiffreAppelLoyer()
    );
    encaissementPrincipalDTO.setDescAppelLoyer(
      encaissementPrincipal.getAppelLoyerEncaissement().getDescAppelLoyer()
    );
    encaissementPrincipalDTO.setMontantLoyerBailLPeriode(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getMontantLoyerBailLPeriode()
    );
    encaissementPrincipalDTO.setMontantPaye(
      encaissementPrincipal.getMontantEncaissement()
    );
    encaissementPrincipalDTO.setDateEncaissement(
      encaissementPrincipal.getDateEncaissement()
    );
    encaissementPrincipalDTO.setSoldeAppelLoyer(
      encaissementPrincipal.getSoldeEncaissement()
    );
    encaissementPrincipalDTO.setNomLocataire(
      BailDisplayUtils.sanitizeDisplayValue(
        encaissementPrincipal
          .getAppelLoyerEncaissement()
          .getBailLocationAppelLoyer()
          .getUtilisateurOperation()
          .getNom()
      )
    );
    encaissementPrincipalDTO.setPrenomLocataire(
      BailDisplayUtils.sanitizeDisplayValue(
        encaissementPrincipal
          .getAppelLoyerEncaissement()
          .getBailLocationAppelLoyer()
          .getUtilisateurOperation()
          .getPrenom()
      )
    );
    encaissementPrincipalDTO.setGenreLocataire(
      BailDisplayUtils.resolveCivilite(
        encaissementPrincipal
          .getAppelLoyerEncaissement()
          .getBailLocationAppelLoyer()
          .getUtilisateurOperation()
      )
    );
    encaissementPrincipalDTO.setEmailLocatire(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getBailLocationAppelLoyer()
        .getUtilisateurOperation()
        .getEmail()
    );
    encaissementPrincipalDTO.setIdLocataire(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getBailLocationAppelLoyer()
        .getUtilisateurOperation()
        .getId()
    );
    encaissementPrincipalDTO.setBienImmobilierFullName(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getBailLocationAppelLoyer()
        .getBienImmobilierOperation()
        .getNomCompletBienImmobilier()
    );
    encaissementPrincipalDTO.setAbrvBienimmobilier(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getBailLocationAppelLoyer()
        .getBienImmobilierOperation()
        .getCodeAbrvBienImmobilier()
    );
    if (
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getBailLocationAppelLoyer()
        .getBienImmobilierOperation()
        .getSite() !=
      null
    ) {
      encaissementPrincipalDTO.setCommune(
        encaissementPrincipal
          .getAppelLoyerEncaissement()
          .getBailLocationAppelLoyer()
          .getBienImmobilierOperation()
          .getSite()
          .getQuartier()
          .getCommune()
          .getNomCommune()
      );
    }
    encaissementPrincipalDTO.setChapitre(
      encaissementPrincipal
        .getAppelLoyerEncaissement()
        .getBailLocationAppelLoyer()
        .getBienImmobilierOperation()
        .getChapitre()
        .getLibelleChapitre()
    );
    encaissementPrincipalDTO.setIdBailLocation(
      encaissementPrincipal.getAppelLoyerEncaissement().getId()
    );
    encaissementPrincipalDTO.setAbrvCodeBail(
      BailDisplayUtils.resolveBailCode(
        encaissementPrincipal
          .getAppelLoyerEncaissement()
          .getBailLocationAppelLoyer()
      )
    );
    encaissementPrincipalDTO.setTypePaiement(
      encaissementPrincipal.getTypePaiement()
    );
    encaissementPrincipalDTO.setCloturer(
      encaissementPrincipal.getAppelLoyerEncaissement().isCloturer()
    );
    encaissementPrincipalDTO.setSolderAppelLoyer(
      encaissementPrincipal.getAppelLoyerEncaissement().isSolderAppelLoyer()
    );
    encaissementPrincipalDTO.setUnLock(
      encaissementPrincipal.getAppelLoyerEncaissement().isUnLock()
    );
    return encaissementPrincipalDTO;
  }

  // MAPPER DES ETAGES
  public EtageAfficheDto fromEtage(Etage etage) {
    EtageAfficheDto etageAfficheDto = new EtageAfficheDto();
    BeanUtils.copyProperties(etage, etageAfficheDto);
    Etage etageFound = etageRepository.findById(etage.getId()).orElse(null);
    if (etageFound == null) throw new EntityNotFoundException(
      "Etage from GestimoMapper not found",
      ErrorCodes.BIEN_IMMOBILIER_NOT_FOUND
    );
   
    etageAfficheDto.setId(etage.getId());
    etageAfficheDto.setNomPropio(
      etageFound.getImmeuble().getUtilisateurProprietaire().getNom()
    );
    etageAfficheDto.setPrenomProprio(
      etageFound.getImmeuble().getUtilisateurProprietaire().getPrenom()
    );
    etageAfficheDto.setAbrvEtage(etage.getCodeAbrvEtage());
    etageAfficheDto.setNomEtage(etage.getNomBaptiserEtage());
    etageAfficheDto.setNomImmeuble(
      etage.getImmeuble().getNomBaptiserImmeuble()
    );
    return etageAfficheDto;
  }

  public Appartement fromAppartementDto(AppartementDto appartementDto) {
    Appartement appartement = new Appartement();
    BeanUtils.copyProperties(appartementDto, appartement);
    return appartement;
  }

  public AppartementDto fromAppartement(Appartement appartement) {
    AppartementDto appartementDto = new AppartementDto();
    CategoryChambreSaveOrUpdateDto categoryChambreSaveOrUpdateDto;
  
    if (appartement.getCategorieChambreAppartement()!= null) {
      categoryChambreSaveOrUpdateDto =
        categoryChambreRepository
          .findById(appartement.getCategorieChambreAppartement().getId())
          .map(xt -> fromCategoryChambre(xt))
          .orElse(null);
          appartementDto.setIdCategorieChambre(categoryChambreSaveOrUpdateDto);
    } else {
      categoryChambreSaveOrUpdateDto =
        categoryChambreRepository
          .findById(0L)
          .map(xt -> fromCategoryChambre(xt))
          .orElse(null);
    }

    Chapitre chapitre = chapitreRepository
      .findById(appartement.getChapitre().getId())
      .orElse(null);
    BeanUtils.copyProperties(appartement, appartementDto);
    if (appartement.getEtageAppartement() != null) {
      appartementDto.setIdEtageAppartement(
        appartement.getEtageAppartement().getId()
      );
      if (
        appartement.getEtageAppartement().getImmeuble() != null &&
        appartement.getEtageAppartement().getImmeuble().getUtilisateurProprietaire() != null
      ) {
        appartementDto.setFullNameProprio(
          appartement
            .getEtageAppartement()
            .getImmeuble()
            .getUtilisateurProprietaire()
            .getNom() +
          " " +
          appartement
            .getEtageAppartement()
            .getImmeuble()
            .getUtilisateurProprietaire()
            .getPrenom()
        );
      }
    }
    if (appartement.getCategorieChambreAppartement() != null) {
      // appartementDto.setIdCategorieChambre(
      //   appartement.getCategorieChambreAppart()
      // );
   

      appartementDto.setNameCategorie(
        appartement.getCategorieChambreAppartement().getName()
      );
    } else {
     // appartementDto.setIdCategorieChambre(0L);
      appartementDto.setNbrDiffJourCategorie(0);
      appartementDto.setNameCategorie("");
      appartementDto.setPourcentReducCategorie(0);
      appartementDto.setPriceCategorie(0);
    }
  
    if (categoryChambreSaveOrUpdateDto != null) {
      // CategorieChambre novCat=categoryChambreRepository.getById(categoryChambreSaveOrUpdateDto.getId());
      // appartementDto.setIdCategorieChambre(novCat);
     
    } else {
      //appartementDto.setIdCategorieChambre(0L);
    }
    if (chapitre != null) {
      appartementDto.setIdChapitre(chapitre.getId());
    } else {
      appartementDto.setIdChapitre(0L);
    }
    return appartementDto;
  }

  // MAGASIN
  public MagasinDto fromMagasin(Magasin magasin) {
    MagasinDto magasinDto = new MagasinDto();
    if (magasin == null) {
      return magasinDto;
    }
    BeanUtils.copyProperties(magasin, magasinDto);
    if (magasin.getEtageMagasin() != null) {
      magasinDto.setIdEtage(magasin.getEtageMagasin().getId());
      if (magasin.getEtageMagasin().getImmeuble() != null) {
        magasinDto.setIdmmeuble(magasin.getEtageMagasin().getImmeuble().getId());
        if (
          (magasinDto.getIdSite() == null || magasinDto.getIdSite() == 0) &&
          magasin.getEtageMagasin().getImmeuble().getSite() != null
        ) {
          magasinDto.setIdSite(
            magasin.getEtageMagasin().getImmeuble().getSite().getId()
          );
        }
      }
    }
    if (magasin.getSite() != null && magasin.getSite().getId() != null) {
      magasinDto.setIdSite(magasin.getSite().getId());
    }
    if (
      magasin.getUtilisateurProprietaire() != null &&
      magasin.getUtilisateurProprietaire().getId() != null
    ) {
      magasinDto.setIdUtilisateur(magasin.getUtilisateurProprietaire().getId());
      magasinDto.setProprietaire(
        magasin.getUtilisateurProprietaire().getNom() +
        " " +
        magasin.getUtilisateurProprietaire().getPrenom()
      );
    }
    return magasinDto;
  }

  public Magasin fromMagasinDto(MagasinDto magasinDto) {
    Magasin magasin = new Magasin();
    BeanUtils.copyProperties(magasinDto, magasin);
    return magasin;
  }

  // VILLA
  public VillaDto fromVilla(Villa villa) {
    VillaDto villaDto = new VillaDto();
    if (villa == null) {
      return villaDto;
    }
    BeanUtils.copyProperties(villa, villaDto);
    if (
      villa.getUtilisateurProprietaire() != null &&
      villa.getUtilisateurProprietaire().getId() != null &&
      villa.getUtilisateurProprietaire().getId() != 0
    ) {
      villaDto.setIdUtilisateur(villa.getUtilisateurProprietaire().getId());
      villaDto.setProprietaire(
        villa.getUtilisateurProprietaire().getNom() +
        " " +
        villa.getUtilisateurProprietaire().getPrenom()
      );
    }
    if (villa.getSite() != null && villa.getSite().getId() != null) {
      villaDto.setIdSite(villa.getSite().getId());
    }
    return villaDto;
  }

  public Villa fromVillaDto(VillaDto villaDto) {
    Villa villa = new Villa();
    BeanUtils.copyProperties(villaDto, villa);
    return villa;
  }

  // UTILISATEUR MAPPER
  public static UtilisateurAfficheDto fromUtilisateurStatic(
    Utilisateur utilisateur
  ) {
    UtilisateurAfficheDto utilisateurAfficheDto = new UtilisateurAfficheDto();
    BeanUtils.copyProperties(utilisateur, utilisateurAfficheDto);
    return utilisateurAfficheDto;
  }

  // UTILISATEUR MAPPER
  public UtilisateurAfficheDto fromUtilisateur(Utilisateur utilisateur) {
    UtilisateurAfficheDto utilisateurAfficheDto = new UtilisateurAfficheDto();
    BeanUtils.copyProperties(utilisateur, utilisateurAfficheDto);
    return utilisateurAfficheDto;
  }

  public Utilisateur toUtilisateur(UtilisateurAfficheDto dto) {
    return null;
  }

  // BIEN IMMOBILIER MAPPER
  public BienImmobilierAffiheDto fromBienImmobilier(
    Bienimmobilier bienimmobilier
  ) {
    BienImmobilierAffiheDto bienImmobilierAffiheDto = new BienImmobilierAffiheDto();
    BeanUtils.copyProperties(bienimmobilier, bienImmobilierAffiheDto);
    bienImmobilierAffiheDto.setNomPrenomProprio(
      bienimmobilier.getUtilisateurProprietaire().getNom() +
      " " +
      bienimmobilier.getUtilisateurProprietaire().getPrenom()
    );
    bienImmobilierAffiheDto.setChapitre(
      bienimmobilier.getChapitre().getLibelleChapitre()
    );
    return bienImmobilierAffiheDto;
  }

  // PERIODE BAIL APPEL
  public PeriodeDto fromPeriodeAppel(AppelLoyer appelLoyer) {
    PeriodeDto periodeDto = new PeriodeDto();
    BeanUtils.copyProperties(appelLoyer, periodeDto);
    periodeDto.setPeriodeAppelLoyer(appelLoyer.getPeriodeAppelLoyer());
    periodeDto.setPeriodeLettre(appelLoyer.getPeriodeLettre());
    return periodeDto;
  }

  // PERIODE BAIL APPEL
  public MessageEnvoyerDto fromMessageEnvoyer(MessageEnvoyer messageEnvoyer) {
    MessageEnvoyerDto messageEnvoyerDto = new MessageEnvoyerDto();
    BeanUtils.copyProperties(messageEnvoyer, messageEnvoyerDto);
    messageEnvoyerDto.setDestinaireNomPrenom(messageEnvoyer.getNomDestinaire());
    messageEnvoyerDto.setIdDestinaire(messageEnvoyer.getIdDestinaire());
    messageEnvoyerDto.setDateEnvoi(messageEnvoyer.getCreationDate());
    return messageEnvoyerDto;
  }

  public CategorieChambre toCategorieChambre(
    CategoryChambreSaveOrUpdateDto dto
  ) {
    CategorieChambre categorieChambre = new CategorieChambre();
    BeanUtils.copyProperties(dto, categorieChambre);
    return categorieChambre;
  }

  public CategoryChambreSaveOrUpdateDto fromCategoryChambre(
    CategorieChambre categorieChambre
  ) {
    List<PrixParCategorieChambreDto> prixCat = prixParCategorieChambreRepository
      .findAll()
      .stream()
      .filter(ca -> ca.getCategorieChambrePrix().getId() == categorieChambre.getId()
      )
      .map(xx -> fromPrixParCategorieChambre(xx))
      .collect(Collectors.toList());
    CategoryChambreSaveOrUpdateDto dto = new CategoryChambreSaveOrUpdateDto();
    BeanUtils.copyProperties(categorieChambre, dto);
    // if (appDto.size()>0) {
    //      dto.setAppartements(appDto);
    // }
    if (prixCat.size() > 0) {
      dto.setPrixGategorieDto(prixCat);
    }
    return dto;
  }

  public static Prestation toServiceAdditionnelle(
    PrestationSaveOrUpdateDto dto
  ) {
    Prestation serviceAdditionnelle = new Prestation();
    BeanUtils.copyProperties(dto, serviceAdditionnelle);
    return serviceAdditionnelle;
  }

  public static PrestationSaveOrUpdateDto fromServiceAditionnel(
    Prestation serviceAdditionnelle
  ) {
    PrestationSaveOrUpdateDto serviceAditionnelSaveOrUpdateDto = new PrestationSaveOrUpdateDto();
    BeanUtils.copyProperties(
      serviceAdditionnelle,
      serviceAditionnelSaveOrUpdateDto
    );
    return serviceAditionnelSaveOrUpdateDto;
  }

  public ReservationAfficheDto fromReservation(Reservation reservation) {
    ReservationAfficheDto reservationSaveOrUpdateDto = new ReservationAfficheDto();
    Appartement appartement = appartementRepository
      .findById(reservation.getBienImmobilierOperation().getId())
      .orElse(null);
    BeanUtils.copyProperties(reservation, reservationSaveOrUpdateDto);
    reservationSaveOrUpdateDto.setMontantReservation(
      reservation.getMontantDeReservation()
    );
    reservationSaveOrUpdateDto.setBienImmobilierOperation(
      reservation.getBienImmobilierOperation().getNomBaptiserBienImmobilier()
    );

    reservationSaveOrUpdateDto.setMontantReduction(
      reservation.getMontantReduction()
    );

    reservationSaveOrUpdateDto.setUtilisateurOperation(
      reservation.getUtilisateurOperation().getNom() +
      " " +
      reservation.getUtilisateurOperation().getPrenom()
    );
    reservationSaveOrUpdateDto.setEmail(
      reservation.getUtilisateurOperation().getEmail()
    );
    reservationSaveOrUpdateDto.setUsername(
      reservation.getUtilisateurOperation().getUsername()
    );
    // reservationSaveOrUpdateDto.setMontantReservation(reservation.getMontantReservion().dou);
    if (appartement != null) {
      reservationSaveOrUpdateDto.setDescriptionCategori(
        appartement.getCategorieChambreAppartement().getDescription()
      );
      reservationSaveOrUpdateDto.setNameCategori(
        appartement.getCategorieChambreAppartement().getName()
      );
      reservationSaveOrUpdateDto.setIdAppartementdDto(
        reservation.getBienImmobilierOperation().getId()
      );
      reservationSaveOrUpdateDto.setIdBienImmobilier(
        reservation.getBienImmobilierOperation().getId()
      );
      reservationSaveOrUpdateDto.setCodeAbrvBienImmobilier(
        reservation.getBienImmobilierOperation().getCodeAbrvBienImmobilier()
      );
    }
    reservationSaveOrUpdateDto.setIdUtilisateur(
      reservation.getUtilisateurOperation().getId()
    );
    reservationSaveOrUpdateDto.setMobile(
      reservation.getUtilisateurOperation().getUsername()
    );

    //reservationSaveOrUpdateDto.setCreationDate(reservation.getCreationDate());
    return reservationSaveOrUpdateDto;
  }

  public Reservation toReservation(ReservationSaveOrUpdateDto dto) {
    Reservation reservation = new Reservation();
    BeanUtils.copyProperties(dto, reservation);
    return reservation;
  }

  public Utilisateur fromUtilisateurRequestDto(UtilisateurRequestDto use) {
    Utilisateur usr = new Utilisateur();
    BeanUtils.copyProperties(use, usr);
    return usr;
  }

  public ImageDataDto fromImageData(ImageData imageData) {
    ImageDataDto imageDataDto = new ImageDataDto();
    BeanUtils.copyProperties(imageData, imageDataDto);
    imageDataDto.setBienimmobilier(imageData.getBienimmobilier().getId());
    return imageDataDto;
  }

  public static PrixParCategorieChambreDto fromPrixParCategorieChambre(
    PrixParCategorieChambre prixParCategorieChambre
  ) {
    PrixParCategorieChambreDto prixParCategorieChambreDto = new PrixParCategorieChambreDto();
    BeanUtils.copyProperties(
      prixParCategorieChambre,
      prixParCategorieChambreDto
    );
    prixParCategorieChambreDto.setIdCategorieChambre(
      prixParCategorieChambre.getId()
    );
    return prixParCategorieChambreDto;
  }

  public static PrestationAdditionnelReservationSaveOrrUpdate fromPrestationAdditionnelReservation(
    PrestationAdditionnelReservation prestationAdditionnelReservation
  ) {
    PrestationAdditionnelReservationSaveOrrUpdate prestationAdditionnelReservationSaveOrrUpdate = new PrestationAdditionnelReservationSaveOrrUpdate();
    BeanUtils.copyProperties(
      prestationAdditionnelReservation,
      prestationAdditionnelReservationSaveOrrUpdate
    );
    prestationAdditionnelReservationSaveOrrUpdate.setNamePrestaion(
      prestationAdditionnelReservation.getServiceAdditionnelle().getName()
    );
    prestationAdditionnelReservationSaveOrrUpdate.setAmountPrestation(
      prestationAdditionnelReservation.getServiceAdditionnelle().getAmount()
    );
    return prestationAdditionnelReservationSaveOrrUpdate;
  }

  public ClotureCaisseDto fromClotureCaisse(ClotureCaisse cloture) {
    Utilisateur userTest = utilisateurRepository
      .findById(cloture.getIdCreateur())
      .orElse(null);

    ClotureCaisseDto clotureCaisseDto = new ClotureCaisseDto();
    BeanUtils.copyProperties(cloture, clotureCaisseDto);
    if (userTest != null) {
      clotureCaisseDto.setCaissiere(
        userTest.getNom() + " " + userTest.getPrenom()
      );
    }
    return clotureCaisseDto;
  }

  public ClotureCaisse toClotureCaisse(ClotureCaisseDto dto) {
    ClotureCaisse clotureCaisse = new ClotureCaisse();
    BeanUtils.copyProperties(dto, clotureCaisse);
    return clotureCaisse;
  }

  public EtablissementUtilisateurDto fromEtablissementUtilisateur(
    EtablissementUtilisateur chapitreUser
  ) {
    EtablissementUtilisateurDto chapitreUserDto = new EtablissementUtilisateurDto();
    chapitreUserDto.setChapite(chapitreUser.getEtabl().getId());
    chapitreUserDto.setUtilisateur(chapitreUser.getUtilisateurEtabl().getId());
    chapitreUserDto.setDefaultChapite(chapitreUser.isEtableDefault());
    chapitreUserDto.setNomEtabless(chapitreUser.getEtabl().getLibChapitre());
    return chapitreUserDto;
  }

  public DefaultChapitreDto fromDefaultChapitre(Etablissement chapitreUser) {
    DefaultChapitreDto chapitreUserDto = new DefaultChapitreDto();
    chapitreUserDto.setIdChapite(chapitreUser.getIdChapitre());
    chapitreUserDto.setLibChapitre(chapitreUser.getLibChapitre());

    return chapitreUserDto;
  }

  public EncaissementReservationDto fromEncaissementReservation(
    EncaissementReservation encaissementReservation
  ) {
    EncaissementReservation encaissementReservationFund = encaissementReservationRepository
      .findAll()
      .stream()
      .filter(x ->
        x.getReservation().getId() ==
        encaissementReservation.getReservation().getId()
      )
      .findFirst().orElse(null);
    EncaissementReservationDto encaissementReservationDto = new EncaissementReservationDto();
    BeanUtils.copyProperties(
      encaissementReservation,
      encaissementReservationDto
    );
    encaissementReservationDto.setIdReservation(
      encaissementReservation.getId()
    );
    encaissementReservationDto.setModePaiement(
      encaissementReservation.getModePaiement()
    );
    if (encaissementReservationFund!=null) {
      encaissementReservationDto.setIdLastEncaissement(encaissementReservationFund.getId());
    }
    return encaissementReservationDto;
  }
}
