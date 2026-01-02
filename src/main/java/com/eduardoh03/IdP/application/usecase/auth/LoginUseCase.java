package com.eduardoh03.IdP.application.usecase.auth;

import com.eduardoh03.IdP.application.dto.request.LoginRequest;
import com.eduardoh03.IdP.application.dto.response.AuthResponse;
import com.eduardoh03.IdP.application.exception.AccountLockedException;
import com.eduardoh03.IdP.application.exception.InvalidCredentialsException;
import com.eduardoh03.IdP.application.service.AuditService;
import com.eduardoh03.IdP.application.service.LoginAttemptService;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import com.eduardoh03.IdP.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;
    private final AuditService auditService;

    @Transactional
    public AuthResponse execute(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}", request.getEmail());
                    auditService.log(AuditAction.LOGIN_FAILED, "User", null,
                            Map.of("email", request.getEmail(), "reason", "user_not_found"));
                    return new InvalidCredentialsException("Credenciais inválidas");
                });

        // Check if account is locked
        if (loginAttemptService.isAccountLocked(user)) {
            long remainingMinutes = loginAttemptService.getRemainingLockoutMinutes(user);
            log.warn("Login attempt on locked account: {}", request.getEmail());
            auditService.logWithUserId(user.getId(), AuditAction.LOGIN_FAILED, "User", user.getId(),
                    Map.of("reason", "account_locked"));
            throw new AccountLockedException(
                    String.format("Conta bloqueada. Tente novamente em %d minutos.", remainingMinutes));
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            loginAttemptService.recordFailedAttempt(user);
            log.warn("Login failed - invalid password for: {}", request.getEmail());
            auditService.logWithUserId(user.getId(), AuditAction.LOGIN_FAILED, "User", user.getId(),
                    Map.of("reason", "invalid_password"));
            throw new InvalidCredentialsException("Credenciais inválidas");
        }

        // Successful login - reset failed attempts
        loginAttemptService.recordSuccessfulLogin(user);
        log.info("Login successful for user: {}", request.getEmail());

        // Audit log for successful login
        auditService.logWithUserId(user.getId(), AuditAction.LOGIN, "User", user.getId(), null);

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpiration() / 1000) // Convert to seconds
                .build();
    }
}
