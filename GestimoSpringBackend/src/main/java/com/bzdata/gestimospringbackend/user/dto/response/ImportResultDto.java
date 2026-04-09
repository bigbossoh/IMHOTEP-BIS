package com.bzdata.gestimospringbackend.user.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImportResultDto {
    private int total;
    private int success;
    private int errors;
    private List<ImportRowError> rowErrors;

    @Data
    @Builder
    public static class ImportRowError {
        private int row;
        private String message;
    }
}
