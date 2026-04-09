package com.bzdata.gestimospringbackend.common.security.listener;

import com.bzdata.gestimospringbackend.common.security.service.LoginAttemptService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
@Slf4j
public class AuthenticationFailureListener {
    private final LoginAttemptService loginAttemptService;

    @EventListener
    public void onAuthenticationFailure(AuthenticationFailureBadCredentialsEvent event) {
        Object principal = event.getAuthentication().getPrincipal();
        if(principal instanceof String) {

            String username = (String) event.getAuthentication().getPrincipal();
            log.error("Ce gar a echoué de authentification {}",username);
            loginAttemptService.addUserToLoginAttemptCache(username);
        }
    }
}
