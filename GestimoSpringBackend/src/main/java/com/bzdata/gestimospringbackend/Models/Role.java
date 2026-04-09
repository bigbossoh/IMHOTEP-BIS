package com.bzdata.gestimospringbackend.Models;

import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Role extends AbstractEntity{
    String roleName;
    String descriptionRole;
    @OneToMany(mappedBy = "urole")
    List<Utilisateur> utilisateurs;
}
