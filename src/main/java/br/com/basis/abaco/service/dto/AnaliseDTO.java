package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.dynamicexports.pojo.ReportObject;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

public class AnaliseDTO implements Serializable, ReportObject {


    private Long id;
    @NotNull
    private OrganizacaoDTO organizacao;
    @NotNull
    private String identificadorAnalise;
    @NotNull
    private TipoEquipeDTO tipoEquipe;
    @NotNull
    private SistemaDTO sistema;
    @NotNull
    private MetodoContagem metodoContagem;
    @NotNull
    private String pfTotal;
    @NotNull
    private String adjustPFTotal;
    @NotNull
    private Timestamp dataCriacaoOrdemServico;
    @NotNull
    private Timestamp dataHomologacao;
    @NotNull
    private Set<UserDTO> users;

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

    public Timestamp getDataCriacaoOrdemServico() {
        return dataCriacaoOrdemServico;
    }

    public void setDataCriacaoOrdemServico(Timestamp dataCriacaoOrdemServico) {
        this.dataCriacaoOrdemServico = dataCriacaoOrdemServico;
    }

    public Timestamp getDataHomologacao() {
        return dataHomologacao;
    }

    public void setDataHomologacao(Timestamp dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public Set<UserDTO> getUsers() {
        return users;
    }

    public void setUsers(Set<UserDTO> users) {
        this.users = users;
    }
}
