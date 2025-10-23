package etikos.auth_register.service;

import etikos.auth_register.entity.AuditLog;
import etikos.auth_register.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuditService {
    private final AuditLogRepository repo;

    public AuditService(AuditLogRepository repo) {
        this.repo = repo;
    }

    public void log(UUID userId, String action, boolean success, String ip, String userAgent, String metadataJson) {
        AuditLog a = new AuditLog();
        a.setUserId(userId);
        a.setAction(action);
        a.setSuccess(success);
        a.setIpAddress(ip);
        a.setUserAgent(userAgent);
        a.setMetadata(metadataJson);
        a.setCreatedAt(LocalDateTime.now());
        repo.save(a);
    }


}
