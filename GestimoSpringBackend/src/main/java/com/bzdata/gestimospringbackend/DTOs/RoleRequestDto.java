package com.bzdata.gestimospringbackend.DTOs;

import com.bzdata.gestimospringbackend.Models.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RoleRequestDto {
    Long id;
    Long idAgence;
    Long idCreateur;
    String roleName;
    String descriptionRole;
   

    public static RoleRequestDto fromEntity(Role role) {
        if (role == null) {
            return null;
        }
        return RoleRequestDto.builder()
                .id(role.getId())
                .descriptionRole(role.getDescriptionRole())
                .roleName(role.getRoleName())
                .idAgence(role.getIdAgence())
                .build();
    }

    public static Role toEntity(RoleRequestDto dto) {
        if (dto == null) {
            return null;
        }
        Role newRole = new Role();
        newRole.setId(dto.getId());
        newRole.setRoleName(dto.getRoleName());
        newRole.setIdAgence(dto.getIdAgence());
        newRole.setDescriptionRole(dto.getDescriptionRole());

        return newRole;
    }
}