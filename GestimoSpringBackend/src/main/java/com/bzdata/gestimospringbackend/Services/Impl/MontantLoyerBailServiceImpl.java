package com.bzdata.gestimospringbackend.Services.Impl;

import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.MontantLoyerBailDto;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.Services.MontantLoyerBailService;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.BailMapperImpl;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.MontantLoyerBailRepository;

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
public class MontantLoyerBailServiceImpl implements MontantLoyerBailService {
    final BailMapperImpl bailMapperImpl;
    final MontantLoyerBailRepository montantLoyerBailRepository;
    final BailLocationRepository bailLocationRepository;

    @Override
    public boolean saveNewMontantLoyerBail(Long currentIdMontantLoyerBail, double nouveauMontantLoyer,
            double ancienMontantLoyer, Long idBailLocation, Long idAgence, LocalDate datePriseEnCompDate) {
        log.info("We are going to create  a new  {} {} {}", nouveauMontantLoyer, idBailLocation, idAgence);

        try {

            MontantLoyerBail newMontantLoyerBail = new MontantLoyerBail();
            BailLocation bailLocation = bailLocationRepository.findById(idBailLocation)
                    .orElseThrow(() -> new InvalidEntityException("Aucun BailMagasin has been found with Code " +
                            idBailLocation,
                            ErrorCodes.BAILLOCATION_NOT_FOUND));
            List<MontantLoyerBail> listBauxMontantLoyerBail = montantLoyerBailRepository
                    .findByBailLocation(bailLocation);
            Optional<MontantLoyerBail> oldMontantBail = montantLoyerBailRepository.findById(currentIdMontantLoyerBail);
            if (oldMontantBail.isPresent()) {
                newMontantLoyerBail.setId(oldMontantBail.get().getId());
            }
            if (listBauxMontantLoyerBail.isEmpty()) {
                newMontantLoyerBail.setAncienMontantLoyer(0);
                newMontantLoyerBail.setTauxLoyer(0);
                newMontantLoyerBail.setMontantAugmentation((nouveauMontantLoyer - ancienMontantLoyer));
                newMontantLoyerBail.setDebutLoyer(bailLocation.getDateDebut());
                newMontantLoyerBail.setFinLoyer(bailLocation.getDateFin());
                newMontantLoyerBail.setIdAgence(bailLocation.getIdAgence());
                newMontantLoyerBail.setBailLocation(bailLocation);
                newMontantLoyerBail.setNouveauMontantLoyer(nouveauMontantLoyer);
                newMontantLoyerBail.setStatusLoyer(true);
                montantLoyerBailRepository.save(newMontantLoyerBail);
            } else {
                Optional<MontantLoyerBail> firstMontantLoyerBail = listBauxMontantLoyerBail.stream()
                        .filter(MontantLoyerBail::isStatusLoyer)
                        .findFirst();
                if (firstMontantLoyerBail.get().getAncienMontantLoyer() != 0) {
                    newMontantLoyerBail.setTauxLoyer(
                            (nouveauMontantLoyer - firstMontantLoyerBail.get().getAncienMontantLoyer()) * 100
                                    / firstMontantLoyerBail.get().getAncienMontantLoyer());
                }

                newMontantLoyerBail.setId(firstMontantLoyerBail.get().getId());
                if (firstMontantLoyerBail.get().getNouveauMontantLoyer() != nouveauMontantLoyer) {
                    YearMonth ym1 = YearMonth.of(datePriseEnCompDate.getYear(), datePriseEnCompDate.getMonth());
                    YearMonth ym2 = ym1.minus(Period.ofMonths(1));
                    LocalDate initial = LocalDate.of(ym2.getYear(), ym2.getMonth(), 1);
                    // firstMontantLoyerBail.get()
                    // .setAncienMontantLoyer(firstMontantLoyerBail.get().getNouveauMontantLoyer());
                    // firstMontantLoyerBail.get().setFinLoyer(bailLocation.getDateFin());
                    firstMontantLoyerBail.get().setFinLoyer(initial);
                    firstMontantLoyerBail.get().setStatusLoyer(false);
                    montantLoyerBailRepository.save(firstMontantLoyerBail.get());
                }
                MontantLoyerBail nouvelleLigne = new MontantLoyerBail();
                nouvelleLigne.setAncienMontantLoyer(ancienMontantLoyer);
                nouvelleLigne.setMontantAugmentation((nouveauMontantLoyer - ancienMontantLoyer));
                nouvelleLigne.setDebutLoyer(datePriseEnCompDate);
                nouvelleLigne.setFinLoyer(bailLocation.getDateFin());
                nouvelleLigne.setIdAgence(bailLocation.getIdAgence());
                nouvelleLigne.setBailLocation(bailLocation);
                nouvelleLigne.setNouveauMontantLoyer(nouveauMontantLoyer);
                nouvelleLigne.setStatusLoyer(true);
                nouvelleLigne.setMontantAugmentation((nouveauMontantLoyer - ancienMontantLoyer));
                // nouvelleLigne.setDebutLoyer(bailLocation.getDateDebut());
                if (ancienMontantLoyer != 0) {
                    nouvelleLigne.setTauxLoyer(
                            (nouveauMontantLoyer - ancienMontantLoyer) * 100
                                    / ancienMontantLoyer);
                }
                montantLoyerBailRepository.save(nouvelleLigne);
            }

            return true;
        } catch (Exception e) {
            throw new InvalidEntityException(
                    "Erreur : " + e.getMessage());
        }
    }

    @Override
    public MontantLoyerBailDto updateNewMontantLoyerBail(MontantLoyerBailDto dto) {
        return null;
    }

    @Override
    public boolean delete(Long id) {
        return false;
    }

    @Override
    public List<MontantLoyerBailDto> findAll(Long idAgence) {

        return null;
    }

    @Override
    public MontantLoyerBailDto findById(Long id) {
        return null;
    }

    @Override
    public List<MontantLoyerBailDto> findAllMontantLoyerBailByBailId(Long idBailLocation) {
        BailLocation bailLocation = bailLocationRepository.findById(idBailLocation)
                .orElseThrow(() -> new InvalidEntityException("Aucun BailMagasin has been found with Code " +
                        idBailLocation,
                        ErrorCodes.BAILLOCATION_NOT_FOUND));
        List<MontantLoyerBail> listBauxMontantLoyerBail = montantLoyerBailRepository.findByBailLocation(bailLocation);

        return listBauxMontantLoyerBail.stream()
                .filter(montantLoyerBail -> montantLoyerBail.isStatusLoyer() == true)
                // .findFirst()
                .map(bailMapperImpl::fromMontantLoyerBail)
                .collect(Collectors.toList());

    }

    @Override
    public boolean supprimerUnMontantParIdBail(Long idBail) {
        List<MontantLoyerBail> montantLoyerBails = montantLoyerBailRepository.findAll().stream()
                .filter(bail -> bail.getBailLocation().getId() == idBail).collect(Collectors.toList());
        if (!montantLoyerBails.isEmpty()) {
            for (int index = 0; index < montantLoyerBails.size() - 1; index++) {
                System.out.println(montantLoyerBails.get(index));
                montantLoyerBailRepository.delete(montantLoyerBails.get(index));
            }
        } else {
            return false;
        }
        return true;
    }
}
