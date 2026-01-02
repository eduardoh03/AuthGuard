package com.eduardoh03.IdP.application.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    private static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#+\\-_=()\\[\\]{}|;:',.<>\\/\\\\^`~])[A-Za-z\\d@$!%*?&#+\\-_=()\\[\\]{}|;:',.<>\\/\\\\^`~]{8,}$";

    @Override
    public void initialize(StrongPassword constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isBlank()) {
            return true; // Let @NotBlank handle null/blank validation
        }
        return password.matches(PASSWORD_PATTERN);
    }
}
