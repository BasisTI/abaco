package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A FatorAjuste.
 */
@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
@Table(name = "fator_ajuste")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "fator_ajuste")
public class FatorAjuste implements Serializable, Comparable<FatorAjuste> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;

    @NotNull
    @Column(name = "fator", precision = 10, scale = 4, nullable = false)
    @JsonDeserialize(using = BigDecimalSerializer.class)
    private BigDecimal fator;

    @NotNull
    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_ajuste")
    private TipoFatorAjuste tipoAjuste;

    @Enumerated(EnumType.STRING)
    @Column(name = "impacto")
    private ImpactoFatorAjuste impacto;

    @ManyToOne
    @JsonBackReference
    private Manual manual;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "codigo")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String codigo;

    @Column(name = "origem")
    @Field (index = FieldIndex.not_analyzed, type = FieldType.String)
    private String origem;

    @Column(name="ordem")
    private Long ordem;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public FatorAjuste nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getFator() {
        return fator;
    }

    public FatorAjuste fator(BigDecimal fator) {
        this.fator = fator;
        return this;
    }

    public void setFator(BigDecimal fator) {
        this.fator = fator;
    }

    public Boolean isAtivo() {
        return ativo;
    }

    public FatorAjuste ativo(Boolean ativo) {
        this.ativo = ativo;
        return this;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public TipoFatorAjuste getTipoAjuste() {
        return tipoAjuste;
    }

    public FatorAjuste tipoAjuste(TipoFatorAjuste tipoAjuste) {
        this.tipoAjuste = tipoAjuste;
        return this;
    }

    public void setTipoAjuste(TipoFatorAjuste tipoAjuste) {
        this.tipoAjuste = tipoAjuste;
    }

    public ImpactoFatorAjuste getImpacto() {
        return impacto;
    }

    public FatorAjuste impacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
        return this;
    }

    public void setImpacto(ImpactoFatorAjuste impacto) {
        this.impacto = impacto;
    }

    public Manual getManual() {
        return manual;
    }

    public FatorAjuste manual(Manual manual) {
        this.manual = manual;
        return this;
    }

    public void setManual(Manual manual) {
        this.manual = manual;
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

    public Boolean getAtivo() {
        return ativo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FatorAjuste fatorAjuste = (FatorAjuste) o;
        if (fatorAjuste.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, fatorAjuste.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "FatorAjuste{" + "id=" + id + ", nome='" + nome + "'" + ", fator='" + fator + "'" + ", ativo='" + ativo
                + "'" + ", tipoAjuste='" + tipoAjuste + "'" + ", impacto='" + impacto + "'" + '}';
    }

    public Long getOrdem() {
        return ordem;
    }

    public void setOrdem(Long ordem) {
        this.ordem = ordem;
    }

    @Override
    public int compareTo(FatorAjuste o) {

        String[] thisVectString = this.getCodigo().split("\\.");
        String[] otherVectString = o.getCodigo().split("\\.");

        Integer[] thisVect = new Integer[thisVectString.length];
        Integer[] otherVect = new Integer[otherVectString.length];

        for(int i=0 ; i< thisVect.length ; i++){
            if(!Character.isLetter(thisVectString[i].charAt(0))) {
                thisVect[i] = Integer.parseInt(thisVectString[i]);
            }
            else {
                thisVect[i] = Integer.valueOf((int) thisVectString[i].charAt(0));
            }
        }
        for(int i=0 ; i< otherVect.length ; i++){
            if(!Character.isLetter(otherVectString[i].charAt(0))) {
                otherVect[i] = Integer.parseInt(otherVectString[i]);
            }
            else {
                otherVect[i] = Integer.valueOf((int) otherVectString[i].charAt(0));
            }
        }

        int countThis = 0;
        int countOther = 0;

        for(int i=0 ; i<thisVect.length ; i++){

            if(otherVect.length > i){
                if(thisVect[i].compareTo(otherVect[i]) > 0){
                    if(i == 0){
                        countThis = countThis+10000;
                    }
                    if(i == 1){
                        countThis = countThis+100;
                    }
                    if(i == 2){
                        countThis++;
                    }
                    if(i == 3){
                        countThis++;
                    }

                }
                if(thisVect[i].compareTo(otherVect[i]) < 0){
                    if(i == 0){
                        countOther = countOther+10000;
                    }
                    if(i == 1){
                        countOther = countOther+100;
                    }
                    if(i == 2){
                        countOther++;
                    }
                    if(i == 3){
                        countOther++;
                    }
                }
            }
        }

        if(countThis > countOther){
            return 1;
        }
        if(countThis < countOther){
            return -1;
        }

        return 0;
    }
}
