package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.Services.StudioService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudioServiceImpl implements StudioService {

//    final StudioRepository studioRepository;
//    final UtilisateurRepository utilisateurRepository;
//    final EtageRepository etageRepository;
//    final SiteRepository siteRepository;
//
//    @Override
//    public boolean save(StudioDto dto) {
//
//        return false;
//    }
//
//    @Override
//    public boolean delete(Long id) {
//        log.info("We are going to delete a Studio with the ID {}", id);
//        if (id == null) {
//            log.error("you are provided a null ID for the Studio");
//            return false;
//        }
//        boolean exist = studioRepository.existsById(id);
//        if (!exist) {
//            throw new EntityNotFoundException("Aucune Studio avec l'ID = " + id + " "
//                    + "n' ete trouve dans la BDD", ErrorCodes.STUDIO_NOT_FOUND);
//        }
//
//        studioRepository.deleteById(id);
//        return true;
//    }
//
//    @Override
//    public List<StudioDto> findAll() {
//        return studioRepository.findAll(Sort.by(Direction.ASC, "nomStudio")).stream()
//                .map(StudioDto::fromEntity)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public StudioDto findById(Long id) {
//        log.info("We are going to get back the Studio By {}", id);
//        if (id == null) {
//            log.error("you are not provided a Studio.");
//            return null;
//        }
//        return studioRepository.findById(id).map(StudioDto::fromEntity).orElseThrow(
//                () -> new InvalidEntityException("Aucun Studio has been found with Code " + id,
//                        ErrorCodes.STUDIO_NOT_FOUND));
//    }
//
//    @Override
//    public StudioDto findByName(String nom) {
//        log.info("We are going to get back the Studio By {}", nom);
//        if (!StringUtils.hasLength(nom)) {
//            log.error("you are not provided a Studio.");
//            return null;
//        }
//        return studioRepository.findByNomCompletBienImmobilier(nom)
//                .map(StudioDto::fromEntity)
//                .orElseThrow(
//                () -> new InvalidEntityException("Aucun Studio has been found with name " + nom,
//                        ErrorCodes.STUDIO_NOT_FOUND));
//    }
//
//    @Override
//    public List<StudioDto> findAllByIdEtage(Long id) {
//        log.info("We are going to get back the Studio By {}", id);
//        if (id == null) {
//            log.error("you are not provided a Studio.");
//            return null;
//        }
//        Etage etage = etageRepository.findById(id).orElseThrow(() -> new InvalidEntityException(
//                "Aucun étage trouvé",
//                ErrorCodes.ETAGE_NOT_FOUND));
//        if (etage == null) {
//            log.error("Studio not found for the Etage.");
//            return null;
//        }
//        return studioRepository.findByEtageStudio(etage).stream()
//                .map(StudioDto::fromEntity)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<StudioDto> findAllLibre() {
//        return studioRepository.findAll(Sort.by(Direction.ASC, "nomStudio")).stream()
//                .map(StudioDto::fromEntity)
//                .filter((stud) -> stud.isOccupied() == false)
//                .collect(Collectors.toList());
//    }

}
