package com.eduardoh03.IdP.domain.user.repository;

import com.eduardoh03.IdP.domain.user.entity.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsById(UUID id);

    void deleteById(UUID id);

    List<User> findAll();
}
