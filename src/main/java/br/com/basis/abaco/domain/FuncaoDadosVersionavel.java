package br.com.basis.abaco.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = { "sistema_id", "nome" }))
public class FuncaoDadosVersionavel extends FuncaoAnaliseVersionavel implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @OneToMany(mappedBy = "funcaoDadosVersionavel")
    private Set<FuncaoDados> funcoesDados = new HashSet<>();

    public Set<FuncaoDados> getFuncoesDados() {
        return funcoesDados;
    }

    public void setFuncoesDados(Set<FuncaoDados> funcoesDados) {
        this.funcoesDados = funcoesDados;
    }

}
