package br.com.basis.abaco.service.dto;

import br.com.basis.abaco.domain.Grupo;
import br.com.basis.abaco.domain.User;

import java.sql.Timestamp;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public class GrupoDTO {

    private Long idAnalise;

    private String identificadorAnalise;

    private String organizacao;

    private String sistema;

    private String equipe;

    private String pfTotal;

    private String metodoContagem;

    private Integer diasDeGarantia;

    private String pfAjustado;

    private Boolean bloqueado;

    private String dataHomologacao;

    private Set<String> usuarios;

    private String dataCriacao;

    public GrupoDTO() {}

    public GrupoDTO(Grupo grupo) {
        this(grupo.getIdAnalise(), grupo.getIdentificadorAnalise(), grupo.getOrganizacao(), grupo.getSistema()
            , grupo.getEquipe(), grupo.getPfTotal(), grupo.getMetodoContagem(), grupo.getDiasDeGarantia(), grupo.getPfAjustado()
            , grupo.isBloqueado(), grupo.getDataHomologacao(), grupo.getUsuarios(), grupo.getDataCriacao());
    }

    public GrupoDTO(Long idAnalise, String identificadorAnalise, String organizacao, String sistema, String equipe
        , String pfTotal, String metodoContagem, Integer diasDeGarantia, String pfAjustado, Boolean bloqueado
        , Timestamp dataHomologacao, Set<User> usuarios, Timestamp dataCriacao) {
        this.idAnalise = idAnalise;
        this.identificadorAnalise = identificadorAnalise;
        this.organizacao = organizacao;
        this.sistema = sistema;
        this.equipe = equipe;
        this.pfTotal = pfTotal;
        this.metodoContagem = metodoContagem;
        this.diasDeGarantia = diasDeGarantia;
        this.pfAjustado = pfAjustado;
        this.bloqueado = bloqueado;
        this.dataHomologacao = dataHomologacao.toString();
        this.usuarios = usuarios.stream().map(user -> user.getFirstName().concat(" ").concat(user.getLastName())).collect(Collectors.toSet());
        this.dataCriacao = dataCriacao.toString();
    }



    public Long getIdAnalise() {
        return idAnalise;
    }

    public void setIdAnalise(Long idAnalise) {
        this.idAnalise = idAnalise;
    }

    public String getIdentificadorAnalise() {
        return identificadorAnalise;
    }

    public void setIdentificadorAnalise(String identificadorAnalise) {
        this.identificadorAnalise = identificadorAnalise;
    }

    public String getOrganizacao() {
        return organizacao;
    }

    public void setOrganizacao(String organizacao) {
        this.organizacao = organizacao;
    }

    public String getSistema() {
        return sistema;
    }

    public void setSistema(String sistema) {
        this.sistema = sistema;
    }

    public String getEquipe() {
        return equipe;
    }

    public void setEquipe(String equipe) {
        this.equipe = equipe;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getMetodoContagem() {
        return metodoContagem;
    }

    public void setMetodoContagem(String metodoContagem) {
        this.metodoContagem = metodoContagem;
    }

    public Integer getDiasDeGarantia() {
        return diasDeGarantia;
    }

    public void setDiasDeGarantia(Integer diasDeGarantia) {
        this.diasDeGarantia = diasDeGarantia;
    }

    public String getPfAjustado() {
        return pfAjustado;
    }

    public void setPfAjustado(String pfAjustado) {
        this.pfAjustado = pfAjustado;
    }

    public Boolean getBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
    }

    public String getDataHomologacao() {
        return dataHomologacao;
    }

    public void setDataHomologacao(String dataHomologacao) {
        this.dataHomologacao = dataHomologacao;
    }

    public Set<String> getUsuarios() {
        return  Optional.ofNullable(usuarios)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<>());
    }

    public void setUsuarios(Set<String> usuarios) {
        this.usuarios = Optional.ofNullable(usuarios)
            .map(LinkedHashSet::new)
            .orElse(new LinkedHashSet<>());
    }

    public String getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
