package etikos.auth_register.service;

import etikos.auth_register.entity.PasswordResetToken;
import etikos.auth_register.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    public final PasswordResetTokenRepository repo;
    private final EmailService emailService;

    @Value("${app.otp-expiration-minutes}")
    private int otpMinutes;

    public PasswordResetService(PasswordResetTokenRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public PasswordResetToken createToken(UUID userId, String code) {
        PasswordResetToken t = new PasswordResetToken();
        t.setUserId(userId);
        t.setCode(code);
        t.setExpiresAt(LocalDateTime.now().plusMinutes(otpMinutes));
        return repo.save(t);
    }

    public Optional<PasswordResetToken> findByCode(String code) {
        return repo.findByCode(code).filter(t -> !t.isUsed() && t.getExpiresAt().isAfter(LocalDateTime.now()));
    }
}

