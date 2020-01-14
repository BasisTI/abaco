package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.TipoSistema;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;
import java.util.Set;

@Getter
@Setter
public class SistemaDTO {
    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    private String sigla;

    private String nome;

    private TipoSistema tipoSistema;

    private String numeroOcorrencia;

    private OrganizacaoDTO organizacao;

    private Set<ModuloDTO> modulos;

    private Set<AnaliseDTO> analises;
}
