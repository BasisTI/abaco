package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Perfil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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

    private Set<TipoEquipeDTO> tipoEquipes = new HashSet<>();

    private Set<OrganizacaoDTO> organizacoes = new HashSet<>();

    private String nome;

    private Set<Perfil> perfils = new HashSet<>();

    private List<PerfilOrganizacaoDTO> perfilOrganizacoes = new ArrayList<>();

    public String getNome() {
        return this.firstName + ' ' + this.lastName ;
    }
}
