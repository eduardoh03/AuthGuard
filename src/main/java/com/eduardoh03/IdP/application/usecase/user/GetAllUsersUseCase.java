package com.eduardoh03.IdP.application.usecase.user;

import com.eduardoh03.IdP.application.dto.response.UserResponse;
import com.eduardoh03.IdP.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllUsersUseCase {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> execute() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
    }
}
