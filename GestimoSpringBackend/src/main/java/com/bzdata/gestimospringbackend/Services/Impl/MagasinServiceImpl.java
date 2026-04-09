package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.*;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.Models.Etage;
import com.bzdata.gestimospringbackend.Models.Magasin;
import com.bzdata.gestimospringbackend.Models.Site;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.Services.MagasinService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.repository.EtageRepository;
import com.bzdata.gestimospringbackend.repository.MagasinRepository;
import com.bzdata.gestimospringbackend.repository.SiteRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.validator.MagasinDtoValidator;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MagasinServiceImpl implements MagasinService {

  final MagasinRepository magasinRepository;
  final SiteRepository siteRepository;
  final UtilisateurRepository utilisateurRepository;
  final EtageRepository etageRepository;
  final GestimoWebMapperImpl gestimoWebMapperImpl;
  final ChapitreRepository chapitreRepository;
  @Override
  public boolean delete(Long id) {
    log.info("We are going to delete a Magasin with the ID {}", id);
    if (id == null) {
      log.error("you are provided a null ID for the Magasin");
      return false;
    }
    boolean exist = magasinRepository.existsById(id);
    if (!exist) {
      throw new EntityNotFoundException(
        "Aucune Magasin avec l'ID = " + id + " " + "n' ete trouve dans la BDD",
        ErrorCodes.MAGASIN_NOT_FOUND
      );
    }

    magasinRepository.deleteById(id);
    return true;
  }

  @Override
  public Long maxOfNumBienMagasin(Long idAgence) {
    LongSummaryStatistics collectMaxNumBien = magasinRepository
      .findAll()
      .stream()
      .filter(agence ->
        agence.getIdAgence() == idAgence &&
        agence.isBienMeublerResidence() == false
      )
      .collect(Collectors.summarizingLong(Magasin::getNumMagasin));
    return collectMaxNumBien.getMax();
  }

  @Override
  public List<MagasinResponseDto> findAll(Long idAgence) {
    log.info("All Magasin 21 {}", magasinRepository.findAll().toArray());
    return magasinRepository
      .findAll()
      .stream()
      .map(MagasinResponseDto::fromEntity)
      .filter(agence ->
        Objects.equals(agence.getIdAgence(), idAgence) &&
        agence.isBienMeublerResidence() == false
      )
      .collect(Collectors.toList());
  }

  @Override
  public MagasinDto findById(Long id) {
    log.info("We are going to get back the MagasinDto By {}", id);
    if (id == null) {
      log.error("you are not provided a Villa.");
      return null;
    }
    return magasinRepository
      .findById(id)
      .map(gestimoWebMapperImpl::fromMagasin)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun Studio has been found with Code " + id,
          ErrorCodes.MAGASIN_NOT_FOUND
        )
      );
  }

  @Override
  public MagasinDto findByName(String nom) {
    Magasin magasinByUsername = magasinRepository.findMagasinByNomCompletBienImmobilier(
      nom
    );
    if (magasinByUsername != null) {
      return gestimoWebMapperImpl.fromMagasin(magasinByUsername);
    } else {
      return null;
    }
  }

  @Override
  public List<MagasinDto> findAllBySite(SiteRequestDto siteRequestDto) {
    return magasinRepository
      .findAll()
      .stream()
      .filter(magasin ->
        magasin.getSite().equals(siteRequestDto) &&
        magasin.isBienMeublerResidence() == false
      )
      .map(gestimoWebMapperImpl::fromMagasin)
      .collect(Collectors.toList());
  }

  @Override
  public List<MagasinDto> findAllByIdSite(Long id) {
    return magasinRepository
      .findAll()
      .stream()
      .filter(magasin ->
        magasin.getSite().getId().equals(id) &&
        magasin.isBienMeublerResidence() == false
      )
      .map(gestimoWebMapperImpl::fromMagasin)
      .collect(Collectors.toList());
  }

  @Override
  public List<MagasinDto> findAllByIdEtage(Long id) {
    return magasinRepository
      .findAll()
      .stream()
      .filter(magasin ->
        magasin.getEtageMagasin().getId().equals(id) &&
        magasin.isBienMeublerResidence() == false
      )
      .map(gestimoWebMapperImpl::fromMagasin)
      .collect(Collectors.toList());
  }

  @Override
  public List<MagasinResponseDto> findAllLibre(Long idAgence) {
    return magasinRepository
      .findAll()
      .stream()
      .map(MagasinResponseDto::fromEntity)
      .filter(mag -> !mag.isOccupied())
      .filter(agence ->
        Objects.equals(agence.getIdAgence(), idAgence) &&
        agence.isBienMeublerResidence() == false
      )
      .collect(Collectors.toList());
  }

  // ENREGISTRER UN MAGASIN
  @Override
  public MagasinDto saveUnMagasin(MagasinDto dto) {
    Optional<Magasin> magasinFind =
      dto.getId() != null ? magasinRepository.findById(dto.getId()) : Optional.empty();
    if (magasinFind.isPresent()) {
      List<String> errors = MagasinDtoValidator.validate(dto);
      if (!errors.isEmpty()) {
        log.error("Le magasin n'est pas valide {}", errors);
        throw new InvalidEntityException(
          "Certain attributs de l'object Magasin sont null.",
          ErrorCodes.MAGASIN_NOT_VALID,
          errors
        );
      }
      Site recoverySite = dto.getIdSite() != null && dto.getIdSite() != 0 ? getSite(dto) : null;
      Etage etage = dto.getIdEtage() != null && dto.getIdEtage() != 0 ? getEtage(dto) : null;
      Utilisateur utilisateurRequestDto = getUtilisateur(dto);
      if (
        utilisateurRequestDto.getUrole().getRoleName().equals("PROPRIETAIRE")
      ) {
        Magasin magasin = magasinFind.get();
        Long numBien = magasin.getNumMagasin();
        if (numBien == null || numBien <= 0) {
          if (recoverySite != null) {
            numBien = nombreVillaByIdSite(recoverySite);
          } else if (etage != null) {
            numBien = nombreVillaByIdSite(etage.getImmeuble().getSite());
          } else {
            numBien = 1L;
          }
        }

        magasin.setIdAgence(dto.getIdAgence());
        magasin.setIdCreateur(dto.getIdCreateur());
        magasin.setChapitre(resolveChapitre(dto.getIdChapitre()));
        magasin.setNumMagasin(numBien);
        magasin.setDescription(dto.getDescription() != null ? dto.getDescription().toUpperCase() : null);
        magasin.setSuperficieBien(dto.getSuperficieBien());
        magasin.setUnderBuildingMagasin(dto.isUnderBuildingMagasin());
        magasin.setNombrePieceMagasin(dto.getNombrePieceMagasin());
        magasin.setUtilisateurProprietaire(utilisateurRequestDto);
        magasin.setNomBaptiserBienImmobilier(dto.getNomBaptiserBienImmobilier());
        magasin.setOccupied(dto.isOccupied());
        magasin.setBienMeublerResidence(dto.isBienMeublerResidence());

        if (etage != null) {
          magasin.setEtageMagasin(etage);
          magasin.setSite(etage.getImmeuble().getSite());
          magasin.setCodeAbrvBienImmobilier(
            (etage.getCodeAbrvEtage() + "-MAG-" + numBien).toUpperCase()
          );
          magasin.setNomCompletBienImmobilier(
            (etage.getNomCompletEtage() + "-MAGASIN-" + numBien).toUpperCase()
          );
        } else if (recoverySite != null) {
          magasin.setEtageMagasin(null);
          magasin.setSite(recoverySite);
          magasin.setCodeAbrvBienImmobilier(
            (recoverySite.getAbrSite() + "-MAG-" + numBien).toUpperCase()
          );
          magasin.setNomCompletBienImmobilier(
            (recoverySite.getNomSite() + "-MAGASIN-" + numBien).toUpperCase()
          );
        }

        Magasin magasinSave = magasinRepository.save(magasin);
        log.info("les informations du magasin sont {}", magasin);
        return gestimoWebMapperImpl.fromMagasin(magasinSave);
      } else {
        throw new InvalidEntityException(
          "L'utilisateur choisi n'a pas un rôle propriétaire, mais pluôt " +
          utilisateurRequestDto.getUrole().getRoleName(),
          ErrorCodes.UTILISATEUR_NOT_GOOD_ROLE
        );
      }
    } else {
      log.info("We are going to create  a new Magasin {}", dto);
      List<String> errors = MagasinDtoValidator.validate(dto);
      if (!errors.isEmpty()) {
        log.error("Le magasin n'est pas valide {}", errors);
        throw new InvalidEntityException(
          "Certain attributs de l'object Magasin sont null.",
          ErrorCodes.MAGASIN_NOT_VALID,
          errors
        );
      }

      Magasin magasin = new Magasin();
      Site recoverySite;
      Etage etage;
      if (dto.getIdEtage() != null && dto.getIdEtage() != 0) {
        etage = getEtage(dto);
      } else {
        etage = null;
      }
      if (dto.getIdSite() != null && dto.getIdSite() != 0) {
        recoverySite = getSite(dto);
      } else {
        recoverySite = null;
      }
      Utilisateur utilisateurRequestDto = getUtilisateur(dto);
      if (
        utilisateurRequestDto.getUrole().getRoleName().equals("PROPRIETAIRE")
      ) {
        magasin.setIdAgence(dto.getIdAgence());
        Long numBien = 0L;
        int size = new ArrayList<>(magasinRepository.findAll()).size();
        if (size == 0) {
          numBien = 1L;
        } else {
          if (recoverySite != null) {
            numBien = nombreVillaByIdSite(recoverySite);
          } else {
            numBien = nombreVillaByIdSite(etage.getImmeuble().getSite());
          }
        }
        Chapitre chapitre;
        if (dto.getIdChapitre()==0 ||dto.getIdChapitre()==null) {
              chapitre=chapitreRepository.getById(1L);
        } else {
              chapitre=chapitreRepository.getById(dto.getIdChapitre());
        }
       
        magasin.setChapitre(chapitre);
        magasin.setNumMagasin(numBien);
        magasin.setDescription(dto.getDescription() != null ? dto.getDescription().toUpperCase() : null);
        magasin.setSuperficieBien(dto.getSuperficieBien());
        magasin.setUnderBuildingMagasin(dto.isUnderBuildingMagasin());
        magasin.setNombrePieceMagasin(dto.getNombrePieceMagasin());
        magasin.setUtilisateurProprietaire(utilisateurRequestDto);
        magasin.setIdCreateur(dto.getIdCreateur());
        magasin.setOccupied(dto.isOccupied());
        magasin.setBienMeublerResidence(dto.isBienMeublerResidence());
        magasin.setNomBaptiserBienImmobilier(
          dto.getNomBaptiserBienImmobilier()
        );

        if (dto.getIdEtage() == null || dto.getIdEtage() == 0) {
          magasin.setSite(recoverySite);
          magasin.setCodeAbrvBienImmobilier(
            (recoverySite.getAbrSite() + "-MAG-" + numBien).toUpperCase()
          );
          magasin.setNomCompletBienImmobilier(
            (recoverySite.getNomSite() + "-MAGASIN-" + numBien).toUpperCase()
          );
        } else {
          magasin.setCodeAbrvBienImmobilier(
            (etage.getCodeAbrvEtage() + "-MAG-" + numBien).toUpperCase()
          );
          magasin.setNomCompletBienImmobilier(
            (etage.getNomCompletEtage() + "-MAGASIN-" + numBien).toUpperCase()
          );
          magasin.setSite(etage.getImmeuble().getSite());
          magasin.setEtageMagasin(etage);
        }

        Magasin magasinSave = magasinRepository.save(magasin);
        log.info("les informations du magasin sont {}", magasin);
        return gestimoWebMapperImpl.fromMagasin(magasinSave);
      } else {
        throw new InvalidEntityException(
          "L'utilisateur choisi n'a pas un rôle propriétaire, mais pluôt " +
          utilisateurRequestDto.getUrole().getRoleName(),
          ErrorCodes.UTILISATEUR_NOT_GOOD_ROLE
        );
      }
    }
  }

  // FIN SAVE UN MAGASIN
  private Utilisateur getUtilisateur(MagasinDto dto) {
    return utilisateurRepository
      .findById(dto.getIdUtilisateur())
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun Utilisateur has been found with code " +
          dto.getIdUtilisateur(),
          ErrorCodes.UTILISATEUR_NOT_FOUND
        )
      );
  }

  private Chapitre resolveChapitre(Long chapitreId) {
    if (chapitreId == null || chapitreId == 0) {
      return chapitreRepository.getById(1L);
    }
    return chapitreRepository.getById(chapitreId);
  }

  private Long nombreVillaByIdSite(Site site) {
    if (site == null || site.getId() == null) {
      return 1L;
    }

    String legacyCodePrefix = buildMagasinCodePrefix(site);

    long currentMax = magasinRepository
      .findAll()
      .stream()
      .filter(magasin -> !magasin.isBienMeublerResidence())
      .filter(magasin -> belongsToSite(magasin, site, legacyCodePrefix))
      .map(Magasin::getNumMagasin)
      .filter(Objects::nonNull)
      .mapToLong(Long::longValue)
      .max()
      .orElse(0L);

    return currentMax + 1L;
  }

  private boolean belongsToSite(
    Magasin magasin,
    Site site,
    String legacyCodePrefix
  ) {
    Site magasinSite = magasin.getSite();
    if (
      magasinSite != null &&
      Objects.equals(magasinSite.getId(), site.getId())
    ) {
      return true;
    }

    return StringUtils.hasText(magasin.getCodeAbrvBienImmobilier()) &&
    magasin
      .getCodeAbrvBienImmobilier()
      .toUpperCase(Locale.ROOT)
      .startsWith(legacyCodePrefix);
  }

  private String buildMagasinCodePrefix(Site site) {
    String sitePrefix = site.getAbrSite() != null
      ? site.getAbrSite().trim()
      : String.valueOf(site.getId());
    return (sitePrefix + "-MAG-").toUpperCase(Locale.ROOT);
  }

  private Site getSite(MagasinDto dto) {
    return siteRepository
      .findById(dto.getIdSite())
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun Site has been found with Code " + dto.getIdSite(),
          ErrorCodes.SITE_NOT_FOUND
        )
      );
  }

  private Etage getEtage(MagasinDto dto) {
    Etage etage = etageRepository.findById(dto.getIdEtage()).orElse(null);
    if (etage == null) return null;
    return etage;
  }
}
