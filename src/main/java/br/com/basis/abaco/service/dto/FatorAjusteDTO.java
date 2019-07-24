package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;

import java.math.BigDecimal;

/**
 * @author alexandre.costa
 * @since 27/02/2019
 */


public class FatorAjusteDTO {

    private Long id;

    private String nome;

    private BigDecimal fator;

    private Boolean ativo;

    private TipoFatorAjuste tipoAjuste;

    private ImpactoFatorAjuste impacto;

    private String descricao;

    private String codigo;

    private String origem;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getFator() {
        return fator;
    }

    public void setFator(BigDecimal fator) {
        this.fator = fator;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public TipoFatorAjuste getTipoAjuste() {
        return tipoAjuste;
    }

    public void setTipoAjuste(TipoFatorAjuste tipoAjuste) {
        this.tipoAjuste = tipoAjuste;
    }

    public ImpactoFatorAjuste getImpacto() {
        return impacto;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }
}
