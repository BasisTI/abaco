package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.Permissao;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A DTO for the {@link Perfil} entity.
 */
public class PerfilDTO implements Serializable {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String descricao;

    private Boolean flgAtivo;

    private Set<Permissao> permissaos = new HashSet<>();

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean isFlgAtivo() {
        return flgAtivo;
    }

    public void setFlgAtivo(Boolean flgAtivo) {
        this.flgAtivo = flgAtivo;
    }

    public Set<Permissao> getPermissaos() {
        return permissaos;
    }

    public void setPermissaos(Set<Permissao> permissoes) {
        this.permissaos = permissoes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PerfilDTO)) {
            return false;
        }

        return id != null && id.equals(((PerfilDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PerfilDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", flgAtivo='" + isFlgAtivo() + "'" +
            ", permissaos='" + getPermissaos() + "'" +
            "}";
    }
}
