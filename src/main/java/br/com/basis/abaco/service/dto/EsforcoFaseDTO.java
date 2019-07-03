package br.com.basis.abaco.service.dto;

import java.math.BigDecimal;

public class EsforcoFaseDTO {

    private Long id;

    private BigDecimal esforco;

    private String nomeFase;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getEsforco() {
        return esforco;
    }

    public void setEsforco(BigDecimal esforco) {
        this.esforco = esforco;
    }

    public String getNomeFase() {
        return nomeFase;
    }

    public void setNomeFase(String nomeFase) {
        this.nomeFase = nomeFase;
    }
}
