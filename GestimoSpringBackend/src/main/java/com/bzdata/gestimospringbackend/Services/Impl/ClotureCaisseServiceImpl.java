package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.ClotureCaisseDto;
import com.bzdata.gestimospringbackend.Models.ClotureCaisse;
import com.bzdata.gestimospringbackend.Services.ClotureCaisseService;
import com.bzdata.gestimospringbackend.Services.EmailService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.ClotureCaisseRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class ClotureCaisseServiceImpl implements ClotureCaisseService {
final EmailService emailService;
  final ClotureCaisseRepository caisseRepository;
  final GestimoWebMapperImpl gestimoWebMapper;

  @Override
  public Long save(ClotureCaisseDto dto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'save'");
  }

  @Override
  public List<ClotureCaisseDto> findAll() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'findAll'");
  }

  @Override
  public ClotureCaisseDto findById(Long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'findById'");
  }

  @Override
  public void delete(Long id) {
    caisseRepository.deleteById(id);
  }

  @Override
  public ClotureCaisseDto saveOrUpdate(ClotureCaisseDto dto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException(
      "Unimplemented method 'saveOrUpdate'"
    );
  }

  @Override
  public int countClotureCaisse(Long idCaisse) {
    return caisseRepository.countByIdCreateur(idCaisse);
  }

  @Override
  public boolean saveClotureCaisse(ClotureCaisseDto dto) {
    log.info(" test des dto {}",dto);
    ClotureCaisse newClotureCaisse = new ClotureCaisse();
    newClotureCaisse.setChapitreCloture(dto.getChapitreCloture());
    newClotureCaisse.setIdAgence(dto.getIdAgence());
    newClotureCaisse.setIdCreateur(dto.getIdCreateur());
    newClotureCaisse.setDateDeDCloture(dto.getDateDeDCloture());
    newClotureCaisse.setDateFinCloture(dto.getDateFinCloture());
    newClotureCaisse.setIntervalNextCloture(dto.getIntervalNextCloture());
    newClotureCaisse.setTotalEncaisse(dto.getTotalEncaisse());
    newClotureCaisse.setDateNextCloture(dto.getDateNextCloture());
    ClotureCaisse clotureCaisse = caisseRepository.save(newClotureCaisse);
     DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy")
            .withZone(ZoneId.systemDefault());
        String formattedInstant = formatter.format(clotureCaisse.getCreationDate());
    String body="Veuiller recevoire l'état de la caisse du "+formattedInstant+" Sur la période de : "+clotureCaisse.getDateDeDCloture()+" - "+clotureCaisse.getDateFinCloture()+" Total Encaissé :"+clotureCaisse.getTotalEncaisse()+" F CFA ";
    String subject="Point de caisse du "+formattedInstant;
    emailService.sendMailWithAttachment("18-1155", "michel.bossoh@outlook.fr", subject, body, null);
    if (clotureCaisse != null) {
      return true;
    } else {
      return false;
    }
  }

  @Override
  public List<ClotureCaisseDto> findNonCloturerByDInferieurOuEgaleDate(
    Instant dateEnCours,
    Long idCaisse
  ) {
    return caisseRepository
      .findAll()
      .stream()
      .filter(cai ->
        cai.getCreationDate().isBefore(dateEnCours) &&
        !cai.getStatutCloture().equals("cloturer")
      )
      .map(gestimoWebMapper::fromClotureCaisse)
      .collect(Collectors.toList());
  }

  @Override
  public List<ClotureCaisseDto> findNonCloturerByDateAndCaisseAndChapitre(
    Instant dateEnCours,
    Long idCaisse,
    String idChapitre
  ) {
    return caisseRepository
      .findAll()
      .stream()
      .filter(cai ->
        cai.getCreationDate().isBefore(dateEnCours) &&
        !cai.getStatutCloture().equals("cloturer") &&
        cai.getChapitreCloture().equals(idChapitre)
      )
      .map(gestimoWebMapper::fromClotureCaisse)
      .collect(Collectors.toList());
  }

  @Override
  public List<ClotureCaisseDto> findAllCloturerCaisseByDateAndChapitre(
    Instant dateEnCours,
    Long idCaisse,
    String idChapitre
  ) {
    return caisseRepository
      .findAll()
      .stream()
      .filter(cai ->
        cai.getIdCreateur() == idCaisse &&
        cai.getChapitreCloture().equals(idChapitre) &&
        cai.getStatutCloture().equals("cloturer") &&
        cai.getCreationDate().isBefore(dateEnCours)
      )
      .map(gestimoWebMapper::fromClotureCaisse)
      .collect(Collectors.toList());
  }

  @Override
  public List<ClotureCaisseDto> findAllByCaissierAndChapitre(
    Long idCaisse,
    String idChapitre
  ) {
    return caisseRepository
      .findAll()
      .stream()
      .filter(cai ->
        cai.getIdCreateur() == idCaisse &&
        cai.getChapitreCloture().equals(idChapitre)
      )
      .map(gestimoWebMapper::fromClotureCaisse)
      .collect(Collectors.toList());
  }

  @Override
  public int countInitClotureByCaissiaireAndChampitre(
    Long idCaissiaire,
    String chapitre
  ) {
    List<ClotureCaisseDto> find = caisseRepository
      .findAll()
      .stream()
      .filter(cai ->
        cai.getIdCreateur() == idCaissiaire &&
        cai.getChapitreCloture().equals(chapitre)
      )
      .map(gestimoWebMapper::fromClotureCaisse)
      .collect(Collectors.toList());
    return find.size();
  }

  @Override
  public List<ClotureCaisseDto> findAllCloturerCaisseAgence() {
   return caisseRepository
      .findAll()
      .stream()      
      .map(gestimoWebMapper::fromClotureCaisse)
      .collect(Collectors.toList());
  }
}
