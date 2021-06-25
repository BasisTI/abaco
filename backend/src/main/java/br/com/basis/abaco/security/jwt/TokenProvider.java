package br.com.basis.abaco.security.jwt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import br.com.basis.abaco.domain.Permissao;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.PermissaoRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.security.UserDetailsCustom;
import io.github.jhipster.config.JHipsterProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class TokenProvider {

    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);

    private static final String AUTHORITIES_KEY = "auth";

    private String secretKey;

    private long tokenValidityInMilliseconds;

    private long tokenValidityInMillisecondsForRememberMe;

    private final JHipsterProperties jHipsterProperties;

    private final UserRepository userRepository;

    private final PermissaoRepository permissaoRepository;

    public TokenProvider(JHipsterProperties jHipsterProperties, UserRepository userRepository,
            PermissaoRepository permissaoRepository) {
        this.jHipsterProperties = jHipsterProperties;
        this.userRepository = userRepository;
        this.permissaoRepository = permissaoRepository;
    }

    @PostConstruct
    public void init() {
        this.secretKey =
            jHipsterProperties.getSecurity().getAuthentication().getJwt().getSecret();

        this.tokenValidityInMilliseconds =
            1000 * jHipsterProperties.getSecurity().getAuthentication().getJwt().getTokenValidityInSeconds();
        this.tokenValidityInMillisecondsForRememberMe =
            1000 * jHipsterProperties.getSecurity().getAuthentication().getJwt().getTokenValidityInSecondsForRememberMe();
    }

    public String createToken(Authentication authentication, Boolean rememberMe) {
        User user = userRepository.findByLogin(authentication.getName());

        String authorities2 = user.getPerfils().stream()
                            .map(item -> item.getNome())
                            .collect(Collectors.joining(","));


        long now = (new Date()).getTime();
        Date validity;
        if (rememberMe) {
            validity = new Date(now + this.tokenValidityInMillisecondsForRememberMe);
        } else {
            validity = new Date(now + this.tokenValidityInMilliseconds);
        }

        return Jwts.builder()
            .setSubject(authentication.getName())
            .claim(AUTHORITIES_KEY, authorities2)
            .signWith(SignatureAlgorithm.HS512, secretKey)
            .setExpiration(validity)
            .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(secretKey)
            .parseClaimsJws(token)
            .getBody();

        Optional<br.com.basis.abaco.domain.User> userFromDatabase = userRepository.findOneWithAuthoritiesByLogin(claims.getSubject().toLowerCase());
        Collection<? extends GrantedAuthority> authorities = new ArrayList<>();
        UserDetailsCustom principal = null;
        if(userFromDatabase.isPresent()) {
            Set<String> listPerfil;
            listPerfil = userFromDatabase.get().getPerfils().stream().map(perfil -> perfil.getNome()).collect(Collectors.toSet());
            if (!listPerfil.isEmpty()) {
                Optional<List<Permissao>> listPermissao = permissaoRepository.pesquisarPermissoesPorPerfil(listPerfil);
                if (listPermissao.isPresent()) {
                    authorities = listPermissao.get().stream()
                        .map(permissao -> new SimpleGrantedAuthority("ROLE_ABACO_" + permissao.getFuncionalidadeAbaco().getSigla() + "_" + permissao.getAcao().getSigla()))
                        .collect(Collectors.toList());
                }
            }
             principal = new UserDetailsCustom(claims.getSubject(), "", authorities, userFromDatabase.get());
        }

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(authToken);
            return true;

        } catch (SignatureException e) {
            log.info("Invalid JWT signature."); log.trace("Invalid JWT signature trace: {}", e);

        } catch (MalformedJwtException e) {
            log.info("Invalid JWT token."); log.trace("Invalid JWT token trace: {}", e);

        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token."); log.trace("Expired JWT token trace: {}", e);

        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token."); log.trace("Unsupported JWT token trace: {}", e);

        } catch (IllegalArgumentException e) {
            log.info("JWT token compact of handler are invalid."); log.trace("JWT token compact of handler are invalid trace: {}", e);
        }
        return false;
    }
}
