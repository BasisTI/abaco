package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

/**
 * @author eduardo.andrade
 * @since 29/06/2018
 */
@Getter
@Setter
public class AlrDTO implements Comparable{
    private Long id;
    private String nome;
    private Integer valor;
    private Integer numeracao;

    @Override
    public int compareTo(@NotNull Object o) {
        AlrDTO alr = (AlrDTO) o;
        if(alr.getNumeracao() != null && numeracao != null){
            return numeracao - alr.getNumeracao();
        }else{
            return 1;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AlrDTO alrDTO = (AlrDTO) o;
        return Objects.equals(id, alrDTO.id) &&
            Objects.equals(nome, alrDTO.nome) &&
            Objects.equals(valor, alrDTO.valor) &&
            Objects.equals(numeracao, alrDTO.numeracao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, valor, numeracao);
    }
}
