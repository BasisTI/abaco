package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Permissao;

import java.io.Serializable;

/**
 * A DTO for the {@link Permissao} entity.
 */
public class PermissaoDTO implements Serializable {

    private Long id;


    private Long funcionalidadeId;

    private Long acaoId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFuncionalidadeId() {
        return funcionalidadeId;
    }

    public void setFuncionalidadeId(Long funcionalidadeAbacoId) {
        this.funcionalidadeId = funcionalidadeAbacoId;
    }

    public Long getAcaoId() {
        return acaoId;
    }

    public void setAcaoId(Long acaoId) {
        this.acaoId = acaoId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PermissaoDTO)) {
            return false;
        }

        return id != null && id.equals(((PermissaoDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PermissaoDTO{" +
            "id=" + getId() +
            ", permissaoId=" + getFuncionalidadeId() +
            ", acaoId=" + getAcaoId() +
            "}";
    }
}
