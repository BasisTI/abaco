package br.com.basis.abaco.security;

import br.com.basis.abaco.config.Constants;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.service.UserService;
import jdk.nashorn.internal.runtime.options.Option;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.Optional;

/**
 * Implementation of AuditorAware based on Spring Security.
 */
@Component
public class SpringSecurityUserAuditorAware implements AuditorAware<User> {

    @Override
    public User getCurrentAuditor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsCustom userDetails = (UserDetailsCustom)auth.getPrincipal();
        return userDetails.getUser();
    }
}
