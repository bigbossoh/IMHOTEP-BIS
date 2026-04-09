package com.bzdata.gestimospringbackend.Models.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class ExtentedUser extends User {
    @Getter
    @Setter
    private Long idAgence;

    public ExtentedUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }


    public ExtentedUser(String username, String password, Long idAgence, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.idAgence=idAgence;
    }

}
