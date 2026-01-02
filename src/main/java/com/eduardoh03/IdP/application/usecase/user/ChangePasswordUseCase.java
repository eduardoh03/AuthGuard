package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.dto.request.ChangePasswordRequest;
import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.application.exception.InvalidCredentialsException;
import com.eduardoh03.IdP.application.exception.ResourceNotFoundException;
import com.eduardoh03.IdP.application.service.AuditService;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChangePasswordUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @Transactional
    public UserResponse execute(UUID userId, ChangePasswordRequest request) {
        System.err.println("ChangePasswordUseCase.execute");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + userId));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            log.warn("Change password failed - invalid current password for user: {}", user.getEmail());
            throw new InvalidCredentialsException("Senha atual incorreta");
        }

        // Update to new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        User updatedUser = userRepository.save(user);

        auditService.log(AuditAction.CHANGE_PASSWORD, "User", userId);

        log.info("Password changed successfully for user: {}", user.getEmail());
        return UserResponse.fromEntity(updatedUser);
    }
}
