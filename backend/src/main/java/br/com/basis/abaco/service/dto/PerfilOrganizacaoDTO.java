package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.Permissao;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * A DTO for the {@link br.com.basis.abaco.domain.PerfilOrganizacao} entity.
 */
@Getter
@Setter
public class PerfilOrganizacaoDTO implements Serializable {

    private Long id;

    private List<OrganizacaoDTO> organizacoes = new ArrayList<>();

    private PerfilDTO perfil;
}
