package com.eduardoh03.IdP.infrastructure.persistence;

import com.eduardoh03.IdP.domain.audit.entity.AuditLog;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import com.eduardoh03.IdP.domain.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditLogRepositoryAdapter implements AuditLogRepository {

    private final JpaAuditLogRepository jpaAuditLogRepository;

    @Override
    public AuditLog save(AuditLog auditLog) {
        return jpaAuditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLog> findByUserId(UUID userId) {
        return jpaAuditLogRepository.findByUserId(userId);
    }

    @Override
    public List<AuditLog> findByUserIdOrderByCreatedAtDesc(UUID userId) {
        return jpaAuditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<AuditLog> findByAction(AuditAction action) {
        return jpaAuditLogRepository.findByAction(action);
    }

    @Override
    public List<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId) {
        return jpaAuditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    @Override
    public List<AuditLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return jpaAuditLogRepository.findByCreatedAtBetween(start, end);
    }

    @Override
    public List<AuditLog> findAllOrderByCreatedAtDesc() {
        return jpaAuditLogRepository.findAllOrderByCreatedAtDesc();
    }
}
