package com.bzdata.gestimospringbackend.common.security.model;

import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@AllArgsConstructor
@NoArgsConstructor
public class UserPrincipal implements UserDetails {
    private Utilisateur utilisateur;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return stream(this.utilisateur.getAuthorities())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
//    public  Long getIdCreateur()
//    {return  this.utilisateur.getUserCreate().getId();}
    public Long getIdAgence() {
        return this.utilisateur.getIdAgence();
    }
    @Override
    public String getPassword() {
        return this.utilisateur.getPassword();
    }

    @Override
    public String getUsername() {
        return this.utilisateur.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.utilisateur.isNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.utilisateur.isActive();
    }
}
