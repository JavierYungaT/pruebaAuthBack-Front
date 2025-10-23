package etikos.auth_register.service;

import etikos.auth_register.entity.User;
import etikos.auth_register.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String username, String rawPassword) {
        User u = new User();
        u.setEmail(email.toLowerCase());
        u.setUsername(username);
        u.setPasswordHash(passwordEncoder.encode(rawPassword));
        return userRepository.save(u);
    }
    

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    public void changePassword(User user, String newPassword) {
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void lockUser(User user, LocalDateTime until) {
        user.setLockedUntil(until);
        userRepository.save(user);
    }

    public void unlockUser(User user) {
        user.setLockedUntil(null);
        userRepository.save(user);
    }
}
