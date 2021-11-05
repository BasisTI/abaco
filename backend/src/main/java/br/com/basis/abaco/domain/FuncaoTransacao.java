package br.com.basis.abaco.domain;

import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.persistence.CascadeType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "funcao_transacao")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "funcao_transacao")
@JsonInclude(Include.NON_EMPTY)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FuncaoTransacao extends FuncaoAnalise implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final String FUNCAOTRANSACAO = "funcaoTransacao";

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoFuncaoTransacao tipo;

    @ManyToOne
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("nome ASC, id ASC")
    private Funcionalidade funcionalidade;

    @Column
    private String ftrStr;

    @Column
    private Integer quantidade;


    @OneToMany(mappedBy = FUNCAOTRANSACAO, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @OrderBy("id")
    private Set<Alr> alrs = new HashSet<>();

    @OneToMany(mappedBy = FUNCAOTRANSACAO, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UploadedFile> files = new ArrayList<>();

    @OneToMany(mappedBy = FUNCAOTRANSACAO,  orphanRemoval = true)
    private List<DivergenceCommentFuncaoTransacao> lstDivergenceComments = new ArrayList<>();

    @Transient
    private Set<String> ftrValues = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "impacto")
    private ImpactoFatorAjuste impacto;

    @OneToMany(mappedBy = FUNCAOTRANSACAO, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private Set<Der> ders = new HashSet<>();

    @JsonIgnore
    @ManyToOne
    private Analise analise;


    public void bindFuncaoTransacao(TipoFuncaoTransacao tipo, String ftrStr, Integer quantidade, Set<Alr> alrs, List<UploadedFile> files, Set<String> ftrValues, ImpactoFatorAjuste impacto, Set<Der> ders, Analise analise, Complexidade complexidade, BigDecimal pf, BigDecimal grossPF, Funcionalidade funcionalidade, String detStr, FatorAjuste fatorAjuste, String name, String sustantation, Set<String> derValues, TipoEquipe equipe, Long ordem) {
        this.tipo = tipo;
        this.ftrStr = ftrStr;
        this.quantidade = quantidade;
        this.alrs = alrs == null ? null : Collections.unmodifiableSet(alrs);
        this.files = files == null ? null : Collections.unmodifiableList(files);
        this.ftrValues = ftrValues == null ? null : Collections.unmodifiableSet(ftrValues);
        this.impacto = impacto;
        this.ders = ders == null ? null : Collections.unmodifiableSet(ders);
        this.analise = analise;
        this.setOrdem(ordem);
        bindFuncaoAnalise(null, complexidade, pf, grossPF, analise, funcionalidade, detStr, fatorAjuste, name, sustantation, derValues, null, equipe);
    }
    
    public void addFiles(UploadedFile file){
        this.files.add(file);
        file.setFuncaoTransacao(this);
    }

    public void setFiles(List<UploadedFile> files) {
        this.files.clear();
        if (files != null) {
            this.files.addAll(files);
            files.forEach(item -> {
                item.setFuncaoTransacao(this);
            });
        }
    }

}
