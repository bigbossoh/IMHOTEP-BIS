package com.bzdata.gestimospringbackend.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bzdata.gestimospringbackend.DTOs.GroupeDroitDto;
import com.bzdata.gestimospringbackend.Services.GroupeDroitService;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/groupeDroit")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "gestimoapi")
public class GroupeDroitController {


  private final GroupeDroitService service;

  @PostMapping("/save")
  @Operation(summary = "Creation  d'un groupe droit", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Long> saveGroupeDroit(@RequestBody GroupeDroitDto dto) {

    log.info("We are going to save  a new groupeDroit {}", dto);
    return ResponseEntity.ok(service.save(dto));
  }

  @GetMapping("/")
  @Operation(summary = "Liste des groupes droits", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<List<GroupeDroitDto>> findAllGroupeDroit() {
    return ResponseEntity.ok(service.findAll());
  }

  @GetMapping("/{groupedroitid}")
  @Operation(summary = "Groupes droitspar id", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<GroupeDroitDto> findByIdGroupeDroit( @PathVariable("groupedroitid") Long groupedroitid ) {
    return ResponseEntity.ok(service.findById(groupedroitid));
  }

  @DeleteMapping("/{groupedroitid}")
  @Operation(summary = "delete groupe droit par id", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> deleteGroupeDroit(
      @PathVariable("groupedroitid") Long groupedroitid
  ) {
    service.delete(groupedroitid);
    return ResponseEntity.accepted().build();
  }
}