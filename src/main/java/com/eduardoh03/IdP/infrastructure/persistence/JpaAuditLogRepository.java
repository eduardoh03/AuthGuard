package com.eduardoh03.IdP.infrastructure.persistence;

import com.eduardoh03.IdP.domain.audit.entity.AuditLog;
import com.eduardoh03.IdP.domain.audit.enums.AuditAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface JpaAuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<AuditLog> findByAction(AuditAction action);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId);

    List<AuditLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM AuditLog a ORDER BY a.createdAt DESC")
    List<AuditLog> findAllOrderByCreatedAtDesc();

    List<AuditLog> findByUserId(UUID userId);
}
