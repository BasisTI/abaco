package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Authority;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.TipoEquipe;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;
import java.util.HashSet;
import java.util.Set;
@Getter
@Setter
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

}
