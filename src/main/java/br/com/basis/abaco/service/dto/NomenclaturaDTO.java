package br.com.basis.abaco.service.dto;

import br.com.basis.dynamicexports.pojo.ReportObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class NomenclaturaDTO implements Serializable, ReportObject {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String nome;
    private String descricao;

}
