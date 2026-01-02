package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.application.exception.ResourceNotFoundException;
import com.eduardoh03.IdP.domain.user.entity.User;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUserByIdUseCase {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse execute(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id: " + id));
        return UserResponse.fromEntity(user);
    }
}
