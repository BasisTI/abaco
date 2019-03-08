package br.com.basis.abaco.service.dto;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * @author alexandre.costa
 * @since 27/02/2019
 */
public class ModuloDTO {

    private Long id;

    private String nome;

    private Set<FuncionalidadesDTO> funcionalidades = new HashSet<>();

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

    public Set<FuncionalidadesDTO> getFuncionalidades() {
        return new LinkedHashSet<FuncionalidadesDTO>(funcionalidades);
    }

    public void setFuncionalidades(Set<FuncionalidadesDTO> funcionalidades) {
        this.funcionalidades = new LinkedHashSet<FuncionalidadesDTO>(funcionalidades);
    }
}
