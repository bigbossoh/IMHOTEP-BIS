package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bzdata.gestimospringbackend.DTOs.PrestationSaveOrUpdateDto;
import com.bzdata.gestimospringbackend.Models.hotel.Prestation;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.exceptions.InvalidOperationException;
import com.bzdata.gestimospringbackend.repository.PrestationAdditionnelReservationRepository;
import com.bzdata.gestimospringbackend.repository.PrestationRepository;
import com.bzdata.gestimospringbackend.validator.ObjectsValidator;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PrestaionServiceImplTest {

  @Mock
  private PrestationRepository prestationRepository;

  @Mock
  private PrestationAdditionnelReservationRepository prestationAdditionnelReservationRepository;

  private PrestaionServiceImpl service;

  @BeforeEach
  void setUp() {
    service =
      new PrestaionServiceImpl(
        prestationRepository,
        prestationAdditionnelReservationRepository,
        new ObjectsValidator<>()
      );
  }

  @Test
  void saveOrUpdate_createsWhenIdIsZero() {
    PrestationSaveOrUpdateDto dto = new PrestationSaveOrUpdateDto();
    dto.setId(0L);
    dto.setIdAgence(10L);
    dto.setIdCreateur(2L);
    dto.setName("Petit déjeuner");
    dto.setAmount(2500);

    when(prestationRepository.save(any(Prestation.class)))
      .thenAnswer(invocation -> {
        Prestation entity = invocation.getArgument(0);
        entity.setId(1L);
        return entity;
      });

    PrestationSaveOrUpdateDto saved = service.saveOrUpdate(dto);

    assertNotNull(saved);
    assertEquals(1L, saved.getId());
    assertEquals("Petit déjeuner", saved.getName());
    verify(prestationRepository, never()).findById(anyLong());
    verify(prestationRepository).save(any(Prestation.class));
  }

  @Test
  void saveOrUpdate_updatesWhenIdExists() {
    Prestation existing = new Prestation();
    existing.setId(5L);
    existing.setName("Ancien");
    existing.setAmount(1000);

    when(prestationRepository.findById(5L)).thenReturn(Optional.of(existing));
    when(prestationRepository.save(any(Prestation.class))).thenAnswer(invocation -> invocation.getArgument(0));

    PrestationSaveOrUpdateDto dto = new PrestationSaveOrUpdateDto();
    dto.setId(5L);
    dto.setIdAgence(10L);
    dto.setIdCreateur(2L);
    dto.setName("Nouveau");
    dto.setAmount(2000);

    PrestationSaveOrUpdateDto updated = service.saveOrUpdate(dto);

    assertEquals(5L, updated.getId());
    assertEquals("Nouveau", updated.getName());
    assertEquals(2000, updated.getAmount());
    verify(prestationRepository).findById(5L);
    verify(prestationRepository).save(existing);
  }

  @Test
  void saveOrUpdate_throwsWhenUpdatingMissingPrestation() {
    when(prestationRepository.findById(77L)).thenReturn(Optional.empty());

    PrestationSaveOrUpdateDto dto = new PrestationSaveOrUpdateDto();
    dto.setId(77L);
    dto.setIdAgence(10L);
    dto.setIdCreateur(2L);
    dto.setName("Service");
    dto.setAmount(1000);

    assertThrows(EntityNotFoundException.class, () -> service.saveOrUpdate(dto));
  }

  @Test
  void delete_blocksWhenUsedInReservations() {
    Prestation existing = new Prestation();
    existing.setId(8L);
    existing.setName("Navette");
    existing.setAmount(5000);

    when(prestationRepository.findById(8L)).thenReturn(Optional.of(existing));
    when(prestationAdditionnelReservationRepository.countByServiceAdditionnelle_Id(8L)).thenReturn(2L);

    assertThrows(InvalidOperationException.class, () -> service.delete(8L));
  }
}

