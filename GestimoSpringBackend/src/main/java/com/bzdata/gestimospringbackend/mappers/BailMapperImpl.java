package com.bzdata.gestimospringbackend.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.BailAppartementDto;
import com.bzdata.gestimospringbackend.DTOs.BailMagasinDto;
import com.bzdata.gestimospringbackend.DTOs.BailVillaDto;
import com.bzdata.gestimospringbackend.DTOs.LocataireEncaisDTO;
import com.bzdata.gestimospringbackend.DTOs.MontantLoyerBailDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.DTOs.SuivieDepenseDto;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.Models.SuivieDepense;
import com.bzdata.gestimospringbackend.Utils.BailDisplayUtils;
import com.bzdata.gestimospringbackend.repository.AppelLoyerRepository;
import com.bzdata.gestimospringbackend.repository.MontantLoyerBailRepository;
import com.bzdata.gestimospringbackend.repository.SuivieDepenseRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional
public class BailMapperImpl {
        final MontantLoyerBailRepository montantLoyerBailRepository;
        final SuivieDepenseRepository suivieDepenseRepository;
        final AppelLoyerRepository appelLoyerRepository;

        // BAIL VILLA MAPPER
        public BailVillaDto fromBailVilla(BailLocation bailLocation) {
                BailVillaDto bailLocaDto = new BailVillaDto();
                BeanUtils.copyProperties(bailLocation, bailLocaDto);
                bailLocaDto.setIdVilla(bailLocation.getBienImmobilierOperation().getId());
                bailLocaDto.setFullNomLocatire(BailDisplayUtils.buildLocataireDisplayName(bailLocation.getUtilisateurOperation()));
                bailLocaDto.setIdLocataire(bailLocation.getUtilisateurOperation().getId());
                bailLocaDto.setAbrvCodeBail(BailDisplayUtils.resolveBailCode(bailLocation));
                return bailLocaDto;
        }

        // BAIL MAGASIN MAPPER
        public BailMagasinDto fromBailMagasin(BailLocation bailLocation) {
                BailMagasinDto bailLocaDto = new BailMagasinDto();
                BeanUtils.copyProperties(bailLocation, bailLocaDto);

                bailLocaDto.setNomLocataire(BailDisplayUtils.buildLocataireDisplayName(bailLocation.getUtilisateurOperation()));
                bailLocaDto.setIdLocataire(bailLocation.getUtilisateurOperation().getId());
                bailLocaDto.setCodeBien(BailDisplayUtils.sanitizeDisplayValue(bailLocation.getBienImmobilierOperation().getCodeAbrvBienImmobilier()));
                bailLocaDto.setAbrvCodeBail(BailDisplayUtils.resolveBailCode(bailLocation));
                return bailLocaDto;
        }

        // BAIL MAGASIN MAPPER
        public BailAppartementDto fromBailAppartement(BailLocation bailLocation) {
                BailAppartementDto bailLocaDto = new BailAppartementDto();
                BeanUtils.copyProperties(bailLocation, bailLocaDto);
                bailLocaDto.setIdBienImmobilier(bailLocation.getBienImmobilierOperation().getId());
                bailLocaDto.setNomLocataire(BailDisplayUtils.buildLocataireDisplayName(bailLocation.getUtilisateurOperation()));
                bailLocaDto.setIdLocataire(bailLocation.getUtilisateurOperation().getId());
                bailLocaDto.setCodeBien(BailDisplayUtils.sanitizeDisplayValue(bailLocation.getBienImmobilierOperation().getCodeAbrvBienImmobilier()));
                bailLocaDto.setAbrvCodeBail(BailDisplayUtils.resolveBailCode(bailLocation));
                return bailLocaDto;
        }

        // BAIL MAGASIN MAPPER
        public OperationDto fromOperation(BailLocation bailLocation) {
                // log.info("fromOperation {}, {} ",
                // bailLocation.getId(),bailLocation.getBienImmobilierOperation().getCodeAbrvBienImmobilier());
                OperationDto bailLocaDto = new OperationDto();
                bailLocaDto.setIdFirstAppel(0L);
                List<AppelLoyer> appelLoyers = appelLoyerRepository.findAll()
                                .stream()
                                .filter(b -> b.getBailLocationAppelLoyer() == bailLocation
                                                && b.getSoldeAppelLoyer() > 0)
                                .collect(Collectors.toList());
                if (appelLoyers.size() > 0) {
                        bailLocaDto.setIdFirstAppel(appelLoyers.get(0).getId());
                }
                BeanUtils.copyProperties(bailLocation, bailLocaDto);
                bailLocaDto.setIdBienImmobilier(bailLocation.getBienImmobilierOperation().getId());
                bailLocaDto.setAbrvCodeBail(BailDisplayUtils.resolveBailCode(bailLocation));
                bailLocaDto.setUtilisateurOperation(BailDisplayUtils.buildLocataireDisplayName(bailLocation.getUtilisateurOperation()));
                bailLocaDto.setIdLocataire(bailLocation.getUtilisateurOperation().getId());
                bailLocaDto
                                .setCodeAbrvBienImmobilier(
                                                BailDisplayUtils.sanitizeDisplayValue(
                                                                bailLocation.getBienImmobilierOperation().getCodeAbrvBienImmobilier()));
                Double montantloyer = montantLoyerBailRepository.findAll().stream()
                                .filter(bail -> bail.getBailLocation().equals(bailLocation))
                                .filter(locat -> locat.isStatusLoyer() == true)
                                .mapToDouble(mon -> mon.getNouveauMontantLoyer()).sum();
                bailLocaDto.setNouveauMontantLoyer(montantloyer);
                return bailLocaDto;
        }

