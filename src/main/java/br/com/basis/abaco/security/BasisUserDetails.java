package br.com.basis.abaco.security;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;

public class BasisUserDetails {

	private final List<String> roles;

	public BasisUserDetails(Collection<? extends GrantedAuthority> roles) {
		this.roles = roles.stream() //
				.map(GrantedAuthority::getAuthority) //
				.collect(Collectors.toList());
	}

	public Collection<String> getRoles() {
		return roles;
	}

}
