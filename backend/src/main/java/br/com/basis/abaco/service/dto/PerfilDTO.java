package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.domain.Permissao;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A DTO for the {@link Perfil} entity.
 */
@Getter
@Setter
public class PerfilDTO implements Serializable {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String descricao;

    private Boolean flgAtivo;

    private Set<Permissao> permissaos = new HashSet<>();

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
            ", flgAtivo='" + getFlgAtivo() + "'" +
            ", permissaos='" + getPermissaos() + "'" +
            "}";
    }
}
