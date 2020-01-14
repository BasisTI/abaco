package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.dynamicexports.pojo.ReportObject;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

import static java.util.Collections.unmodifiableSet;

public class AnaliseDTO implements Serializable, ReportObject {

    private static final long serialVersionUID = 1L;

    private Long id;
    private OrganizacaoDTO organizacao;
    private String identificadorAnalise;
    private TipoEquipeDTO tipoEquipe;
    private SistemaDTO sistema;
    private MetodoContagem metodoContagem;
    private String pfTotal;
    private String adjustPFTotal;
    private Timestamp dataCriacaoOrdemServico;
    private Timestamp dataHomologacao;
    private Set<UserDTO> users;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Timestamp getDataCriacaoOrdemServico() {
        return (Timestamp) dataCriacaoOrdemServico.clone();
    }

    public void setDataCriacaoOrdemServico(Timestamp dataCriacaoOrdemServico) {
        this.dataCriacaoOrdemServico = (Timestamp) dataCriacaoOrdemServico.clone();
    }

    public Timestamp getDataHomologacao() {
        return (Timestamp) dataHomologacao.clone();
    }

    public void setDataHomologacao(Timestamp dataHomologacao) {
        this.dataHomologacao = (Timestamp) dataHomologacao.clone();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrganizacaoDTO getOrganizacao() {
        return organizacao;
    }

    public void setOrganizacao(OrganizacaoDTO organizacao) {
        this.organizacao = organizacao;
    }

    public String getIdentificadorAnalise() {
        return identificadorAnalise;
    }

    public void setIdentificadorAnalise(String identificadorAnalise) {
        this.identificadorAnalise = identificadorAnalise;
    }

    public TipoEquipeDTO getTipoEquipe() {
        return tipoEquipe;
    }

    public void setTipoEquipe(TipoEquipeDTO tipoEquipe) {
        this.tipoEquipe = tipoEquipe;
    }

    public SistemaDTO getSistema() {
        return sistema;
    }

    public void setSistema(SistemaDTO sistema) {
        this.sistema = sistema;
    }

    public MetodoContagem getMetodoContagem() {
        return metodoContagem;
    }

    public void setMetodoContagem(MetodoContagem metodoContagem) {
        this.metodoContagem = metodoContagem;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getAdjustPFTotal() {
        return adjustPFTotal;
    }

    public void setAdjustPFTotal(String adjustPFTotal) {
        this.adjustPFTotal = adjustPFTotal;
    }

    public Set<UserDTO> getUsers() {
        return unmodifiableSet(users);
    }

    public void setUsers(Set<UserDTO> users) {
        this.users = unmodifiableSet(users);
    }
}
