package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Rlr;
import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

@Getter
@Setter
public class DerDTO implements Comparable {

    private Long id;

    private String nome;

    private Integer valor;

    private Rlr rlr;

    private FuncaoDadosSaveDTO funcaoDados;

    private Integer numeracao;

    @Override
    public int compareTo(@NotNull Object o) {
        DerDTO der = (DerDTO) o;
        if(der.getNumeracao() != null && numeracao != null){
            return numeracao - der.getNumeracao();
        }else{
            return 1;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DerDTO derDTO = (DerDTO) o;
        return Objects.equals(id, derDTO.id) &&
            Objects.equals(nome, derDTO.nome) &&
            Objects.equals(valor, derDTO.valor) &&
            Objects.equals(rlr, derDTO.rlr) &&
            Objects.equals(funcaoDados, derDTO.funcaoDados) &&
            Objects.equals(numeracao, derDTO.numeracao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, valor, rlr, funcaoDados, numeracao);
    }
}
