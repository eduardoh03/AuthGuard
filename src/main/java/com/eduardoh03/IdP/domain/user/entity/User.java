package com.eduardoh03.IdP.domain.user.entity;

import com.eduardoh03.IdP.domain.common.Auditable;
import com.eduardoh03.IdP.domain.user.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "lockout_end_time")
    private LocalDateTime lockoutEndTime;

    public boolean isAccountLocked() {
        if (lockoutEndTime == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(lockoutEndTime)) {
            // Lockout expired, reset
            this.lockoutEndTime = null;
            this.failedLoginAttempts = 0;
            return false;
        }
        return true;
    }

    public void incrementFailedAttempts() {
        this.failedLoginAttempts++;
    }

    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        this.lockoutEndTime = null;
    }

    public void lockAccount(int lockoutDurationMinutes) {
        this.lockoutEndTime = LocalDateTime.now().plusMinutes(lockoutDurationMinutes);
    }
}
