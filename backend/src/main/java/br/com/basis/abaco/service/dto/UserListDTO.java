package br.com.basis.abaco.service.dto;

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

    private Set<TipoEquipeDTO> tipoEquipes = new HashSet<>();

    private Set<OrganizacaoDTO> organizacoes = new HashSet<>();

}
