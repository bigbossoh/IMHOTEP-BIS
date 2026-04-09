package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.SiteRequestDto;
import com.bzdata.gestimospringbackend.DTOs.SiteResponseDto;
import com.bzdata.gestimospringbackend.Models.Quartier;
import com.bzdata.gestimospringbackend.Models.Site;
import com.bzdata.gestimospringbackend.Services.SiteService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.repository.QuartierRepository;
import com.bzdata.gestimospringbackend.repository.SiteRepository;
import com.bzdata.gestimospringbackend.validator.SiteDtoValidator;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SiteServiceImpl implements SiteService {
    final SiteRepository siteRepository;
    final QuartierRepository quartierRepository;

    @Override
    public boolean save(SiteRequestDto dto) {
        log.info("We are going to create  a new site {}", dto);
        List<String> errors = SiteDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Le site n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object site sont null.",
                    ErrorCodes.SITE_NOT_VALID, errors);
        }

        Optional<Site> oldSite = findExistingSite(dto.getId());
        try {
            Quartier quartier = findQuartierOrThrow(dto.getIdQuartier());
            if (oldSite.isPresent()) {
                Site siteToSave = hydrateSite(oldSite.get(), dto, quartier);
                siteRepository.save(siteToSave);
                return true;
            } else {
                Site site = hydrateSite(new Site(), dto, quartier);
                siteRepository.save(site);
                return true;
            }
        } catch (InvalidEntityException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidEntityException(" Erreur : " + e.getMessage());
        }

    }

    @Override
    public boolean delete(Long id) {
        log.info("We are going to delete a Site with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Site");
            return false;
        }
        boolean exist = siteRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucune Site avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.SITE_NOT_FOUND);
        }
        siteRepository.deleteById(id);
        return true;
    }

    @Override
    public List<SiteResponseDto> findAll(Long idAgence) {
        return siteRepository.findAll().stream()
                .map(SiteResponseDto::fromEntity)
                .filter(agence -> Objects.equals(agence.getIdAgence(), idAgence))
                .collect(Collectors.toList());
    }

    @Override
    public SiteResponseDto findById(Long id) {
        log.info("We are going to get back the Site By ID : {}", id);
        if (id == null) {
            log.error("you are not provided a Site.");
            return null;
        }
        return siteRepository.findById(id).map(SiteResponseDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Pays has been found with Code " + id,
                        ErrorCodes.SITE_NOT_FOUND));
    }

    @Override
    public SiteResponseDto findByName(String nom) {
        log.info("We are going to get back the Site By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Site.");
            return null;
        }
        return siteRepository.findByNomSite(nom).map(SiteResponseDto::fromEntity).orElseThrow(
                () -> new InvalidEntityException("Aucun Site has been found with name " + nom,
                        ErrorCodes.SITE_NOT_FOUND));
    }

    @Override
    public SiteResponseDto saveSite(SiteRequestDto dto) {
        log.info("We are going to create  a new site {}", dto);
        List<String> errors = SiteDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Le site n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object site sont null.",
                    ErrorCodes.SITE_NOT_VALID, errors);
        }

        Optional<Site> oldSite = findExistingSite(dto.getId());
        try {
            Quartier quartier = findQuartierOrThrow(dto.getIdQuartier());
            if (oldSite.isPresent()) {
                Site siteSave = siteRepository.save(hydrateSite(oldSite.get(), dto, quartier));
                return SiteResponseDto.fromEntity(siteSave);
            } else {
                Site siteSave = siteRepository.save(hydrateSite(new Site(), dto, quartier));

                return SiteResponseDto.fromEntity(siteSave);
            }
        } catch (InvalidEntityException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidEntityException(" Erreur : " + e.getMessage());
        }
    }

    private Optional<Site> findExistingSite(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return siteRepository.findById(id);
    }

    private Quartier findQuartierOrThrow(Long quartierId) {
        return quartierRepository.findById(quartierId).orElseThrow(
                () -> new InvalidEntityException(
                        "Aucun Quartier has been found with Code " + quartierId,
                        ErrorCodes.SITE_NOT_FOUND));
    }

    private Site hydrateSite(Site site, SiteRequestDto dto, Quartier quartier) {
        site.setIdAgence(dto.getIdAgence());
        site.setQuartier(quartier);
        site.setAbrSite(org.apache.commons.lang3.StringUtils.deleteWhitespace(quartier
                .getCommune().getVille().getPays().getAbrvPays())
                + "-" +
                org.apache.commons.lang3.StringUtils
                        .deleteWhitespace(quartier.getCommune().getVille().getAbrvVille())
                + "-" + org.apache.commons.lang3.StringUtils.deleteWhitespace(quartier
                        .getCommune().getAbrvCommune())
                + "-" + org.apache.commons.lang3.StringUtils.deleteWhitespace(quartier.getAbrvQuartier()));
        site.setNomSite(
                quartier.getCommune().getVille().getPays().getNomPays()
                        + "-" + quartier.getCommune().getVille().getNomVille()
                        + "-" + quartier.getCommune().getNomCommune()
                        + "-" + quartier.getNomQuartier());
        return site;
    }
}
