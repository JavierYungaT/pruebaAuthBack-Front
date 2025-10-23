package etikos.auth_register.controller;


import etikos.auth_register.dto.*;
import etikos.auth_register.entity.PasswordResetToken;
import etikos.auth_register.entity.RefreshToken;
import etikos.auth_register.entity.User;
import etikos.auth_register.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authManager;
    private final etikos.auth_register.config.JwtUtil jwtUtil;
    private final TokenService tokenService;
    private final PasswordResetService resetService;
    private final EmailService emailService;
    private final AuditService auditService;

    @Value("${jwt.refresh-expiration}")
    private long refreshMs;

    public AuthController(UserService userService, AuthenticationManager authManager, etikos.auth_register.config.JwtUtil jwtUtil, TokenService tokenService, PasswordResetService resetService, EmailService emailService, AuditService auditService) {
        this.userService = userService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.tokenService = tokenService;
        this.resetService = resetService;
        this.emailService = emailService;
        this.auditService = auditService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest r, @RequestHeader(value = "X-Forwarded-For", required = false) String xff) {
        System.out.println("Register accessed");
        User u = userService.register(r.email, r.username, r.password);
        auditService.log(u.getId(), "REGISTER", true, xff, null, null);
        return ResponseEntity.ok().build();
    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest r, @RequestHeader(value = "X-Forwarded-For", required = false) String ip) {
//        try {
//            Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(r.email, r.password));
//            String access = jwtUtil.generateToken(r.email);
//            String refreshPlain = UUID.randomUUID().toString();
//            Optional<User> uOpt = userService.findByEmail(r.email);
//            //if (uOpt.isEmpty()) return ResponseEntity.status(401).build();
//            if (uOpt.isEmpty()) return ResponseEntity.status(401).body("Invalid credentials");
//            User u = uOpt.get();
//            // Revisar si está deshabilitado permanentemente
//            if (!u.isEnabled()) {
//                auditService.log(u.getId(), "LOGIN_DISABLED", false, ip, null, null);
//                return ResponseEntity.status(403).body("User is disabled");
//            }
//
//            // Revisar bloqueo temporal
//            if (u.getLockedUntil() != null && u.getLockedUntil().isAfter(LocalDateTime.now())) {
//                auditService.log(u.getId(), "LOGIN_TEMP_LOCKED", false, ip, null, null);
//                return ResponseEntity.status(403).body("User is temporarily locked until " + u.getLockedUntil());
//            }
//
//            tokenService.createRefreshToken(u.getId(), refreshPlain, r.deviceInfo, LocalDateTime.now().plusSeconds(refreshMs/1000));
//            auditService.log(u.getId(), "LOGIN", true, ip, null, null);
//            AuthResponse resp = new AuthResponse();
//            resp.accessToken = access;
//            resp.refreshToken = refreshPlain;
//            resp.expiresIn = 900; // seconds
//            return ResponseEntity.ok(resp);
//        } catch (Exception e) {
//            auditService.log(null, "FAILED_LOGIN", false, ip, null, null);
//            return ResponseEntity.status(401).body("Invalid credentials");
//        }
//    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest r, @RequestHeader(value = "X-Forwarded-For", required = false) String ip) {
        try {
            // Buscar usuario por email
            Optional<User> uOpt = userService.findByEmail(r.email);
            if (uOpt.isEmpty()) {
                auditService.log(null, "FAILED_LOGIN", false, ip, null, null);
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            User u = uOpt.get();

            // Revisar si está deshabilitado permanentemente
            if (!u.isEnabled()) {
                auditService.log(u.getId(), "LOGIN_DISABLED", false, ip, null, null);
                return ResponseEntity.status(403).body("User is disabled");
            }

            // Revisar bloqueo temporal
            if (u.getLockedUntil() != null && u.getLockedUntil().isAfter(LocalDateTime.now())) {
                auditService.log(u.getId(), "LOGIN_TEMP_LOCKED", false, ip, null, null);
                return ResponseEntity.status(403).body("User is temporarily locked until " + u.getLockedUntil());
            }

            // Autenticar contraseña
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(r.email, r.password)
            );

            String access = jwtUtil.generateToken(r.email);
            String refreshPlain = UUID.randomUUID().toString();
            tokenService.createRefreshToken(u.getId(), refreshPlain, r.deviceInfo, LocalDateTime.now().plusSeconds(refreshMs / 1000));
            auditService.log(u.getId(), "LOGIN", true, ip, null, null);
            AuthResponse resp = new AuthResponse();
            resp.accessToken = access;
            resp.refreshToken = refreshPlain;
            resp.expiresIn = 900; // seconds

            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            // 8️⃣ Capturar error de autenticación (contraseña incorrecta)
            auditService.log(null, "FAILED_LOGIN", false, ip, null, null);
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }



    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest r) {
        for (RefreshToken st : tokenService.repo.findAll()) {
            if (tokenService.verifyToken(st, r.refreshToken)) {
                String newAccess = jwtUtil.generateToken(userService.userRepository.findById(st.getUserId()).get().getEmail());
                AuthResponse resp = new AuthResponse();
                resp.accessToken = newAccess;
                resp.refreshToken = r.refreshToken; // keep same until rotate
                resp.expiresIn = 900;
                auditService.log(st.getUserId(), "REFRESH", true, null, null, null);
                return ResponseEntity.ok(resp);
            }
        }
        return ResponseEntity.status(401).body("Invalid refresh token");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody PasswordResetRequest r) {
        Optional<User> uOpt = userService.findByEmail(r.email);
        if (uOpt.isEmpty()) return ResponseEntity.ok().build();
        User u = uOpt.get();
        String code = String.valueOf((int)((Math.random()*900000)+100000));
        PasswordResetToken t = resetService.createToken(u.getId(), code);
        emailService.sendOtp(u.getEmail(), code);
        auditService.log(u.getId(), "PASSWORD_RESET_REQUEST", true, null, null, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody PasswordResetConfirm c) {
        Optional<PasswordResetToken> tOpt = resetService.findByCode(c.code);
        if (tOpt.isEmpty()) return ResponseEntity.status(400).body("Invalid or expired code");
        PasswordResetToken t = tOpt.get();
        var uOpt = userService.userRepository.findById(t.getUserId());
        if (uOpt.isEmpty()) return ResponseEntity.status(400).body("User not found");
        userService.changePassword(uOpt.get(), c.newPassword);
        t.setUsed(true);
        resetService.repo.save(t);
        auditService.log(uOpt.get().getId(), "PASSWORD_RESET", true, null, null, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshRequest r) {
        for (RefreshToken st : tokenService.repo.findAll()) {
            if (tokenService.verifyToken(st, r.refreshToken)) {
                tokenService.revoke(st);
                auditService.log(st.getUserId(), "LOGOUT", true, null, null, null);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.ok().build();
    }


    @PostMapping("/block-user")
    public ResponseEntity<?> blockUser(@RequestParam UUID userId,
                                       @RequestParam(required = false) Boolean enable,
                                       @RequestParam(required = false) Long minutes) {
        var userOpt = userService.userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

        User user = userOpt.get();

        // Si se pasa 'enable', habilitamos/deshabilitamos permanentemente
        if (enable != null) {
            user.setEnabled(enable);
            auditService.log(user.getId(), enable ? "USER_ENABLED" : "USER_DISABLED", true, null, null, null);
        }

        // Si se pasa 'minutes', bloqueamos temporalmente
        if (minutes != null && minutes > 0) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(minutes));
            auditService.log(user.getId(), "USER_TEMP_LOCKED", true, null, null, "Locked for " + minutes + " minutes");
        }

        userService.userRepository.save(user);
        return ResponseEntity.ok().body("User updated successfully");
    }

}
