package com.bzdata.gestimospringbackend.fne.exception;

import lombok.Getter;

/**
 * Erreur retournée par la plateforme FNE (400 requête invalide, 401
 * authentification, 500 endpoint indisponible) ou erreur technique
 * (timeout, réponse illisible) lors d'un appel de certification.
 */
@Getter
public class FneApiException extends RuntimeException {

  private final int statusCode;
  private final String errorCode;

  public FneApiException(int statusCode, String errorCode, String message) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }

  public FneApiException(String message, Throwable cause) {
    super(message, cause);
    this.statusCode = -1;
    this.errorCode = "technical_error";
  }
}
