package br.com.basis.abaco.reports.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import br.com.basis.abaco.service.dto.ComplexidadeDTO;
import br.com.basis.abaco.service.dto.FuncoesDTO;
import br.com.basis.abaco.service.dto.ImpactoDTO;

/**
 * @author eduardo.andrade
 * @since 04/06/2018
 */
public class RelatorioFuncoes {

    private FuncoesDTO funcoes;
    
    /**
     * 
     */
    private void init() {
        funcoes = new FuncoesDTO();
        funcoes.setComplexidadeDtoFt(new ComplexidadeDTO());
        funcoes.setImpactoDtoFt(new ImpactoDTO());
        funcoes.setComplexidadeDtoFd(new ComplexidadeDTO());
        funcoes.setImpactoDtoFd(new ImpactoDTO());
    }
    
    /**
     * 
     * @param analise
     * @return
     */
    public List<FuncoesDTO> prepararListaFuncoes(Analise analise) {
        List<FuncoesDTO> list = new ArrayList<>();
        for(FuncaoTransacao f : analise.getFuncaoTransacaos()) {
            this.popularFuncaoTransacao(f);
            list.add(funcoes);
        }
        for(FuncaoDados f : analise.getFuncaoDados()) {
            this.popularFuncaoDados(f);
            list.add(funcoes);
        }
        return list;
    }
    
    /**
     * Método responsável por popular o objeto FuncoesDTO com as informações da função de transação.
     * @param analise
     */
    private void popularFuncaoTransacao(FuncaoTransacao f) {
        this.init();
        this.popularObjetoFt(f);
        this.popularImpacto(f);
        this.popularModulo(f);
        this.popularNome(f);
        this.popularPFsFt(f);
    }
    
    /**
     * Método responsável por popular o objeto FuncoesDTO com as informações da função de dados.
     * @param f
     */
    private void popularFuncaoDados(FuncaoDados f) {
        this.init();
        this.popularObjetoFd(f);
        this.popularImpactoFd(f);
        this.popularModuloFd(f);
        this.popularNomeFd(f);
        this.popularPFsFd(f);
    }
   
