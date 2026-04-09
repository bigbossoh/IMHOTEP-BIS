package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Site;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class SiteRequestDto {

    Long id;
    Long idAgence;
    Long idCreateur;
    Long idQuartier;

//    String abrSite;
//    String nomSite;

    public static SiteRequestDto fromEntity(Site site) {
        if (site == null) {
            return null;
        }
        return SiteRequestDto.builder()
                .id(site.getId())
                .idQuartier(site.getQuartier().getId())
                .idAgence(site.getIdAgence())
//                .abrSite(site.getAbrSite())
//                .nomSite(site.getNomSite())
                .build();
    }

    // public static Site toEntity(SiteRequestDto dto) {
    // if (dto == null) {
    // return null;
    // }
    // Site site = new Site();
    // site.setId(dto.getId());
    // site.setIdAgence(dto.getIdAgence());
    // site.setAbrSite(org.apache.commons.lang3.StringUtils
    // .deleteWhitespace(dto.getQuartierDto().getCommuneDto().getVilleDto().getPaysDto().getAbrvPays())
    // + "-"
    // + org.apache.commons.lang3.StringUtils
    // .deleteWhitespace(dto.getQuartierDto().getCommuneDto().getVilleDto().getAbrvVille())
    // + "-"
    // + org.apache.commons.lang3.StringUtils
    // .deleteWhitespace(dto.getQuartierDto().getCommuneDto().getAbrvCommune())
    // + "-" +
    // org.apache.commons.lang3.StringUtils.deleteWhitespace(dto.getQuartierDto().getAbrvQuartier()));
    // site.setNomSite(
    // dto.getQuartierDto().getCommuneDto().getVilleDto().getPaysDto().getNomPays()
    // + "-" + dto.getQuartierDto().getCommuneDto().getVilleDto().getNomVille()
    // + "-" + dto.getQuartierDto().getCommuneDto().getNomCommune()
    // + "-" + dto.getQuartierDto().getNomQuartier());
    // site.setQuartier(QuartierDto.toEntity(dto.getQuartierDto()));
    // return site;
    // }
}