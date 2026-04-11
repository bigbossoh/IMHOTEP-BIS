package com.bzdata.gestimospringbackend.common.constant;

public class SecurityConstant {

    public static final long EXPIRATION_TIME = 864_000_000; // 10 days expressed
    public static final String APP_ROOT = "gestimoweb/api/v1";
    public static final String AUTHENTICATION_ENDPOINT = APP_ROOT + "/auth";
    public static final String ACTIVATION_EMAIL = "http://localhost:8282/" + APP_ROOT + "/auth/accountVerification";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Jwt-Token";
    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
    public static final String BZDATA_SARL = "BZDATA, Sarl";
    public static final String BZDATA_ADMINISTRATION = "User Management System";
    public static final String AUTHORITIES = "authorities";
    public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String[] PUBLIC_URLS = {
            "/**/envoimail/**","/gestimoweb/api/v1/image","/**/bail/**","/actuator/**","/**/categoriechambre/**",
            "/gestimoweb/api/v1/auth/login", "/**/accountVerification/**", "/login","/**/prixparcategorie/**",
            "/swagger-ui/**", "/v3/api-docs/**", "/**/print/**", "/**/magasin/**","/**/etablissement/**",
             "/**/bienImmobilier/**","/**/suiviedepense/**","/**/droitAccess/**","/**/appartement/**","/**/image/**","/**/cloturecaisse/**","/**/reservation/**",
             "/**/public/**", "/**/utilisateur/password-reset/**"
             
    };
    // public static final String[] PUBLIC_URLS = { "**" };
    // "/**/utilisateurs/singup",
}
