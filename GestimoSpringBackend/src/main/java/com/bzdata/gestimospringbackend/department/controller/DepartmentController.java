package com.bzdata.gestimospringbackend.department.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import com.bzdata.gestimospringbackend.department.dto.request.DepartmentRequestDto;
import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import com.bzdata.gestimospringbackend.department.service.DepartmentService;
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
@RequestMapping(APP_ROOT + "/departments")
@RequiredArgsConstructor
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class DepartmentController {

  private final DepartmentService departmentService;

  @PostMapping
  public ResponseEntity<DepartmentResponseDto> create(
    @RequestBody DepartmentRequestDto requestDto
  ) {
    return ResponseEntity.ok(departmentService.create(requestDto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<DepartmentResponseDto> update(
    @PathVariable Long id,
    @RequestBody DepartmentRequestDto requestDto
  ) {
    return ResponseEntity.ok(departmentService.update(id, requestDto));
  }

  @GetMapping("/{id}")
  public ResponseEntity<DepartmentResponseDto> getById(@PathVariable Long id) {
    return ResponseEntity.ok(departmentService.getById(id));
  }

  @GetMapping
  public ResponseEntity<List<DepartmentResponseDto>> getAll() {
    return ResponseEntity.ok(departmentService.getAll());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    departmentService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
