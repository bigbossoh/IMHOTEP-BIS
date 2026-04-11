package com.bzdata.gestimospringbackend.common.security.config;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.PUBLIC_URLS;

import com.bzdata.gestimospringbackend.common.security.filter.JwtAccessDeniedHandler;
import com.bzdata.gestimospringbackend.common.security.filter.JwtAuthenticationEntryPoint;
import com.bzdata.gestimospringbackend.common.security.filter.JwtAuthorizationFilter;
import com.bzdata.gestimospringbackend.common.security.service.ApplicationUserDetailsService;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    private final ApplicationUserDetailsService applicationUserDetailsService;
    private final JwtAuthorizationFilter jwtAuthorizationFilter;
    private final PasswordEncoder passwordEncoder;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        RequestMatcher[] publicRequestMatchers = Arrays
                .stream(PUBLIC_URLS)
                .map(AntPathRequestMatcher::new)
                .toArray(RequestMatcher[]::new);

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exceptionHandling
                        -> exceptionHandling
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth
                        -> auth
                        .requestMatchers(CorsUtils::isPreFlightRequest)
                        .permitAll()
                        .requestMatchers(publicRequestMatchers)
                        .permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(
                        jwtAuthorizationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value(
                    "${app.cors.allowed-origin-patterns:http://localhost:4200,http://127.0.0.1:4200,http://51.75.142.41,http://gestimoweb.com,http://gestimoweb.com:80,http://:8080,http://gestimoweb.com:8080,http://gestimoweb.com:8287,https://localhost:4200,https://127.0.0.1:4200,https://51.75.142.41,https://gestimoweb.com,https://gestimoweb.com:80,https://:8080,https://gestimoweb.com:8080,https://gestimoweb.com:8287,https://www.gestimoweb.com,https://www.gestimoweb.com:80,https://www.gestimoweb.com:8080,https://www.gestimoweb.com:8287,http://www.gestimoweb.com,https://www.gestimoweb.com,https://www.gestimoweb.com:80,https://www.gestimoweb.com:8080,https://www.gestimoweb.com:8287 }"
            ) String allowedOriginPatterns
    ) {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(false);
        corsConfiguration.setAllowedOriginPatterns(splitCsv(allowedOriginPatterns));
        corsConfiguration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        corsConfiguration.setAllowedHeaders(
                List.of(
                        "Origin",
                        "Content-Type",
                        "Accept",
                        "X-Requested-With",
                        "Jwt-Token",
                        "Authorization",
                        "Content-Disposition"
                )
        );
        corsConfiguration.setExposedHeaders(
                List.of("Jwt-Token", "Authorization", "Content-Disposition")
        );
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(applicationUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfiguration
    ) throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    private List<String> splitCsv(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }

        return Arrays
                .stream(value.split(","))
                .map(String::trim)
                .filter(token -> !token.isEmpty())
                .toList();
    }
}
