package com.eduardoh03.IdP.infrastructure.security;

import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Validates if the current user has ownership over a resource.
 * ADMIN users can access any resource, regular users only their own.
 */
@Component
@RequiredArgsConstructor
public class UserOwnershipValidator {

    private final UserRepository userRepository;

    /**
     * Validates if the current authenticated user can access the resource with the
     * given userId.
     * 
     * @param resourceUserId The UUID of the user resource being accessed
     * @throws AccessDeniedException if the user doesn't have permission
     */
    public void validateOwnership(UUID resourceUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Autenticação necessária");
        }

        // Admin can access any resource
        if (isCurrentUserAdmin()) {
            return;
        }

        // Get current user ID from email
        String currentUserEmail = auth.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado"));

        if (!currentUser.getId().equals(resourceUserId)) {
            throw new AccessDeniedException("Você não tem permissão para acessar este recurso");
        }
    }

    /**
     * Checks if the current user is an admin.
     */
    public boolean isCurrentUserAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return false;

        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    /**
     * Gets the current user's email from the security context.
     */
    public String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return null;
        return auth.getName();
    }
}
