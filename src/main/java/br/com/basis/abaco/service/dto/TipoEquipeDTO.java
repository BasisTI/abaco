package br.com.basis.abaco.service.dto;

import javax.persistence.Id;
import java.util.HashSet;
import java.util.Set;

import static java.util.Collections.unmodifiableSet;

public class TipoEquipeDTO {

    @Id
    private Long id;

    private String nome;

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
        return unmodifiableSet(organizacoes);
    }

    public void setOrganizacoes(Set<OrganizacaoDTO> organizacoes) {
        this.organizacoes = unmodifiableSet(organizacoes);
    }
}
