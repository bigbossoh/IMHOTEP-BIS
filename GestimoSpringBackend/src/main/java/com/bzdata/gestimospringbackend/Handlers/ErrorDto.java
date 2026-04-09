package com.bzdata.gestimospringbackend.Handlers;


import com.bzdata.gestimospringbackend.exceptions.ErrorCodes;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

@Builder
public class ErrorDto {

    private Integer httpCode;

    private ErrorCodes code;

    private String message;

    @Builder.Default
    private List<String> errors = new ArrayList<>();

}
