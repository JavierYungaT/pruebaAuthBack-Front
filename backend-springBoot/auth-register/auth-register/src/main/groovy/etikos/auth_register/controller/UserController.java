package etikos.auth_register.controller;


import etikos.auth_register.entity.User;
import etikos.auth_register.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public User me(@AuthenticationPrincipal UserDetails d) {
        return userService.findByEmail(d.getUsername()).orElse(null);
    }

    @PutMapping("/password")
    public void changePassword(@AuthenticationPrincipal UserDetails d, @RequestBody String newPassword) {
        var u = userService.findByEmail(d.getUsername()).orElseThrow();
        userService.changePassword(u, newPassword);
    }
}

