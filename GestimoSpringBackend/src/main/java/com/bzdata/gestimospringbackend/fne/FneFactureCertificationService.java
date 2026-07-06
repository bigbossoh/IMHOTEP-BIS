package com.bzdata.gestimospringbackend.fne;

import com.bzdata.gestimospringbackend.fne.dto.FneFactureCertificationDto;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FneFactureCertificationService {

  final FneFactureCertificationRepository repository;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Enregistrement {

    private Long idAgence;
    private String typeDocument;
    private Long idReservation;
    private String factureNumero;
    private String clientNom;
    private String etablissement;
    private String pointOfSale;
    private String modePaiement;
    private double montant;

    private boolean certifiee;
    private String fneReference;
    private String fneNcc;
    private String fneVerificationUrl;
    private Integer fneBalanceSticker;
    private boolean fneWarning;
    private String messageErreur;
  }

  /**
   * Toujours exécuté dans sa propre transaction, committée indépendamment
   * de l'appelant : la certification FNE a déjà eu lieu côté DGI (effet
   * irréversible) au moment de cet appel, donc sa trace ne doit jamais être
   * perdue si le reste du traitement (ex. génération du PDF) échoue et
   * provoque un rollback de la transaction appelante.
   */
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void enregistrer(Enregistrement enregistrement) {
    FneFactureCertification entity = new FneFactureCertification();
    entity.setIdAgence(enregistrement.getIdAgence());
    entity.setTypeDocument(enregistrement.getTypeDocument());
    entity.setIdReservation(enregistrement.getIdReservation());
    entity.setFactureNumero(enregistrement.getFactureNumero());
    entity.setClientNom(enregistrement.getClientNom());
    entity.setEtablissement(enregistrement.getEtablissement());
    entity.setPointOfSale(enregistrement.getPointOfSale());
    entity.setModePaiement(enregistrement.getModePaiement());
    entity.setMontant(enregistrement.getMontant());
    entity.setCertifiee(enregistrement.isCertifiee());
    entity.setFneReference(enregistrement.getFneReference());
    entity.setFneNcc(enregistrement.getFneNcc());
    entity.setFneVerificationUrl(enregistrement.getFneVerificationUrl());
    entity.setFneBalanceSticker(enregistrement.getFneBalanceSticker());
    entity.setFneWarning(enregistrement.isFneWarning());
    entity.setMessageErreur(enregistrement.getMessageErreur());
    repository.save(entity);
  }

  public List<FneFactureCertificationDto> listerParAgence(Long idAgence) {
    return repository
      .findAllByIdAgenceOrderByCreationDateDesc(idAgence)
      .stream()
      .map(this::toDto)
      .toList();
  }

  private FneFactureCertificationDto toDto(FneFactureCertification entity) {
    return FneFactureCertificationDto.builder()
      .id(entity.getId())
      .dateCertification(entity.getCreationDate())
      .typeDocument(entity.getTypeDocument())
      .idReservation(entity.getIdReservation())
      .factureNumero(entity.getFactureNumero())
      .clientNom(entity.getClientNom())
      .etablissement(entity.getEtablissement())
      .pointOfSale(entity.getPointOfSale())
      .modePaiement(entity.getModePaiement())
      .montant(entity.getMontant())
      .certifiee(entity.isCertifiee())
      .fneReference(entity.getFneReference())
      .fneNcc(entity.getFneNcc())
      .fneVerificationUrl(entity.getFneVerificationUrl())
      .fneBalanceSticker(entity.getFneBalanceSticker())
      .fneWarning(entity.isFneWarning())
      .messageErreur(entity.getMessageErreur())
      .build();
  }
}
