package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.exception.ResourceNotFoundException;
import com.eduardoh03.IdP.application.service.AuditService;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteUserUseCase {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public void execute(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com id: " + id);
        }

        auditService.log(AuditAction.DELETE_USER, "User", id);

        userRepository.deleteById(id);
    }
}
