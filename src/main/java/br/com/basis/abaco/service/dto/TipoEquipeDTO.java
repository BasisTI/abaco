package br.com.basis.abaco.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Id;
import java.util.HashSet;
import java.util.Set;

public class TipoEquipeDTO {

    @Id
    private Long id;

    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @JsonInclude(Include.NON_EMPTY)
    private Set<OrganizacaoDTO> organizacoes = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<OrganizacaoDTO> getOrganizacoes() {
        return organizacoes;
    }

    public void setOrganizacoes(Set<OrganizacaoDTO> organizacoes) {
        this.organizacoes = organizacoes;
    }
}
