package br.com.basis.abaco.domain;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;

@Entity
@Table(name = "analise_compartilhada")
@Document(indexName = "compartilhada")
public class Compartilhada implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "equipe_id")
    private Long equipeId;

    @Column(name = "analise_id")
    private Long analiseId;

    @Column(name = "view_only")
    private boolean viewOnly;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "analise_id", insertable = false, updatable = false)
    private Analise analises;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEquipeId() {
        return equipeId;
    }

    public void setEquipeId(Long equipeId) {
        this.equipeId = equipeId;
    }

    public Long getAnaliseId() {
        return analiseId;
    }

    public void setAnaliseId(Long analiseId) {
        this.analiseId = analiseId;
    }

    public boolean isViewOnly() {
        return viewOnly;
    }

    public void setViewOnly(boolean viewOnly) {
        this.viewOnly = viewOnly;
    }

    @Override
    public String toString() {
        return "Compartilhada{" +
            "id=" + id +
            ", equipeId=" + equipeId +
            ", analiseId=" + analiseId +
            ", viewOnly=" + viewOnly +
            '}';
    }
}
