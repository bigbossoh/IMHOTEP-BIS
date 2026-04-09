package com.bzdata.gestimospringbackend.Controllers;
import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bzdata.gestimospringbackend.DTOs.DroitAccesDTO;
import com.bzdata.gestimospringbackend.DTOs.DroitAccesPayloadDTO;
import com.bzdata.gestimospringbackend.Services.DroitAccesService;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/droitAccess")
@Slf4j
@RequiredArgsConstructor
public class DroitAccesController {
    private final DroitAccesService service;

  @PostMapping("/save")
  @Operation(summary = "Creation  d'un groupe droit", security = @SecurityRequirement(name="bearerAuth"))
  public ResponseEntity<Long> saveDroitAccess(@RequestBody DroitAccesPayloadDTO dto) {

    log.info("We are going to save  a new Droit Access {}", dto);
    return ResponseEntity.ok(service.save(dto));
  }

  @GetMapping("/")
  public ResponseEntity<List<DroitAccesDTO>> findAllDroitAccess() {
    return ResponseEntity.ok(service.findAllDroit());
  }

  @GetMapping("/{droitAccessid}")
  public ResponseEntity<DroitAccesDTO> findByIdDroitAccess( @PathVariable("droitAccessid") Long droitAccessid ) {
    return ResponseEntity.ok(service.findByDroitAccesDTOId(droitAccessid));
  }

  @DeleteMapping("/{droitAccessid}")
  public ResponseEntity<Void> deleteDroitAccess(
      @PathVariable("droitAccessid") Long droitAccessid
  ) {
    service.delete(droitAccessid);
    return ResponseEntity.accepted().build();
  }
}
