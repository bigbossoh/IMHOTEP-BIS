package com.bzdata.gestimospringbackend.enumeration;


import static com.bzdata.gestimospringbackend.constant.Authority.*;

public enum Role {
    ROLE_LOCATAIRE(LOCATAIRE_AUTHORITIES),
    ROLE_GERANT(GERANT_AUTHORITIES),
    ROLE_PROPRIETAIRE(PROPRIETAIRE_AUTHORITIES),
    ROLE_SUPERVISEUR(SUPERVISEUR_AUTHORITIES),
    ROLE_SUPER_SUPERVISEUR(SUPER_SUPERVISEUR_AUTHORITIES),
    ROLE_CLIENT_HOTEL(CLIENT_HOTEL_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