        public LocataireEncaisDTO fromOperationBailLocation(BailLocation bailLocation) {
                // log.info("fromOperationBailLocation {}, {} ",
                // bailLocation.getId(),bailLocation.getBienImmobilierOperation().getCodeAbrvBienImmobilier());
                LocataireEncaisDTO locataireEncaisDTO = new LocataireEncaisDTO();
                List<AppelLoyer> lesAppelduBail = appelLoyerRepository.findAll().stream()
                                .filter(bien -> bien.getBailLocationAppelLoyer() == bailLocation
                                                && bien.getSoldeAppelLoyer() > 0)

                                .collect(Collectors.toList());
                if (lesAppelduBail.size() > 0) {
                        locataireEncaisDTO.setMois(lesAppelduBail.get(0).getPeriodeAppelLoyer());
                        locataireEncaisDTO.setMoisEnLettre(lesAppelduBail.get(0).getPeriodeLettre());
                        locataireEncaisDTO.setMontantloyer(lesAppelduBail.get(0).getMontantLoyerBailLPeriode());
                        locataireEncaisDTO.setIdAppel(lesAppelduBail.get(0).getId());
                }
                locataireEncaisDTO.setId(bailLocation.getUtilisateurOperation().getId());
                locataireEncaisDTO.setCodeDescBail(BailDisplayUtils.buildTenantBienLabel(
                                bailLocation.getUtilisateurOperation(),
                                bailLocation.getBienImmobilierOperation()));
                locataireEncaisDTO.setNom(bailLocation.getUtilisateurOperation().getNom());
                locataireEncaisDTO.setPrenom(bailLocation.getUtilisateurOperation().getPrenom());
                locataireEncaisDTO.setIdBien(bailLocation.getBienImmobilierOperation().getId());
                locataireEncaisDTO.setUsername(bailLocation.getUtilisateurOperation().getUsername());
                locataireEncaisDTO.setIdBail(bailLocation.getId());
                return locataireEncaisDTO;
        }

        public MontantLoyerBailDto fromMontantLoyerBail(MontantLoyerBail montantLoyerBail) {
                MontantLoyerBailDto montantLoyerBailDto = new MontantLoyerBailDto();
                BeanUtils.copyProperties(montantLoyerBail, montantLoyerBailDto);
                return montantLoyerBailDto;
        }

        // SUIVIE DEPENSE DTO MAPPER
        public SuivieDepenseDto fromSuivieDepense(SuivieDepense suivieDepense) {
             
                SuivieDepenseDto suivieDepenseDto = new SuivieDepenseDto();
                BeanUtils.copyProperties(suivieDepense, suivieDepenseDto);
                suivieDepenseDto.setCloturerSuivi(
                                suivieDepense.getChapitreSuivis() != null
                                                ? suivieDepense.getChapitreSuivis().getLibelleChapitre()
                                                : null);
                suivieDepenseDto.setIdChapitre(
                                suivieDepense.getChapitreSuivis() != null
                                                ? suivieDepense.getChapitreSuivis().getId()
                                                : null);
                suivieDepenseDto.setHasJustificatif(
                                suivieDepense.getJustificatifData() != null
                                                && suivieDepense.getJustificatifData().length > 0);
                return suivieDepenseDto;
        }

        // SUIVIE DEPENSE MAPPER
        public SuivieDepense fromSuivieDepenseDto(SuivieDepenseDto suivieDepenseDto) {
                SuivieDepense suivieDepense = new SuivieDepense();
                BeanUtils.copyProperties(suivieDepenseDto, suivieDepense);
                return suivieDepense;
        }

        // public SuivieDepense fromSuivieDepenseDto(SuivieDepenseEncaissementDto
        // suivieDepenseEncaissementDto) {
        // suivieDepenseRepository.findById(suivieDepenseEncaissementDto.getId)
        // SuivieDepense suivieDepense = new SuivieDepense();
        // BeanUtils.copyProperties(suivieDepenseDto, suivieDepense);
        // return suivieDepense;
        // }
        public LocataireEncaisDTO fromOperationAppelLoyer(AppelLoyer appelLoyer) {
                // log.info("fromOperationBailLocation {}, {} ", appelLoyer.getId(),
                // appelLoyer.getBailLocationAppelLoyer().getBienImmobilierOperation().getCodeAbrvBienImmobilier());
                LocataireEncaisDTO locataireEncaisDTO = new LocataireEncaisDTO();
                locataireEncaisDTO.setMois(appelLoyer.getPeriodeAppelLoyer());
                locataireEncaisDTO.setMoisEnLettre(appelLoyer.getPeriodeLettre());
                locataireEncaisDTO.setMontantloyer(appelLoyer.getMontantLoyerBailLPeriode());
                locataireEncaisDTO.setIdAppel(appelLoyer.getId());
                locataireEncaisDTO.setId(appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation().getId());
                locataireEncaisDTO.setCodeDescBail(BailDisplayUtils.buildTenantBienLabel(
                                appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation(),
                                appelLoyer.getBailLocationAppelLoyer().getBienImmobilierOperation()));
                locataireEncaisDTO.setNom(appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation().getNom());
                locataireEncaisDTO.setPrenom(
                                appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation().getPrenom());
                locataireEncaisDTO
                                .setIdBien(appelLoyer.getBailLocationAppelLoyer().getBienImmobilierOperation().getId());
                locataireEncaisDTO.setUsername(
                                appelLoyer.getBailLocationAppelLoyer().getUtilisateurOperation().getUsername());
                locataireEncaisDTO.setIdBail(appelLoyer.getBailLocationAppelLoyer().getId());
                locataireEncaisDTO.setUnlock(appelLoyer.isUnLock());
                locataireEncaisDTO.setSoldeAppelLoyer(appelLoyer.getSoldeAppelLoyer());

                return locataireEncaisDTO;
        }
}
