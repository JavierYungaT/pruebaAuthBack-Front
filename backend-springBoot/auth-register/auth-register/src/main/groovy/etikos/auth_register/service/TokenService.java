package etikos.auth_register.service;

import etikos.auth_register.entity.RefreshToken;
import etikos.auth_register.repository.RefreshTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenService {
    public final RefreshTokenRepository repo;
    private final PasswordEncoder passwordEncoder;

    public TokenService(RefreshTokenRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public RefreshToken createRefreshToken(UUID userId, String plainToken, String deviceInfo, LocalDateTime expiresAt) {
        RefreshToken rt = new RefreshToken();
        rt.setUserId(userId);
        rt.setTokenHash(passwordEncoder.encode(plainToken));
        rt.setDeviceInfo(deviceInfo);
        rt.setExpiresAt(expiresAt);
        return repo.save(rt);
    }

    public Optional<RefreshToken> findValidByUserId(UUID userId) {
        return repo.findByUserId(userId).filter(t -> !t.isRevoked());
    }

    public boolean verifyToken(RefreshToken stored, String providedToken) {
        return passwordEncoder.matches(providedToken, stored.getTokenHash()) && !stored.isRevoked() && stored.getExpiresAt().isAfter(LocalDateTime.now());
    }

    public void revoke(RefreshToken token) {
        token.setRevoked(true);
        repo.save(token);
    }
}
