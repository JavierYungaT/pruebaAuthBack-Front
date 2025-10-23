package etikos.auth_register.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String code) {
        SimpleMailMessage m = new SimpleMailMessage();
        m.setTo(to);
        m.setSubject("Your password reset code");
        m.setText("Use this code to reset your password: " + code);
        mailSender.send(m);
    }
}
