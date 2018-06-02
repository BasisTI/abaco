package br.com.basis.abaco.reports.rest;

import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import br.com.basis.abaco.service.dto.ComplexidadeDTO;
import br.com.basis.abaco.service.dto.FuncaoTransacaoDTO;
import br.com.basis.abaco.service.dto.ImpactoDTO;

/**
 * @author eduardo.andrade
 * @since 17/05/2018
 */
public class RelatorioFuncaoTransacao {

    private FuncaoTransacaoDTO dadosFt;
    
    /**
     * 
     */
    private void init() {
        dadosFt = new FuncaoTransacaoDTO();
        dadosFt.setComplexidadeDto(new ComplexidadeDTO());
        dadosFt.setImpactoDto(new ImpactoDTO());
    }
    
    /**
     * 
     * @param analise
     * @return
     */
    public List<FuncaoTransacaoDTO> prepararListaFuncaoTransacao(Analise analise) {
        List<FuncaoTransacaoDTO> list = new ArrayList<>();
        for(FuncaoTransacao f : analise.getFuncaoTransacaos()) {
            this.init();
            this.popularObjeto(f);
            this.popularImpacto(f);
            this.popularModulo(f);
            this.popularNome(f);
            this.popularPFs(f);
            list.add(dadosFt);
        }
        return list;
    }
    
    /**
     * 
     * @param f
     */
    private void popularPFs(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE) {
            dadosFt.getComplexidadeDto().setPfTotalEe(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalEe(), f.getGrossPF().doubleValue()));
            dadosFt.getComplexidadeDto().setPfAjustadoEe(incrementarPfs(dadosFt.getComplexidadeDto().getPfAjustadoEe(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE) {
            dadosFt.getComplexidadeDto().setPfTotalSe(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalSe(),f.getGrossPF().doubleValue()));
            dadosFt.getComplexidadeDto().setPfAjustadoSe(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalSe(),f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE) {
            dadosFt.getComplexidadeDto().setPfTotalCe(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalCe(),f.getGrossPF().doubleValue()));
            dadosFt.getComplexidadeDto().setPfAjustadoCe(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalCe(),f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM) {
            dadosFt.getComplexidadeDto().setPfTotalInmFt(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalInmFt(),f.getGrossPF().doubleValue()));
            dadosFt.getComplexidadeDto().setPfAjustadoInmFt(incrementarPfs(dadosFt.getComplexidadeDto().getPfTotalInmFt(),f.getPf().doubleValue()));
        }
    }

    /**
     * 
     * @param f
     */
    private void popularObjeto(FuncaoTransacao f) {
        dadosFt.setFatorAjuste(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        dadosFt.setFuncionalidade(f.getFuncionalidade() == null ? "---" : f.getFuncionalidade().getNome());
        dadosFt.setTipo(f.getTipo() == null ? "---" : f.getTipo().toString());
        dadosFt.setComplexidade(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularImpacto(FuncaoTransacao f) {
        dadosFt.setImpacto(f.getImpacto() == null 
                && !f.getImpacto().toString().isEmpty()? "---" : f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularModulo(FuncaoTransacao f) {
        dadosFt.setModulo(f.getFuncionalidade() == null 
                && f.getFuncionalidade().getModulo() == null ? "---" : f.getFuncionalidade().getModulo().getNome());
    }
    
    /**
     * 
     * @param f
     */
    private void popularNome(FuncaoTransacao f) {
        dadosFt.setNome(f.getName() == null 
                && !f.getName().isEmpty() ? "---" : f.getName());
    }
    
    /**
     * 
     * @param f
     */
    public FuncaoTransacaoDTO recuperarCounts(Analise analise) {
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
        return dadosFt;
    }
    
    /**Double
     * 
     * @param f
     */
    private void countEeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setEeSem(incrementar(dadosFt.getComplexidadeDto().getEeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setEeBaixa(incrementar(dadosFt.getComplexidadeDto().getEeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setEeMedia(incrementar(dadosFt.getComplexidadeDto().getEeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setEeAlta(incrementar(dadosFt.getComplexidadeDto().getEeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setSeSem(incrementar(dadosFt.getComplexidadeDto().getSeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setSeBaixa(incrementar(dadosFt.getComplexidadeDto().getSeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setSeMedia(incrementar(dadosFt.getComplexidadeDto().getSeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setSeAlta(incrementar(dadosFt.getComplexidadeDto().getSeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setCeSem(incrementar(dadosFt.getComplexidadeDto().getCeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setCeBaixa(incrementar(dadosFt.getComplexidadeDto().getCeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setCeMedia(incrementar(dadosFt.getComplexidadeDto().getCeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setCeAlta(incrementar(dadosFt.getComplexidadeDto().getCeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setCeSem(incrementar(dadosFt.getComplexidadeDto().getCeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setCeBaixa(incrementar(dadosFt.getComplexidadeDto().getCeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setCeMedia(incrementar(dadosFt.getComplexidadeDto().getCeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setCeAlta(incrementar(dadosFt.getComplexidadeDto().getCeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countEeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setEeInclusao(incrementar(dadosFt.getImpactoDto().getEeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setEeAlteracao(incrementar(dadosFt.getImpactoDto().getEeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setEeExclusao(incrementar(dadosFt.getImpactoDto().getEeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setEeConversao(incrementar(dadosFt.getImpactoDto().getEeConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setSeInclusao(incrementar(dadosFt.getImpactoDto().getSeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setSeAlteracao(incrementar(dadosFt.getImpactoDto().getSeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setSeExclusao(incrementar(dadosFt.getImpactoDto().getSeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setSeConversao(incrementar(dadosFt.getImpactoDto().getSeConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setCeInclusao(incrementar(dadosFt.getImpactoDto().getCeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setCeAlteracao(incrementar(dadosFt.getImpactoDto().getCeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setCeExclusao(incrementar(dadosFt.getImpactoDto().getCeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setCeConversao(incrementar(dadosFt.getImpactoDto().getCeConversao()));
        }
    }

    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setInmInclusaoFt(incrementar(dadosFt.getImpactoDto().getInmInclusaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setInmAlteracaoFt(incrementar(dadosFt.getImpactoDto().getInmAlteracaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setInmExclusaoFt(incrementar(dadosFt.getImpactoDto().getInmExclusaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setInmConversaoFt(incrementar(dadosFt.getImpactoDto().getInmConversaoFt()));
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
        
}
