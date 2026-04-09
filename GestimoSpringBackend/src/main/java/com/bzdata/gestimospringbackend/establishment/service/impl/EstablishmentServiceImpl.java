package com.bzdata.gestimospringbackend.establishment.service.impl;

import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import com.bzdata.gestimospringbackend.establishment.dto.request.EstablishmentRequestDto;
import com.bzdata.gestimospringbackend.establishment.dto.response.EstablishmentResponseDto;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;
import com.bzdata.gestimospringbackend.establishment.mapper.EstablishmentMapper;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementUtilisteurRepository;
import com.bzdata.gestimospringbackend.establishment.service.EstablishmentService;
import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import com.bzdata.gestimospringbackend.exceptions.InvalidEntityException;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class EstablishmentServiceImpl implements EstablishmentService {

  private final EtablissementRepository etablissementRepository;
  private final EtablissementUtilisteurRepository etablissementUtilisteurRepository;
  private final ChapitreRepository chapitreRepository;
  private final EstablishmentMapper establishmentMapper;
  private final GestimoWebMapperImpl gestimoWebMapperImpl;

  @Override
  public EstablishmentResponseDto create(EstablishmentRequestDto requestDto) {
    Etablissement entity = establishmentMapper.toEntity(requestDto);
    Etablissement saved = etablissementRepository.save(entity);
    List<EtablissementUtilisateur> users = etablissementUtilisteurRepository.findAllByEtabl_Id(
      saved.getId()
    );
    return establishmentMapper.toResponse(saved, users);
  }

  @Override
  public EstablishmentResponseDto update(
    Long id,
    EstablishmentRequestDto requestDto
  ) {
    Etablissement existing = etablissementRepository
      .findById(id)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun etablissement trouve avec l'id " + id,
          ErrorCodes.SITE_NOT_FOUND
        )
      );
    existing.setIdAgence(requestDto.getIdAgence());
    existing.setIdCreateur(requestDto.getIdCreateur());
    existing.setIdChapitre(requestDto.getIdChapitre());
    existing.setLibChapitre(requestDto.getLibChapitre());

    Etablissement saved = etablissementRepository.save(existing);
    List<EtablissementUtilisateur> users = etablissementUtilisteurRepository.findAllByEtabl_Id(
      saved.getId()
    );
    return establishmentMapper.toResponse(saved, users);
  }

  @Override
  public EstablishmentResponseDto getById(Long id) {
    Etablissement etablissement = etablissementRepository
      .findById(id)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun etablissement trouve avec l'id " + id,
          ErrorCodes.SITE_NOT_FOUND
        )
      );
    List<EtablissementUtilisateur> users = etablissementUtilisteurRepository.findAllByEtabl_Id(
      id
    );
    return establishmentMapper.toResponse(etablissement, users);
  }

  @Override
  public List<EstablishmentResponseDto> getAll() {
    return etablissementRepository
      .findAll()
      .stream()
      .map(etab ->
        establishmentMapper.toResponse(
          etab,
          etablissementUtilisteurRepository.findAllByEtabl_Id(etab.getId())
        )
      )
      .toList();
  }

  @Override
  public void delete(Long id) {
    if (!etablissementRepository.existsById(id)) {
      throw new InvalidEntityException(
        "Aucun etablissement trouve avec l'id " + id,
        ErrorCodes.SITE_NOT_FOUND
      );
    }
    etablissementRepository.deleteById(id);
  }

  @Override
  public List<UtilisateurAfficheDto> listUsersByEstablishment(Long idEtablissement) {
    return etablissementUtilisteurRepository
      .findAllByEtabl_Id(idEtablissement)
      .stream()
      .map(EtablissementUtilisateur::getUtilisateurEtabl)
      .distinct()
      .map(gestimoWebMapperImpl::fromUtilisateur)
      .toList();
  }

  @Override
  public List<DepartmentResponseDto> listDepartmentsByEstablishment(
    Long idEtablissement
  ) {
    Etablissement etablissement = etablissementRepository
      .findById(idEtablissement)
      .orElseThrow(() ->
        new InvalidEntityException(
          "Aucun etablissement trouve avec l'id " + idEtablissement,
          ErrorCodes.SITE_NOT_FOUND
        )
      );
    Optional<Chapitre> chapitreOpt = chapitreRepository.findById(
      etablissement.getIdChapitre()
    );
    if (chapitreOpt.isEmpty()) {
      return List.of();
    }
    Chapitre chapitre = chapitreOpt.get();
    return List.of(new DepartmentResponseDto(chapitre.getId(), chapitre.getLibelleChapitre()));
  }
}
