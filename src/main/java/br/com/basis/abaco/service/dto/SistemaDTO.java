package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.TipoSistema;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

public class SistemaDTO {
    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    private String sigla;

    @NotNull
    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoSistema tipoSistema;

    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String numeroOcorrencia;

    @JoinColumn(name = "organizacao_id")
    private OrganizacaoDTO organizacao;

    private Set<ModuloDTO> modulos = new HashSet<>();

    private Set<AnaliseDTO> analises;
}
