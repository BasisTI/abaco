package br.com.basis.abaco.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;

@Entity
public class FuncaoDadosVersionavel extends FuncaoAnaliseVersionavel {

    @OneToMany(mappedBy = "funcaoDadosVersionavel")
    private Set<FuncaoDados> funcoesDados = new HashSet<>();

    public Set<FuncaoDados> getFuncoesDados() {
        return funcoesDados;
    }

    public void setFuncoesDados(Set<FuncaoDados> funcoesDados) {
        this.funcoesDados = funcoesDados;
    }

}
