package com.eduardoh03.IdP.application.usecase.audit;

import com.eduardoh03.IdP.application.dto.response.AuditLogResponse;
import com.eduardoh03.IdP.domain.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetAuditLogsByUserUseCase {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLogResponse> execute(UUID userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(AuditLogResponse::fromEntity)
                .toList();
    }
}
