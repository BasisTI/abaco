package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

@Getter
@Setter
public class RlrDTO implements Comparable {

    private Long id;

    private String nome;

    private Integer valor;

    private FuncaoDadosSaveDTO funcaoDados;

    private Integer numeracao;

    @Override
    public int compareTo(@NotNull Object o) {
        RlrDTO rlr = (RlrDTO) o;
        if(rlr.getNumeracao() != null && numeracao != null){
            return numeracao - rlr.getNumeracao();
        }
        else{
            return 1;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RlrDTO rlrDTO = (RlrDTO) o;
        return Objects.equals(id, rlrDTO.id) &&
            Objects.equals(nome, rlrDTO.nome) &&
            Objects.equals(valor, rlrDTO.valor) &&
            Objects.equals(funcaoDados, rlrDTO.funcaoDados) &&
            Objects.equals(numeracao, rlrDTO.numeracao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, valor, funcaoDados, numeracao);
    }
}
