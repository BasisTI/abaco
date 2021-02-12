package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Authority;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class UserEditDTO {

    private Long id;

    private String login;

    private String firstName;

    private String lastName;

    private String email;

    private boolean activated = true;

    private Set<Authority> authorities = new HashSet<>();

    private Set<TipoEquipeDTO> tipoEquipes = new HashSet<>();

    private Set<OrganizacaoDTO> organizacoes = new HashSet<>();

    private String nome;

    public String getNome() {
        return this.firstName + ' ' + this.lastName ;
    }
}
