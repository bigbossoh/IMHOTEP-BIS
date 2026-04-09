package com.bzdata.gestimospringbackend.exception.model;

public class UserNotFoundException extends Exception{
    public UserNotFoundException(String message) {
        super(message);
    }
}
