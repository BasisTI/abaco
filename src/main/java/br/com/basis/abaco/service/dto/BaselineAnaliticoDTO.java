package br.com.basis.abaco.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class BaselineAnaliticoDTO {

    private Long id;

    private Long idfuncaodados;

    private Long idsistema;

    private Long equipeResponsavelId;

    private String tipo;

    private String impacto;

    private String classificacao;

    private Long analiseid;

    private String dataHomologacao;

    private String nome;

    private String nomeEquipe;

    private String sigla;

    private String name;

    private BigDecimal pf;

    private String complexidade;

    private BigDecimal der;

    private BigDecimal rlralr;

    private Long idfuncionalidade;

}
