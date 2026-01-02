package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.dto.request.CreateUserRequest;
import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.application.exception.EmailAlreadyExistsException;
import com.eduardoh03.IdP.application.service.AuditService;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.enums.Role;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CreateUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @Transactional
    public UserResponse execute(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email já está em uso");
        }

        Role role = parseRole(request.getRole());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        auditService.log(AuditAction.CREATE_USER, "User", savedUser.getId(),
                Map.of("email", savedUser.getEmail(), "role", role.name()));

        return UserResponse.fromEntity(savedUser);
    }

    private Role parseRole(String roleStr) {
        if (roleStr == null || roleStr.isBlank()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.USER;
        }
    }
}
