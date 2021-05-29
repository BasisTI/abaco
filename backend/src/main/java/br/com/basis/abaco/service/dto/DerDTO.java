package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Rlr;
import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

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
}
