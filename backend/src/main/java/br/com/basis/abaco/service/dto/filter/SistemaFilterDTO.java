package br.com.basis.abaco.service.dto.filter;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SistemaFilterDTO implements Serializable{
    private static final long serialVersionUID = 1L;
    private String nome;
    private String sigla;
    private String numeroOcorrencia;
    private List<Long> organizacao;
}
