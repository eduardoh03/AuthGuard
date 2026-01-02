package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.dto.request.ChangeRoleRequest;
import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.application.exception.ResourceNotFoundException;
import com.eduardoh03.IdP.application.service.AuditService;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.enums.Role;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChangeRoleUseCase {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public UserResponse execute(UUID userId, ChangeRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + userId));

        Role newRole;
        try {
            newRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Role inválida: " + request.getRole() + ". Valores permitidos: ADMIN, USER");
        }

        Role oldRole = user.getRole();
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        auditService.log(AuditAction.CHANGE_ROLE, "User", userId,
                Map.of("oldRole", oldRole.name(), "newRole", newRole.name()));

        log.info("Role changed for user {} from {} to {}", user.getEmail(), oldRole, newRole);
        return UserResponse.fromEntity(updatedUser);
    }
}
