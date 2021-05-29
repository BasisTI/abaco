package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

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
}
