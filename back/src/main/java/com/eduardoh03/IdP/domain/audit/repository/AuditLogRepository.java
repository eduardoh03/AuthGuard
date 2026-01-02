package com.eduardoh03.IdP.domain.audit.repository;

import com.eduardoh03.IdP.domain.audit.entity.AuditLog;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository {

    AuditLog save(AuditLog auditLog);

    List<AuditLog> findByUserId(UUID userId);

    List<AuditLog> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<AuditLog> findByAction(AuditAction action);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId);

    List<AuditLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<AuditLog> findAllOrderByCreatedAtDesc();
}
