package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.FuncionalidadeAbaco;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * A DTO for the {@link FuncionalidadeAbaco} entity.
 */
public class FuncionalidadeAbacoDTO implements Serializable {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String sigla;


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

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FuncionalidadeAbacoDTO)) {
            return false;
        }

        return id != null && id.equals(((FuncionalidadeAbacoDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FuncionalidadeAbacoDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", sigla='" + getSigla() + "'" +
            "}";
    }
}
