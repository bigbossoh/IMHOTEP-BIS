package com.bzdata.gestimospringbackend.Services.Impl;

import java.util.List;
import java.util.stream.Collectors;

import com.bzdata.gestimospringbackend.DTOs.PrestationAdditionnelReservationSaveOrrUpdate;
import com.bzdata.gestimospringbackend.Models.hotel.Prestation;
import com.bzdata.gestimospringbackend.Models.hotel.PrestationAdditionnelReservation;
import com.bzdata.gestimospringbackend.Models.hotel.Reservation;
import com.bzdata.gestimospringbackend.Services.PrestationAdditionnelReseravtionService;
import com.bzdata.gestimospringbackend.mappers.GestimoWebMapperImpl;
import com.bzdata.gestimospringbackend.repository.PrestationAdditionnelReservationRepository;
import com.bzdata.gestimospringbackend.repository.PrestationRepository;
import com.bzdata.gestimospringbackend.repository.ReservationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrestationAdditionnelReseravtionServiceImp implements PrestationAdditionnelReseravtionService{
    final PrestationAdditionnelReservationRepository prestationAdditionnelReservationRepository;
    final ReservationRepository reservationRepository;
    final PrestationRepository prestationRepository;
    final GestimoWebMapperImpl gestimoWebMapperImpl;
    @Override
    public Long save(PrestationAdditionnelReservationSaveOrrUpdate dto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }

    @Override
    public List<PrestationAdditionnelReservationSaveOrrUpdate> findAll() {
        return prestationAdditionnelReservationRepository.findAll()
        .stream()
        //.sorted(Comparator.comparing(PrestationAdditionnelReservation::getServiceAdditionnelle))
        .map(GestimoWebMapperImpl::fromPrestationAdditionnelReservation)
        .collect(Collectors.toList());
    }

    @Override
    public PrestationAdditionnelReservationSaveOrrUpdate findById(Long id) {
        PrestationAdditionnelReservation serviceAdditionnelle = prestationAdditionnelReservationRepository.findById(id).orElse(null);
        if (serviceAdditionnelle != null) {
            return GestimoWebMapperImpl.fromPrestationAdditionnelReservation(serviceAdditionnelle);
        } else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        PrestationAdditionnelReservation serviceAdditionnelle = prestationAdditionnelReservationRepository.findById(id).orElse(null);
        if (serviceAdditionnelle != null) {
            prestationAdditionnelReservationRepository.delete(serviceAdditionnelle);
        } else {
            throw new UnsupportedOperationException("Unimplemented method 'delete'");
        }
    }

    @Override
    public PrestationAdditionnelReservationSaveOrrUpdate saveOrUpdate(
            PrestationAdditionnelReservationSaveOrrUpdate dto) {
        Reservation reservation = reservationRepository.findById(dto.getIdReservation()).orElse(null);
        Prestation prestation = prestationRepository.findById(dto.getIdServiceAdditionnelle()).orElse(null);
        if (reservation!=null&&prestation!=null) {
            PrestationAdditionnelReservation prestationAdditionnelReservation = new PrestationAdditionnelReservation();
            prestationAdditionnelReservation.setReservation(reservation);
            prestationAdditionnelReservation.setServiceAdditionnelle(prestation);
            PrestationAdditionnelReservation sPrestationAdditionnelReservation = prestationAdditionnelReservationRepository
                    .save(prestationAdditionnelReservation);
            return GestimoWebMapperImpl.fromPrestationAdditionnelReservation(sPrestationAdditionnelReservation);
        }
        return null;
    }

}
