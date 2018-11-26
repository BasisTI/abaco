package br.com.basis.abaco.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the TipoEquipe entity.
 */
public class TipoEquipeDTO implements Serializable {

    private Long id;

    private String nome;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        TipoEquipeDTO tipoEquipeDTO = (TipoEquipeDTO) o;
        if (tipoEquipeDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), tipoEquipeDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TipoEquipeDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
