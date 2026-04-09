package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyerRequestDto;
import com.bzdata.gestimospringbackend.DTOs.BailAppartementDto;
import com.bzdata.gestimospringbackend.DTOs.OperationDto;
import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.BailAppartementService;
import com.bzdata.gestimospringbackend.Services.MontantLoyerBailService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.repository.AppartementRepository;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.Utils.BailDisplayUtils;
import com.bzdata.gestimospringbackend.validator.BailAppartementDtoValidator;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
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
public class BailAppartmentServiceImpl implements BailAppartementService {
    final BailLocationRepository bailLocationRepository;
    final UtilisateurRepository utilisateurRepository;
    final AppartementRepository appartementRepository;
    final MontantLoyerBailService montantLoyerBailService;
    final AppelLoyerService appelLoyerService;
    final BienImmobilierRepository bienImmobilierRepository;
    final BailMapperImpl bailMapperImpl;

    @Override
    public OperationDto save(BailAppartementDto dto) {

        log.info("We are going to create  a new Bail Appartement {}", dto);
        List<String> errors = BailAppartementDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("le Bail n'est pas valide {}", errors);
            throw new InvalidEntityException("Certain attributs de l'object Bail sont null.",
                    ErrorCodes.BAILLOCATION_NOT_VALID, errors);
        }

        BailLocation findBailLocation = bailLocationRepository.findById(dto.getId()).orElse(null);

        if (findBailLocation != null) {
            return null;
        } else {

        }
        BailLocation bailLocation = new BailLocation();
        Utilisateur utilisateur = utilisateurRepository
                .findById(dto.getIdLocataire())
                .orElseThrow(() -> new InvalidEntityException(
                        "Aucun Utilisateur has been found with code " + dto.getIdLocataire(),
                        ErrorCodes.UTILISATEUR_NOT_FOUND));
        if (utilisateur.getUrole().getRoleName().equals("LOCATAIRE")) {

            Appartement appartementBail = appartementRepository.findById(dto.getIdAppartement())
                    .orElseThrow(() -> new InvalidEntityException(
                            "Aucun Appartement has been found with code " + dto.getIdAppartement(),
                            ErrorCodes.MAGASIN_NOT_FOUND));
            Bienimmobilier bienImmobilierOperation = bienImmobilierRepository.findById(dto.getIdAppartement())
                    .orElseThrow(() -> new InvalidEntityException(
                            "Aucun Bien has been found with code " + dto.getIdAppartement(),
                            ErrorCodes.MAGASIN_NOT_FOUND));
            bailLocation.setIdAgence(dto.getIdAgence());
            // bailLocation.setAppartementBail(appartementBail);
            bailLocation.setBienImmobilierOperation(bienImmobilierOperation);
            bailLocation.setUtilisateurOperation(utilisateur);
            bailLocation.setAbrvCodeBail(BailDisplayUtils.resolveBailCode(
                    dto.getAbrvCodeBail(),
                    utilisateur,
                    bienImmobilierOperation,
                    null));
            bailLocation.setArchiveBail(false);
            bailLocation.setDateDebut(dto.getDateDebut());
            bailLocation.setDateFin(dto.getDateFin());
            bailLocation.setDesignationBail(dto.getDesignationBail());
            bailLocation.setEnCoursBail(true);
            bailLocation.setMontantCautionBail(dto.getMontantCautionBail());

            bailLocation.setNbreMoisCautionBail(dto.getNbreMoisCautionBail());
            bailLocation.setUtilisateurOperation(utilisateur);

            BailLocation appartementBailSave = bailLocationRepository.save(bailLocation);
            appartementBail.setOccupied(true);
            // appartementBail.setStatutAppart("Occupied");
            appartementRepository.save(appartementBail);
            /**
             * Creation d'un montant de loyer juste apres que le contrat de bail a été crée
             */
            MontantLoyerBail montantLoyerBail = new MontantLoyerBail();
            montantLoyerBail.setNouveauMontantLoyer(dto.getNouveauMontantLoyer());
            montantLoyerBail.setBailLocation(appartementBailSave);
            montantLoyerBail.setIdAgence(dto.getIdAgence());
            montantLoyerBailService.saveNewMontantLoyerBail(0L,
                    dto.getNouveauMontantLoyer(), 0.0, appartementBailSave.getId(), dto.getIdAgence(),null);
            /**
             * Creation de l'appel loyer
             */
            AppelLoyerRequestDto appelLoyerRequestDto = new AppelLoyerRequestDto();

            appelLoyerRequestDto.setIdBailLocation(appartementBailSave.getId());
            appelLoyerRequestDto.setMontantLoyerEnCours(dto.getNouveauMontantLoyer());
            appelLoyerRequestDto.setIdAgence(dto.getIdAgence());
            // appelLoyerRequestDto.setMontantLoyerEnCours(dto.getNouveauMontantLoyer());
            appelLoyerService.save(appelLoyerRequestDto);
            return bailMapperImpl.fromOperation(appartementBailSave);
        } else {
            throw new InvalidEntityException("L'utilisateur choisi n'a pas un rôle propriétaire, mais pluôt "
                    + utilisateur.getUrole().getRoleName(),
                    ErrorCodes.UTILISATEUR_NOT_GOOD_ROLE);
        }
    }

    @Override
    public boolean delete(Long id) {
        log.info("We are going to delete a Bail with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Bail");
            return false;
        }
        boolean exist = bailLocationRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucun Bail avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.BAILLOCATION_NOT_FOUND);
        }

        bailLocationRepository.deleteById(id);
        return true;
    }

    @Override
    public List<BailAppartementDto> findAll(Long idAgence) {
        return bailLocationRepository.findAll(Sort.by(Direction.ASC, "designationBail")).stream()
                .filter(agence -> agence.getIdAgence() == idAgence)
                .map(bailMapperImpl::fromBailAppartement)
                .collect(Collectors.toList());
    }

    @Override
    public BailAppartementDto findById(Long id) {
        log.info("We are going to get back the Bail By {}", id);
        if (id == null) {
            log.error("you are not provided a Studio.");
            return null;
        }
        return bailLocationRepository.findById(id).map(bailMapperImpl::fromBailAppartement).orElseThrow(
                () -> new InvalidEntityException("Aucun Bail has been found with Code " + id,
                        ErrorCodes.BAILLOCATION_NOT_FOUND));
    }

    @Override
    public BailAppartementDto findByName(String nom) {
        log.info("We are going to get back the Bail By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Bail.");
            return null;
        }
        return bailLocationRepository.findByDesignationBail(nom).map(bailMapperImpl::fromBailAppartement).orElseThrow(
                () -> new InvalidEntityException("Aucun Bail has been found with name " + nom,
                        ErrorCodes.BAILLOCATION_NOT_FOUND));
    }
}
