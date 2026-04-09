package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.*;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.Models.Villa;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.BailVillaService;
import com.bzdata.gestimospringbackend.Services.MontantLoyerBailService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.BienImmobilierRepository;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;
import com.bzdata.gestimospringbackend.Utils.BailDisplayUtils;
import com.bzdata.gestimospringbackend.repository.VillaRepository;
import com.bzdata.gestimospringbackend.validator.BailVillaDtoValidator;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BailVillaServiceImpl implements BailVillaService {

    final BailLocationRepository bailLocationRepository;
    final UtilisateurRepository utilisateurRepository;
    final VillaRepository villaRepository;
    final MontantLoyerBailService montantLoyerBailService;
    final AppelLoyerService appelLoyerService;
    final BienImmobilierRepository bienImmobilierRepository;
    final BailMapperImpl bailMapper;

    @Override
    public OperationDto saveNewBailVilla(BailVillaDto dto) {
        BailLocation bailLocationVilla = new BailLocation();
    //    log.info("We are going to create  a new Bail Villa SERVICE {}", dto);
        List<String> errors = BailVillaDtoValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("le Villa n'est pas valide {}", errors);
            throw new InvalidEntityException("Certains attributs de l'object Bail sont null.",
                    ErrorCodes.BAILLOCATION_NOT_VALID, errors);
        }

        Utilisateur utilisateur = utilisateurRepository
                .findById(dto.getIdLocataire())
                .orElseThrow(() -> new InvalidEntityException(
                        "Aucun Utilisateur has been found with code " + dto.getIdLocataire(),
                        ErrorCodes.UTILISATEUR_NOT_FOUND));
        if (utilisateur.getUrole().getRoleName().equals("LOCATAIRE")) {
            Bienimmobilier bienImmobilierOperation = bienImmobilierRepository.findById(dto.getIdVilla())
                    .orElseThrow(() -> new InvalidEntityException(
                            "Aucun Bien has been found with code " + dto.getIdVilla(),
                            ErrorCodes.BIEN_IMMOBILIER_NOT_FOUND));
            Villa villa = villaRepository.findById(dto.getIdVilla())
                    .orElseThrow(() -> new InvalidEntityException(
                            "Aucune Villa has been found with code " + dto.getIdVilla(),
                            ErrorCodes.VILLE_NOT_FOUND));
            bailLocationVilla.setBienImmobilierOperation(bienImmobilierOperation);
            bailLocationVilla.setUtilisateurOperation(utilisateur);
            bailLocationVilla.setAbrvCodeBail(BailDisplayUtils.resolveBailCode(
                    dto.getAbrvCodeBail(),
                    utilisateur,
                    bienImmobilierOperation,
                    null));
            bailLocationVilla.setArchiveBail(false);
            bailLocationVilla.setDateDebut(dto.getDateDebut());
            bailLocationVilla.setDateFin(dto.getDateFin());
            bailLocationVilla.setDesignationBail(dto.getDesignationBail());
            bailLocationVilla.setIdAgence(dto.getIdAgence());
            bailLocationVilla.setIdCreateur(dto.getIdCreateur());
            bailLocationVilla.setEnCoursBail(true);
            bailLocationVilla.setMontantCautionBail(dto.getMontantCautionBail());
            bailLocationVilla.setNbreMoisCautionBail(dto.getNbreMoisCautionBail());


            BailLocation villaBailSave = bailLocationRepository.save(bailLocationVilla);

            villa.setOccupied(true);
           // villa.setStatutBien("Occupied");
            villaRepository.save(villa);
            /**
             * Creation d'un montant de loyer juste apres que le contrat de bail a été crée
             */
            log.info(
                    " les donnees {}, {}, {}, {}, {},{}", 0L,
                    dto.getNouveauMontantLoyer(), 0.0, villaBailSave.getId(), dto.getIdAgence(), dto.getDateDebut());
            MontantLoyerBail montantLoyerBail = new MontantLoyerBail();
            montantLoyerBail.setNouveauMontantLoyer(dto.getNouveauMontantLoyer());
            montantLoyerBail.setBailLocation(villaBailSave);
            montantLoyerBail.setIdAgence(dto.getIdAgence());
            montantLoyerBailService.saveNewMontantLoyerBail(0L,
                    dto.getNouveauMontantLoyer(), 0.0, villaBailSave.getId(), dto.getIdAgence(),dto.getDateDebut());
            /**
             * Creation de l'appel loyer
             */
            AppelLoyerRequestDto appelLoyerRequestDto = new AppelLoyerRequestDto();

            appelLoyerRequestDto.setIdBailLocation(villaBailSave.getId());
            appelLoyerRequestDto.setMontantLoyerEnCours(dto.getNouveauMontantLoyer());
            appelLoyerRequestDto.setIdAgence(dto.getIdAgence());


            appelLoyerService.save(appelLoyerRequestDto);
                return bailMapper.fromOperation(villaBailSave);
        } else {
            throw new InvalidEntityException("L'utilisateur choisi n'a pas un rôle propriétaire, mais pluôt "
                    + utilisateur.getUrole().getRoleName(),
                    ErrorCodes.UTILISATEUR_NOT_GOOD_ROLE);
        }

    }

    @Override
    public boolean delete(Long id) {
        log.info("We are going to delete a Bail of villa with the ID {}", id);
        if (id == null) {
            log.error("you are provided a null ID for the Bail");
            return false;
        }
        boolean exist = bailLocationRepository.existsById(id);
        if (!exist) {
            throw new EntityNotFoundException("Aucune Studio avec l'ID = " + id + " "
                    + "n' ete trouve dans la BDD", ErrorCodes.BAILLOCATION_NOT_FOUND);
        }

        bailLocationRepository.deleteById(id);
        return true;
    }

    @Override
    public List<BailVillaDto> findAll(Long idAgence) {
        return bailLocationRepository.findAll(Sort.by(Direction.ASC, "designationBail")).stream()
                .map(bailMapper::fromBailVilla)
                .filter(agence->agence.getIdAgence()==idAgence)
                .collect(Collectors.toList());
    }

    @Override
    public BailVillaDto findById(Long id) {
        log.info("We are going to get back the Bail By {}", id);
        if (id == null) {
            log.error("you are not provided a Studio.");
            return null;
        }
        return bailLocationRepository.findById(id).map(bailMapper::fromBailVilla).orElseThrow(
                () -> new InvalidEntityException("Aucun Bail has been found with Code " + id,
                        ErrorCodes.BAILLOCATION_NOT_FOUND));
    }

    @Override
    public BailVillaDto findByName(String nom) {
        log.info("We are going to get back the Bail By {}", nom);
        if (!StringUtils.hasLength(nom)) {
            log.error("you are not provided a Bail.");
            return null;
        }
        return bailLocationRepository.findByDesignationBail(nom).map(bailMapper::fromBailVilla).orElseThrow(
                () -> new InvalidEntityException("Aucun Bail has been found with name " + nom,
                        ErrorCodes.BAILLOCATION_NOT_FOUND));
    }

    @Override
    public List<BailVillaDto> findAllByIdBienImmobilier(Long id) {

        return null;
    }

    @Override
    public List<BailVillaDto> findAllByIdLocataire(Long id) {

        return null;
    }

}
