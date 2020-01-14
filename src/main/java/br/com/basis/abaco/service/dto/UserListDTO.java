package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Authority;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.TipoEquipe;

import javax.persistence.Id;
import java.util.HashSet;
import java.util.Set;

public class UserListDTO {

    @Id
    private Long id;

    private String firstName;

    private String lastName;

    private String login;

    private String email;

    private boolean activated = true;

    private Set<TipoEquipe> tipoEquipes = new HashSet<>();

    private Set<Organizacao> organizacoes = new HashSet<>();

    private Set<Authority> authorities = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public Set<TipoEquipe> getTipoEquipes() {
        return tipoEquipes;
    }

    public void setTipoEquipes(Set<TipoEquipe> tipoEquipes) {
        this.tipoEquipes = tipoEquipes;
    }

    public Set<Organizacao> getOrganizacoes() {
        return organizacoes;
    }

    public void setOrganizacoes(Set<Organizacao> organizacoes) {
        this.organizacoes = organizacoes;
    }

    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
