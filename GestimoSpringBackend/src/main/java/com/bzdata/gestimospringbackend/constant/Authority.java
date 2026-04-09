package com.bzdata.gestimospringbackend.constant;

public class Authority {
        public static final String[] LOCATAIRE_AUTHORITIES = { "user:read", "site:read", "pays:read" };

        public static final String[] CLIENT_HOTEL_AUTHORITIES = { "user:read", "site:read", "pays:read" };

        public static final String[] GERANT_AUTHORITIES = { "user:read", "user:update", "user:create", "pays:read" };
        
        public static final String[] PROPRIETAIRE_AUTHORITIES = { "user:read", "pays:read" };
        public static final String[] SUPERVISEUR_AUTHORITIES = { "user:read", "user:create", "user:update",
                        "pays:read" };
        public static final String[] SUPER_SUPERVISEUR_AUTHORITIES = { "user:read", "user:create", "user:update",
                        "user:delete", "pays:read", "pays:create", "pays:update", "pays:delete" };
}