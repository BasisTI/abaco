package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.UploadedFile;
import org.apache.commons.beanutils.BeanUtils;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.*;

public class ManualDTO {

    private Long id;

    private String nome;

    private String observacao;

    private BigDecimal valorVariacaoEstimada;

    private BigDecimal valorVariacaoIndicativa;

    private List<UploadedFile> arquivosManual = new LinkedList<>();

    private Set<EsforcoFase> esforcoFases = new LinkedHashSet<>();

    private Set<FatorAjuste> fatoresAjuste = new LinkedHashSet<>();

    private BigDecimal parametroInclusao;

    private BigDecimal parametroAlteracao;

    private BigDecimal parametroExclusao;

    private BigDecimal parametroConversao;

    private Long versaoCPM;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public ManualDTO nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getObservacao() {
        return observacao;
    }

    public ManualDTO observacao(String observacao) {
        this.observacao = observacao;
        return this;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public BigDecimal getValorVariacaoEstimada() {
        return valorVariacaoEstimada;
    }

    public ManualDTO valorVariacaoEstimada(BigDecimal valorVariacaoEstimada) {
        this.valorVariacaoEstimada = valorVariacaoEstimada;
        return this;
    }

    public void setValorVariacaoEstimada(BigDecimal valorVariacaoEstimada) {
        this.valorVariacaoEstimada = valorVariacaoEstimada;
    }

    public BigDecimal getValorVariacaoIndicativa() {
        return valorVariacaoIndicativa;
    }

    public ManualDTO valorVariacaoIndicativa(BigDecimal valorVariacaoIndicativa) {
        this.valorVariacaoIndicativa = valorVariacaoIndicativa;
        return this;
    }

    public void setValorVariacaoIndicativa(BigDecimal valorVariacaoIndicativa) {
        this.valorVariacaoIndicativa = valorVariacaoIndicativa;
    }

    public List<UploadedFile> getArquivosManual() {
        return Optional.ofNullable(this.arquivosManual)
            .map(lista -> new LinkedList<UploadedFile>(lista))
            .orElse(new LinkedList<UploadedFile>());
    }

    public void setArquivosManual(List<UploadedFile> arquivosManual) {
        this.arquivosManual = Optional.ofNullable(arquivosManual)
            .map(lista -> new LinkedList<UploadedFile>(lista))
            .orElse(new LinkedList<UploadedFile>());
    }

    public Set<EsforcoFase> getEsforcoFases() {
        return Optional.ofNullable(this.esforcoFases)
            .map(lista -> new LinkedHashSet<EsforcoFase>(lista))
            .orElse(new LinkedHashSet<EsforcoFase>());
    }

    public void setEsforcoFases(Set<EsforcoFase> esforcoFases) {
        this.esforcoFases = Optional.ofNullable(esforcoFases)
            .map(lista -> new LinkedHashSet<EsforcoFase>(lista))
            .orElse(new LinkedHashSet<EsforcoFase>());
    }

    public Set<FatorAjuste> getFatoresAjuste() {
        return Optional.ofNullable(this.fatoresAjuste)
            .map(lista -> new LinkedHashSet<FatorAjuste>(lista))
            .orElse(new LinkedHashSet<FatorAjuste>());
    }

    public void setFatoresAjuste(Set<FatorAjuste> fatoresAjuste) {
        this.fatoresAjuste = Optional.ofNullable(fatoresAjuste)
            .map(lista -> new LinkedHashSet<FatorAjuste>(lista))
            .orElse(new LinkedHashSet<FatorAjuste>());
    }

    public BigDecimal getParametroInclusao() {
        return parametroInclusao;
    }

    public void setParametroInclusao(BigDecimal parametroInclusao) {
        this.parametroInclusao = parametroInclusao;
    }

    public BigDecimal getParametroAlteracao() {
        return parametroAlteracao;
    }

    public void setParametroAlteracao(BigDecimal parametroAlteracao) {
        this.parametroAlteracao = parametroAlteracao;
    }

    public BigDecimal getParametroExclusao() {
        return parametroExclusao;
    }

    public void setParametroExclusao(BigDecimal parametroExclusao) {
        this.parametroExclusao = parametroExclusao;
    }

    public BigDecimal getParametroConversao() {
        return parametroConversao;
    }

    public void setParametroConversao(BigDecimal parametroConversao) {
        this.parametroConversao = parametroConversao;
    }

    public Long getVersaoCPM() {
        return versaoCPM;
    }

    public void setVersaoCPM(Long versaoCPM) {
        this.versaoCPM = versaoCPM;
    }

    public Manual toEntity() throws InvocationTargetException, IllegalAccessException {
        Manual manual = new Manual();
        BeanUtils.copyProperties(manual, this);
        return manual;
    }
}
