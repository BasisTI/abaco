package br.com.basis.abaco.domain;

import org.hibernate.annotations.Immutable;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A BaseLineAnalitico.
 */
@Entity
@Table(name = "baseline_analitico")
@Document(indexName = "baselineanalitico")
@Immutable
public class BaseLineAnalitico implements Serializable {

    @Id
    @Column(name = "row_number")
    private Long id;

    @Column(name = "id_funcao_dados")
    private Long idfuncaodados;

    @Column(name = "id_sistema")
    private Long idsistema;

    @Column(name = "equipe_responsavel_id")
    private Long equipeResponsavelId;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "impacto")
    private String impacto;

    @Column(name = "classificacao")
    private String classificacao;

    @Column(name = "analise_id")
    private Long analiseid;

    @Column(name = "data_homologacao_software")
    private String dataHomologacao;

    @Column(name = "nome")
    private String nome;

    @Column(name = "nome_equipe")
    private String nomeEquipe;

    @Column(name = "sigla")
    private String sigla;

    @Column(name = "name")
    private String name;

    @Column(name = "pf")
    private BigDecimal pf;

    @Column(name = "complexidade")
    private String complexidade;

    @Column(name = "der")
    private BigDecimal der;

    @Column(name = "rlr_alr")
    private BigDecimal rlralr;

    @Column(name = "nome_funcionalidade")
    private String nomeFuncionalidade;

    @Column(name = "nome_modulo")
    private String nomeModulo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdfuncaodados() {
        return idfuncaodados;
    }

    public void setIdfuncaodados(Long idfuncaodados) {
        this.idfuncaodados = idfuncaodados;
    }

    public Long getIdsistema() {
        return idsistema;
    }

    public void setIdsistema(Long idsistema) {
        this.idsistema = idsistema;
    }

    public Long getEquipeResponsavelId() {
        return equipeResponsavelId;
    }

    public void setEquipeResponsavelId(Long equipeResponsavelId) {
        this.equipeResponsavelId = equipeResponsavelId;
    }

    public String getNomeFuncionalidade() {
        return nomeFuncionalidade;
    }

    public void setNomeFuncionalidade(String nomeFuncionalidade){
        this.nomeFuncionalidade = nomeFuncionalidade;
    }

    public String getNomeModulo(){
        return nomeModulo;
    }

    public void setNomeModulo(String nomeModulo){
        this.nomeModulo = nomeModulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getImpacto() {
        return impacto;
    }

    public void setImpacto(String impacto) {
        this.impacto = impacto;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public Long getAnaliseid() {
        return analiseid;
    }

    public void setAnaliseid(Long analiseid) {
        this.analiseid = analiseid;
    }

    public String getDataHomologacao() {
        return dataHomologacao;
    }

    public void setDataHomologacao(String dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeEquipe() {
        return nomeEquipe;
    }

    public void setNomeEquipe(String nomeEquipe) {
        this.nomeEquipe = nomeEquipe;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPf() {
        return pf;
    }

    public void setPf(BigDecimal pf) {
        this.pf = pf;
    }

    public String getComplexidade() {
        return complexidade;
    }

    public void setComplexidade(String complexidade) {
        this.complexidade = complexidade;
    }

    public BigDecimal getDer() {
        return der;
    }

    public void setDer(BigDecimal der) {
        this.der = der;
    }

    public BigDecimal getRlralr() {
        return rlralr;
    }

    public void setRlralr(BigDecimal rlralr) {
        this.rlralr = rlralr;
    }
}