    /**
     * 
     * @param f
     */
    private void popularPFsFt(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFt().setPfTotalEe(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalEe(), f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFt().setPfAjustadoEe(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfAjustadoEe(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFt().setPfTotalSe(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalSe(),f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFt().setPfAjustadoSe(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalSe(),f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFt().setPfTotalCe(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalCe(),f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFt().setPfAjustadoCe(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalCe(),f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFt().setPfTotalInmFt(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalInmFt(),f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFt().setPfAjustadoInmFt(incrementarPfs(funcoes.getComplexidadeDtoFt().getPfTotalInmFt(),f.getPf().doubleValue()));
        }
    }

    /**
     * 
     * @param f
     */
    private void popularObjetoFt(FuncaoTransacao f) {
        funcoes.setIdFt(f.getId());
        funcoes.setFatorAjusteFt(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        funcoes.setFuncionalidadeFt(f.getFuncionalidade() == null ? "---" : f.getFuncionalidade().getNome());
        funcoes.setTipoFt(f.getTipo() == null ? "---" : f.getTipo().toString());
        funcoes.setComplexidadeFt(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
        funcoes.setPfTotalFt(f.getGrossPF().toString());
        funcoes.setPfAjustadoFt(f.getPf().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularImpacto(FuncaoTransacao f) {
        funcoes.setImpactoFt(f.getImpacto() == null 
                && !f.getImpacto().toString().isEmpty()? "---" : f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularModulo(FuncaoTransacao f) {
        funcoes.setModuloFt(f.getFuncionalidade() == null 
                && f.getFuncionalidade().getModulo() == null ? "---" : f.getFuncionalidade().getModulo().getNome());
    }
    
    /**
     * 
     * @param f
     */
    private void popularNome(FuncaoTransacao f) {
        funcoes.setNomeFt(f.getName() == null 
                && !f.getName().isEmpty() ? "---" : f.getName());
    }
    
    /**
     * 
     * @param f
     */
    public FuncoesDTO recuperarCountsFt(Analise analise) {
        for(FuncaoTransacao f : analise.getFuncaoTransacaos()) {
            this.countEeComplex(f);
            this.countSeComplex(f);
            this.countCeComplex(f);
            this.countInmComplex(f);
            this.countEeImpacto(f);
            this.countSeImpacto(f);
            this.countCeImpacto(f);
            this.countInmImpacto(f);
        }
        return funcoes;
    }
    
    /**Double
     * 
     * @param f
     */
    private void countEeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFt().setEeSem(incrementar(funcoes.getComplexidadeDtoFt().getEeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFt().setEeBaixa(incrementar(funcoes.getComplexidadeDtoFt().getEeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFt().setEeMedia(incrementar(funcoes.getComplexidadeDtoFt().getEeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFt().setEeAlta(incrementar(funcoes.getComplexidadeDtoFt().getEeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFt().setSeSem(incrementar(funcoes.getComplexidadeDtoFt().getSeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFt().setSeBaixa(incrementar(funcoes.getComplexidadeDtoFt().getSeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFt().setSeMedia(incrementar(funcoes.getComplexidadeDtoFt().getSeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFt().setSeAlta(incrementar(funcoes.getComplexidadeDtoFt().getSeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFt().setCeSem(incrementar(funcoes.getComplexidadeDtoFt().getCeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFt().setCeBaixa(incrementar(funcoes.getComplexidadeDtoFt().getCeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFt().setCeMedia(incrementar(funcoes.getComplexidadeDtoFt().getCeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFt().setCeAlta(incrementar(funcoes.getComplexidadeDtoFt().getCeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFt().setCeSem(incrementar(funcoes.getComplexidadeDtoFt().getCeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFt().setCeBaixa(incrementar(funcoes.getComplexidadeDtoFt().getCeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFt().setCeMedia(incrementar(funcoes.getComplexidadeDtoFt().getCeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFt().setCeAlta(incrementar(funcoes.getComplexidadeDtoFt().getCeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countEeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFt().setEeInclusao(incrementar(funcoes.getImpactoDtoFt().getEeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFt().setEeAlteracao(incrementar(funcoes.getImpactoDtoFt().getEeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFt().setEeExclusao(incrementar(funcoes.getImpactoDtoFt().getEeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFt().setEeConversao(incrementar(funcoes.getImpactoDtoFt().getEeConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFt().setSeInclusao(incrementar(funcoes.getImpactoDtoFt().getSeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFt().setSeAlteracao(incrementar(funcoes.getImpactoDtoFt().getSeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFt().setSeExclusao(incrementar(funcoes.getImpactoDtoFt().getSeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFt().setSeConversao(incrementar(funcoes.getImpactoDtoFt().getSeConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFt().setCeInclusao(incrementar(funcoes.getImpactoDtoFt().getCeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFt().setCeAlteracao(incrementar(funcoes.getImpactoDtoFt().getCeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFt().setCeExclusao(incrementar(funcoes.getImpactoDtoFt().getCeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFt().setCeConversao(incrementar(funcoes.getImpactoDtoFt().getCeConversao()));
        }
    }

    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFt().setInmInclusaoFt(incrementar(funcoes.getImpactoDtoFt().getInmInclusaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFt().setInmAlteracaoFt(incrementar(funcoes.getImpactoDtoFt().getInmAlteracaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFt().setInmExclusaoFt(incrementar(funcoes.getImpactoDtoFt().getInmExclusaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFt().setInmConversaoFt(incrementar(funcoes.getImpactoDtoFt().getInmConversaoFt()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void popularPFsFd(FuncaoDados f) {

        if(f.getTipo() == TipoFuncaoDados.ALI && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFd().setPfTotalAli(incrementarPfs(funcoes.getComplexidadeDtoFd().getPfTotalAli(), f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFd().setPfAjustadoAli(incrementarPfs(funcoes.getComplexidadeDtoFd().getPfAjustadoAli(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFd().setPfTotalAie(incrementarPfs(funcoes.getComplexidadeDtoFd().getPfTotalAie(), f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFd().setPfAjustadoAie(incrementarPfs(funcoes.getComplexidadeDtoFd().getPfAjustadoAie(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && validarPFs(f.getGrossPF(), f.getPf())) {
            funcoes.getComplexidadeDtoFd().setPfTotalInmFd(incrementarPfs(funcoes.getComplexidadeDtoFd().getPfTotalInmFd(), f.getGrossPF().doubleValue()));
            funcoes.getComplexidadeDtoFd().setPfAjustadoInmFd(incrementarPfs(funcoes.getComplexidadeDtoFd().getPfAjustadoInmFd(), f.getPf().doubleValue()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void popularObjetoFd(FuncaoDados f) {
        funcoes.setIdFd(f.getId());
        funcoes.setFatorAjusteFd(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        funcoes.setFuncionalidadeFd(f.getFuncionalidade() == null ? "---" : f.getFuncionalidade().getNome());
        funcoes.setTipoFd(f.getTipo() == null ? "---" : f.getTipo().toString());
        funcoes.setComplexidadeFd(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
        funcoes.setNomeFd(f.getName() == null ? "---" : f.getName());
        funcoes.setImpactoFd(f.getImpacto().toString());
        funcoes.setPfTotalFd(f.getGrossPF().toString());
        funcoes.setPfAjustadoFd(f.getPf().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularImpactoFd(FuncaoDados f) {
        funcoes.setImpactoFd(f.getImpacto() == null 
                && !f.getImpacto().toString().isEmpty() 
                ? "---" : f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularModuloFd(FuncaoDados f) {
        funcoes.setModuloFd(f.getFuncionalidade() == null 
                && f.getFuncionalidade().getModulo() == null 
                ? "---" : f.getFuncionalidade().getModulo().getNome());
    }
    
    /**
     * 
     * @param f
     */
    private void popularNomeFd(FuncaoDados f) {
        funcoes.setNomeFd(f.getName() == null 
                && !f.getName().isEmpty() ? "---" : f.getName());
    }
    
    /**
     * 
     * @param f
     */
    public FuncoesDTO recuperarCountsFd(Analise analise) {
        
        for(FuncaoDados f : analise.getFuncaoDados()) {
            this.countALiComplex(f);
            this.countAieComplex(f);
            this.countInmComplex(f);
            this.countAliImpacto(f);
            this.countAieImpacto(f);
            this.countInmImpacto(f);
        }
        return funcoes;
    }
    
    /**
     * 
     * @param f
     */
    private void countALiComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFd().setAliSem(incrementar(funcoes.getComplexidadeDtoFd().getAliSem()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFd().setAliBaixa(incrementar(funcoes.getComplexidadeDtoFd().getAliBaixa()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFd().setAliMedia(incrementar(funcoes.getComplexidadeDtoFd().getAliMedia()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFd().setAliAlta(incrementar(funcoes.getComplexidadeDtoFd().getAliAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFd().setAieSem(incrementar(funcoes.getComplexidadeDtoFd().getAieSem()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFd().setAieBaixa(incrementar(funcoes.getComplexidadeDtoFd().getAieBaixa()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFd().setAieMedia(incrementar(funcoes.getComplexidadeDtoFd().getAieMedia()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFd().setAieAlta(incrementar(funcoes.getComplexidadeDtoFd().getAieAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.SEM) {
            funcoes.getComplexidadeDtoFd().setInmSemFd(incrementar(funcoes.getComplexidadeDtoFd().getInmSemFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.BAIXA) {
            funcoes.getComplexidadeDtoFd().setInmBaixaFd(incrementar(funcoes.getComplexidadeDtoFd().getInmBaixaFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.MEDIA) {
            funcoes.getComplexidadeDtoFd().setInmMediaFd(incrementar(funcoes.getComplexidadeDtoFd().getInmMediaFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.ALTA) {
            funcoes.getComplexidadeDtoFd().setInmAltaFd(incrementar(funcoes.getComplexidadeDtoFd().getInmAltaFd()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAliImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFd().setAliInclusao(incrementar(funcoes.getImpactoDtoFd().getAliInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFd().setAliAlteracao(incrementar(funcoes.getImpactoDtoFd().getAliAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFd().setAliExclusao(incrementar(funcoes.getImpactoDtoFd().getAliExclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFd().setAliConversao(incrementar(funcoes.getImpactoDtoFd().getAliConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFd().setAieInclusao(incrementar(funcoes.getImpactoDtoFd().getAieInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFd().setAieAlteracao(incrementar(funcoes.getImpactoDtoFd().getAieAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFd().setAieExclusao(incrementar(funcoes.getImpactoDtoFd().getAieExclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFd().setAieConversao(incrementar(funcoes.getImpactoDtoFd().getAieConversao()));
        }
    }
 
    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoes.getImpactoDtoFd().setAieInclusao(incrementar(funcoes.getImpactoDtoFd().getAieInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoes.getImpactoDtoFd().setInmAlteracaoFd(incrementar(funcoes.getImpactoDtoFd().getInmAlteracaoFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoes.getImpactoDtoFd().setInmExclusaoFd(incrementar(funcoes.getImpactoDtoFd().getInmExclusaoFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoes.getImpactoDtoFd().setInmConversaoFd(incrementar(funcoes.getImpactoDtoFd().getInmConversaoFd()));
        }
    }
    
    /**
     * 
     * @param valor
     * @return
     */
    private Integer incrementar(Integer valor) {
        return valor == null ? 1 : valor +1;
    }
    
    /**
     * 
     * @param valor1
     * @param valor2
     * @return
     */
    private Double incrementarPfs(Double valor1, Double valor2) {
        Double valor3 = null;
        
        if(valor2 != null && valor1 == null) {
            valor1 = valor2;
            valor3 = valor1;
            valor3 += valor2;
        }
        return valor3;
    }
    
    /**
     * Método responsável por verificar se os valores não estão nulos.
     * @param valor1
     * @param valor2
     * @return
     */
    private boolean validarPFs(BigDecimal valor1, BigDecimal valor2) {
        return valor1 != null && valor2 != null ? true : false;
    }
}
