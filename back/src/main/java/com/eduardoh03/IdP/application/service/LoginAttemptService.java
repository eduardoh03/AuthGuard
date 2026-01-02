package com.eduardoh03.IdP.application.service;

import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class LoginAttemptService {

    private final UserRepository userRepository;

    @Value("${security.max-failed-attempts}")
    private int maxFailedAttempts;

    @Value("${security.lockout-duration-minutes}")
    private int lockoutDurationMinutes;

    public LoginAttemptService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailedAttempt(User user) {
        // Refetch user in new transaction to get fresh state
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        freshUser.incrementFailedAttempts();
        log.warn("Failed login attempt for user: {}. Attempt count: {}",
                freshUser.getEmail(), freshUser.getFailedLoginAttempts());

        if (freshUser.getFailedLoginAttempts() >= maxFailedAttempts) {
            freshUser.lockAccount(lockoutDurationMinutes);
            log.warn("Account locked for user: {} for {} minutes",
                    freshUser.getEmail(), lockoutDurationMinutes);
        }

        userRepository.save(freshUser);
    }

    @Transactional
    public void recordSuccessfulLogin(User user) {
        if (user.getFailedLoginAttempts() > 0) {
            user.resetFailedAttempts();
            userRepository.save(user);
            log.info("Login successful, reset failed attempts for user: {}", user.getEmail());
        }
    }

    public boolean isAccountLocked(User user) {
        return user.isAccountLocked();
    }

    public long getRemainingLockoutMinutes(User user) {
        if (user.getLockoutEndTime() == null) {
            return 0;
        }
        java.time.Duration duration = java.time.Duration.between(
                java.time.LocalDateTime.now(), user.getLockoutEndTime());
        return Math.max(0, duration.toMinutes());
    }
}
