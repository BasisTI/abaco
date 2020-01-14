package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.TipoSistema;

import javax.persistence.Id;
import java.util.Set;

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
