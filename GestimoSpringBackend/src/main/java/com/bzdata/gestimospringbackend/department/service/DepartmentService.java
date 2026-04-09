package com.bzdata.gestimospringbackend.department.service;

import com.bzdata.gestimospringbackend.department.dto.request.DepartmentRequestDto;
import com.bzdata.gestimospringbackend.department.dto.response.DepartmentResponseDto;
import java.util.List;

public interface DepartmentService {
  DepartmentResponseDto create(DepartmentRequestDto requestDto);

  DepartmentResponseDto update(Long id, DepartmentRequestDto requestDto);

  DepartmentResponseDto getById(Long id);

  List<DepartmentResponseDto> getAll();

  void delete(Long id);
}
