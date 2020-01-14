package br.com.basis.abaco.service.dto;

import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

public class OrganizacaoDTO {

    @Id
    private Long id;

    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String cnpj;

    @NotNull
    private Boolean ativo;

    private String numeroOcorrencia;

    private Set<SistemaDTO> sistemas = new HashSet<>();

    private Set<ContratoDTO> contracts = new HashSet<>();

    private Set<TipoEquipeDTO> tipoEquipes = new HashSet<>();

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String sigla;

    private Long logoId;
}
