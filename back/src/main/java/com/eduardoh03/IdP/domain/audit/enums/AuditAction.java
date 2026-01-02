package com.eduardoh03.IdP.domain.audit.enums;

public enum AuditAction {
    // Authentication
    LOGIN,
    LOGIN_FAILED,
    LOGOUT,

    // Read operations
    VIEW_USER,
    LIST_USERS,

    // Write operations
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
    CHANGE_PASSWORD,
    CHANGE_ROLE,

    // Security events
    ACCOUNT_LOCKED,
    ACCOUNT_UNLOCKED
}
