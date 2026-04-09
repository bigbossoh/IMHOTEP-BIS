package com.bzdata.gestimospringbackend.establishment.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import com.bzdata.gestimospringbackend.establishment.dto.request.EstablishmentRequestDto;
import com.bzdata.gestimospringbackend.establishment.dto.response.EstablishmentResponseDto;
import com.bzdata.gestimospringbackend.establishment.service.EstablishmentService;
import com.bzdata.gestimospringbackend.user.dto.response.UtilisateurAfficheDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(APP_ROOT + "/establishments")
@RequiredArgsConstructor
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class EstablishmentController {

  private final EstablishmentService establishmentService;

  @PostMapping
  public ResponseEntity<EstablishmentResponseDto> create(
    @RequestBody EstablishmentRequestDto requestDto
  ) {
    return ResponseEntity.ok(establishmentService.create(requestDto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<EstablishmentResponseDto> update(
    @PathVariable Long id,
    @RequestBody EstablishmentRequestDto requestDto
  ) {
    return ResponseEntity.ok(establishmentService.update(id, requestDto));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EstablishmentResponseDto> getById(@PathVariable Long id) {
    return ResponseEntity.ok(establishmentService.getById(id));
  }

  @GetMapping
  public ResponseEntity<List<EstablishmentResponseDto>> getAll() {
    return ResponseEntity.ok(establishmentService.getAll());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    establishmentService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/users")
  public ResponseEntity<List<UtilisateurAfficheDto>> listUsers(
    @PathVariable("id") Long idEtablissement
  ) {
    return ResponseEntity.ok(
      establishmentService.listUsersByEstablishment(idEtablissement)
    );
  }

  @GetMapping("/{id}/departments")
  public ResponseEntity<List<DepartmentResponseDto>> listDepartments(
    @PathVariable("id") Long idEtablissement
  ) {
    return ResponseEntity.ok(
      establishmentService.listDepartmentsByEstablishment(idEtablissement)
    );
  }
}
