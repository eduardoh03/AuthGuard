package com.eduardoh03.IdP.interfaces.controller;

import com.eduardoh03.IdP.application.dto.response.AuditLogResponse;
import com.eduardoh03.IdP.application.usecase.audit.GetAllAuditLogsUseCase;
import com.eduardoh03.IdP.application.usecase.audit.GetAuditLogsByUserUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final GetAuditLogsByUserUseCase getAuditLogsByUserUseCase;
    private final GetAllAuditLogsUseCase getAllAuditLogsUseCase;

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAllAuditLogs() {
        List<AuditLogResponse> logs = getAllAuditLogsUseCase.execute();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByUser(@PathVariable UUID userId) {
        List<AuditLogResponse> logs = getAuditLogsByUserUseCase.execute(userId);
        return ResponseEntity.ok(logs);
    }
}
