package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;
import java.io.Serializable;

@Getter
@Setter
public class OrganizacaoDTO implements Serializable {

    @Id
    private Long id;

    private String nome;

    private String cnpj;

    private Boolean ativo;

    private String numeroOcorrencia;

    private String sigla;

    private Long logoId;
}
