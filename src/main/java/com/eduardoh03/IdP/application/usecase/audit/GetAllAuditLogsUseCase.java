package com.eduardoh03.IdP.application.usecase.audit;

import com.eduardoh03.IdP.application.dto.response.AuditLogResponse;
import com.eduardoh03.IdP.domain.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllAuditLogsUseCase {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLogResponse> execute() {
        return auditLogRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(AuditLogResponse::fromEntity)
                .toList();
    }
}
