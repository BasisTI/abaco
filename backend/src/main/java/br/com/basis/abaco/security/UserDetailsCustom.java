package br.com.basis.abaco.security;

import br.com.basis.abaco.domain.User;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Custom implementation of Spring User entity with logined User entity
 *
 *
 * Created by roman on 10/7/17.
 */
public class UserDetailsCustom extends org.springframework.security.core.userdetails.User {

    private User user;

    public UserDetailsCustom(String username, String password, Collection<? extends GrantedAuthority> authorities, User user){
        super(username,password,authorities);
        this.user=user;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
