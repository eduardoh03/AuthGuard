package com.eduardoh03.IdP.interfaces.controller;

import com.eduardoh03.IdP.application.dto.request.ChangePasswordRequest;
import com.eduardoh03.IdP.application.dto.request.ChangeRoleRequest;
import com.eduardoh03.IdP.application.dto.request.CreateUserRequest;
import com.eduardoh03.IdP.application.dto.request.UpdateUserRequest;
import com.eduardoh03.IdP.application.dto.response.AdminUserResponse;
import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.application.usecase.user.*;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import com.eduardoh03.IdP.infrastructure.security.UserOwnershipValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CreateUserUseCase createUserUseCase;
    private final GetUserByIdUseCase getUserByIdUseCase;
    private final GetAllUsersUseCase getAllUsersUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    private final ChangeRoleUseCase changeRoleUseCase;
    private final UserRepository userRepository;
    private final UserOwnershipValidator ownershipValidator;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = createUserUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Get current authenticated user's profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        String email = ownershipValidator.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado"));
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    /**
     * Change current user's password
     */
    @PatchMapping("/me/password")
    public ResponseEntity<UserResponse> changeCurrentUserPassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        String email = ownershipValidator.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado"));
        UserResponse response = changePasswordUseCase.execute(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        // Validate ownership - admin can access any, user only their own
        ownershipValidator.validateOwnership(id);
        UserResponse user = getUserByIdUseCase.execute(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        // SecurityConfig already restricts this to ADMIN only - return detailed info
        List<User> users = userRepository.findAll();
        List<AdminUserResponse> response = users.stream()
                .map(AdminUserResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        // Validate ownership - admin can update any, user only their own
        ownershipValidator.validateOwnership(id);
        UserResponse user = updateUserUseCase.execute(id, request);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<UserResponse> changePassword(
            @PathVariable UUID id,
            @Valid @RequestBody ChangePasswordRequest request) {
        // Validate ownership - admin can change any, user only their own
        ownershipValidator.validateOwnership(id);
        UserResponse user = changePasswordUseCase.execute(id, request);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> changeRole(
            @PathVariable UUID id,
            @Valid @RequestBody ChangeRoleRequest request) {
        // SecurityConfig already restricts this to ADMIN only
        UserResponse user = changeRoleUseCase.execute(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        // Validate ownership - admin can delete any, user only their own
        ownershipValidator.validateOwnership(id);
        deleteUserUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
