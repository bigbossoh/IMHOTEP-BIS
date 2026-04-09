package com.bzdata.gestimospringbackend.exception.model;

public class EmailExistException extends Exception{

    public EmailExistException(String message) {
        super(message.toUpperCase());
    }
}
