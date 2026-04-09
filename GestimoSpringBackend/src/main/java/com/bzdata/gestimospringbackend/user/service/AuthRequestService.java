package com.bzdata.gestimospringbackend.user.service;

import com.bzdata.gestimospringbackend.user.dto.request.AuthRequestDto;
import com.bzdata.gestimospringbackend.user.dto.response.AuthResponseDto;

public interface AuthRequestService {

    AuthResponseDto authenticate( AuthRequestDto dto);
}
