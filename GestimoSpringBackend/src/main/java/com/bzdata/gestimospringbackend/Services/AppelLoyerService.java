package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.DTOs.AnneeAppelLoyersDto;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyerDto;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyerRequestDto;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.PeriodeDto;
import com.bzdata.gestimospringbackend.DTOs.PourcentageAppelDto;
import com.bzdata.gestimospringbackend.DTOs.StatistiquePeriodeDto;
import java.time.LocalDate;
import java.util.List;

public interface AppelLoyerService {
  List<String> save(AppelLoyerRequestDto dto);

  boolean cloturerAppelDto(Long id);

  List<AppelLoyersFactureDto> findAll(Long idAgence);

  AppelLoyersFactureDto getFirstLoyerImpayerByBien(Long bienImmobilier);

  List<AppelLoyersFactureDto> findAllAppelLoyerByPeriode(
    String periodeAppelLoyer,
    Long idAgence
  );

  List<AppelLoyersFactureDto> reductionLoyerByPeriode(
    PourcentageAppelDto pourcentageAppelDto
  );

  public double soldeArrierer(Long idBailLocation);

  boolean miseAjourDesUnlockDesBaux(Long idAgence);

  AppelLoyersFactureDto findById(Long id);

  List<AppelLoyerDto> findAllAppelLoyerByBailId(Long idBailLocation);

  List<AppelLoyersFactureDto> supprimerLoyerPayer(
    Long periode,
    Long idBailLocation
  );

  List<Long> getAllIbOperationInAppel(Long idAgence);

  List<Integer> listOfDistinctAnnee(Long idAgence);

  List<PeriodeDto> listOfPerodesByAnnee(Integer annee, Long idAgence);

  List<PeriodeDto> findAllPeriode(Long idAgence);

  List<AnneeAppelLoyersDto> listOfAppelLoyerByAnnee(
    Integer annee,
    Long idAgence
  );

  List<AppelLoyersFactureDto> findAllAppelLoyerImpayerByBailId(
    Long idBailLocation
  );

  List<AppelLoyersFactureDto> findAllForRelance(Long idAgence);

  double impayeParPeriode(String periode, Long idAgence, Long chapitre);

  double payeParPeriode(String periode, Long idAgence, Long chapitre);

  double impayeParAnnee(int annee, Long idAgence, Long chapitre);

  double payeParAnnee(int annee, Long idAgence, Long chapitre);
  StatistiquePeriodeDto statistiquePeriode(
    String periode,
    Long idAgence,
    Long chapitre
  );
  StatistiquePeriodeDto statistiqueAnnee(
    int annee,
    Long idAgence,
    Long chapitre
  );
  Long nombreBauxImpaye(String periode, Long idAgence, Long chapitre);

  Long nombreBauxPaye(String periode, Long idAgence, Long chapitre);

  double montantBeauxImpayer(String periode, Long idAgence, Long chapitre);

  boolean deleteAppelsByIdBail(Long idBail);

  boolean sendSmsAppelLoyerGroupe(String periodeAppelLoyer, Long idAgence);

  List<AppelLoyersFactureDto> modifierMontantLoyerAppel(
    Long currentIdMontantLoyerBail,
    double nouveauMontantLoyer,
    double ancienMontantLoyer,
    Long idBailLocation,
    Long idAgence,
    LocalDate datePriseEnCompDate
  );

  List<AppelLoyersFactureDto> listeDesloyerSuperieurAUnePeriode(
    String periode,
    Long idBail
  );

  AppelLoyersFactureDto findByIdAndBail(String periode, Long idBail);

  AppelLoyersFactureDto findFirstAppelImpayerByBail(Long idBail);

  int generateAppelsForPeriod(String periodeAppelLoyer, Long idAgence);
}
