package com.filmlink.controller;

import com.filmlink.model.User;
import com.filmlink.payload.request.LoginRequest;
import com.filmlink.payload.request.SignupRequest;
import com.filmlink.payload.response.JwtResponse;
import com.filmlink.payload.response.MessageResponse;
import com.filmlink.repository.RoleRepository;
import com.filmlink.repository.UserRepository;
import com.filmlink.security.JwtTokenProvider;
import com.filmlink.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Contrôleur pour gérer l'authentification des utilisateurs
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Authentification", description = "API d'authentification des utilisateurs")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Operation(summary = "Connecte un utilisateur et retourne un token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Connexion réussie", 
                     content = { @Content(mediaType = "application/json", 
                     schema = @Schema(implementation = JwtResponse.class)) }),
        @ApiResponse(responseCode = "400", description = "Requête invalide", 
                     content = @Content),
        @ApiResponse(responseCode = "401", description = "Non autorisé", 
                     content = @Content) 
    })
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsernameOrEmail(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();        
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
            jwt, 
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            roles
        ));
    }

    @Operation(summary = "Enregistre un nouvel utilisateur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Utilisateur enregistré avec succès", 
                     content = { @Content(mediaType = "application/json", 
                     schema = @Schema(implementation = MessageResponse.class)) }),
        @ApiResponse(responseCode = "400", description = "Nom d'utilisateur ou email déjà utilisé", 
                     content = @Content),
        @ApiResponse(responseCode = "500", description = "Erreur serveur", 
                     content = @Content) 
    })
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword())
        );

        Set<String> strRoles = signUpRequest.getRoles();
        Set<String> roles = new HashSet<>();

        if (strRoles == null) {
            roles.add("ROLE_USER");
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        roles.add("ROLE_ADMIN");
                        break;
                    case "mod":
                        roles.add("ROLE_MODERATOR");
                        break;
                    default:
                        roles.add("ROLE_USER");
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
