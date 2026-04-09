package com.bzdata.gestimospringbackend.DTOs;

import java.util.Objects;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnneeAppelLoyersDto {

    String periodeLettre;
    String periodeAppelLoyer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AnneeAppelLoyersDto)) return false;
        AnneeAppelLoyersDto that = (AnneeAppelLoyersDto) o;
        return Objects.equals(getPeriodeLettre(), that.getPeriodeLettre());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPeriodeLettre());
    }
}
