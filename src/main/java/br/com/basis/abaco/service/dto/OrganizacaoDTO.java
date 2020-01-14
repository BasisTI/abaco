package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;
import java.util.Set;

@Getter
@Setter
public class OrganizacaoDTO {

    @Id
    private Long id;

    private String nome;

    private String cnpj;

    private Boolean ativo;

    private String numeroOcorrencia;

    private Set<SistemaDTO> sistemas;

    private Set<ContratoDTO> contracts;

    private Set<TipoEquipeDTO> tipoEquipes;

    private String sigla;

    private Long logoId;
}
