package br.com.basis.abaco.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

public class BasisUserDetails {

    private final String firstName;

    private final String lastName;

    private final List<String> roles;

    public BasisUserDetails(String firstName, String lastName, Collection<? extends GrantedAuthority> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = collectRolesAsStrings(roles);
    }

    private List<String> collectRolesAsStrings(Collection<? extends GrantedAuthority> roles) {
        return roles.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Collection<String> getRoles() {
        Collection<String> cp = new LinkedHashSet<>();
        cp.addAll(roles);
        return cp;
    }

}
