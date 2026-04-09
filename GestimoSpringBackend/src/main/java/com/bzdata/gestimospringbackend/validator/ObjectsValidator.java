package com.bzdata.gestimospringbackend.validator;

import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.Validator;

import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.ConstraintViolation;
import org.springframework.stereotype.Component;

import com.bzdata.gestimospringbackend.exception.ObjectValidationException;

@Component
public class ObjectsValidator<T> {
    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private final Validator validator = factory.getValidator();
  
    public void validate(T objectToValidate) {
      Set<ConstraintViolation<T>> violations = validator.validate(objectToValidate);
      if (!violations.isEmpty()) {
        Set<String> errorMessages = violations.stream()
            .map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet());
        throw new ObjectValidationException(errorMessages, objectToValidate.getClass().getName());
      }
    }
}
