package br.com.basis.abaco.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Roman Rogov on 07.07.2017.
 */

@Entity
@Table(name = "files")
@JsonIgnoreProperties(value = {"logo"})
public class UploadedFile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Lob
    @Column
    private byte[] logo;

    @Column
    private String originalName;

    @Column
    private String filename;

    @Column
    private Date dateOf = new Date();

    @Column
    private Integer sizeOf;


    @Column
    private Integer processType;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "process_id")
    private FuncaoDados funcaoDados;


    @ManyToMany(mappedBy = "arquivosManual")
    @JsonIgnore
    private List<Manual> manuais = new LinkedList<>();

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "tran_id")
    private FuncaoTransacao funcaoTransacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public Date getDateOf() {
        return (Date) dateOf.clone();
    }

    public void setDateOf(Date dateOf) {
        this.dateOf = (Date) dateOf.clone();
    }

    public Integer getSizeOf() {
        return sizeOf;
    }

    public void setSizeOf(Integer sizeOf) {
        this.sizeOf = sizeOf;
    }

    public List<Manual> getManuais() {
        return manuais;
    }

    public void setManuais(List<Manual> manuais) {
        this.manuais = manuais;
    }

    public Integer getProcessType() {
        return processType;
    }

    public void setProcessType(Integer processType) {
        this.processType = processType;
    }

    public FuncaoDados getFuncaoDados() {
        return funcaoDados;
    }

    public void setFuncaoDados(FuncaoDados funcaoDados) {
        this.funcaoDados = funcaoDados;
    }

    public FuncaoTransacao getFuncaoTransacao() {
        return funcaoTransacao;
    }

    public void setFuncaoTransacao(FuncaoTransacao funcaoTransacao) {
        this.funcaoTransacao = funcaoTransacao;
    }

    public byte[] getLogo() {
        return logo.clone();
    }

    public void setLogo(byte[] logo) {
        byte[] logo2 = logo.clone();
        this.logo = logo2;
    }

}
