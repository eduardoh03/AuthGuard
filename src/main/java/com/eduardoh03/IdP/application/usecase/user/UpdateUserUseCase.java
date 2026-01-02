package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.dto.request.UpdateUserRequest;
import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.application.exception.EmailAlreadyExistsException;
import com.eduardoh03.IdP.application.exception.ResourceNotFoundException;
import com.eduardoh03.IdP.application.service.AuditService;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateUserUseCase {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public UserResponse execute(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));

        String oldEmail = user.getEmail();

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email já está em uso");
        }
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);

        auditService.log(AuditAction.UPDATE_USER, "User", id,
                Map.of("oldEmail", oldEmail, "newEmail", request.getEmail()));

        return UserResponse.fromEntity(updatedUser);
    }
}
