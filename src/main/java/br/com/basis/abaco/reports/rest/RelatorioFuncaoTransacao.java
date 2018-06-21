package br.com.basis.abaco.reports.rest;

import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import br.com.basis.abaco.service.dto.ComplexidadeDTO;
import br.com.basis.abaco.service.dto.FuncoesDTO;
import br.com.basis.abaco.service.dto.ImpactoDTO;

/**
 * @author eduardo.andrade
 * @since 17/05/2018
 */
public class RelatorioFuncaoTransacao {

    private FuncoesDTO funcoesDTO;
    
    /**
     * 
     */
    private void init() {
        funcoesDTO = new FuncoesDTO();
        funcoesDTO.setComplexidadeDtoFt(new ComplexidadeDTO());
        funcoesDTO.setImpactoDtoFt(new ImpactoDTO());
    }
    
    /**
     * 
     * @param analise
     * @return
     */
    public List<FuncoesDTO> prepararListaFuncaoTransacao(Analise analise) {
        List<FuncoesDTO> list = new ArrayList<>();
        for(FuncaoTransacao f : analise.getFuncaoTransacaos()) {
            this.init();
            this.popularObjeto(f);
            this.popularImpacto(f);
            this.popularModulo(f);
            this.popularNome(f);
            this.popularPFs(f);
            list.add(funcoesDTO);
        }
        return list;
    }
    
    /**
     * Método responsável por popular os valores de ponto de função do parâmetro do relatório por tipo.
     * @param f
     */
    private void popularPFsTipo(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE) {
            funcoesDTO.getComplexidadeDtoFt().setPfTotalEe(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalEe(), f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFt().setPfAjustadoEe(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfAjustadoEe(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE) {
            funcoesDTO.getComplexidadeDtoFt().setPfTotalSe(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalSe(),f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFt().setPfAjustadoSe(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalSe(),f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE) {
            funcoesDTO.getComplexidadeDtoFt().setPfTotalCe(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalCe(),f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFt().setPfAjustadoCe(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalCe(),f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM) {
            funcoesDTO.getComplexidadeDtoFt().setPfTotalInmFt(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalInmFt(),f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFt().setPfAjustadoInmFt(incrementarPfs(funcoesDTO.getComplexidadeDtoFt().getPfTotalInmFt(),f.getPf().doubleValue()));
        }
    }
    
    /**
     * Método responsável por popular os valores de ponto de função do fieldset do relatório.
     * @param f
     */
    private void popularPFs(FuncaoTransacao f) {
        funcoesDTO.setPfTotalFt(f.getGrossPF().toString());
        funcoesDTO.setPfAjustadoFt(f.getPf().toString());
    }

    /**
     * 
     * @param f
     */
    private void popularObjeto(FuncaoTransacao f) {
        funcoesDTO.setFatorAjusteFt(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        funcoesDTO.setFuncionalidadeFt(f.getFuncionalidade() == null ? "---" : f.getFuncionalidade().getNome());
        funcoesDTO.setTipoFt(f.getTipo() == null ? "---" : f.getTipo().toString());
        funcoesDTO.setComplexidadeFt(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularImpacto(FuncaoTransacao f) {
        funcoesDTO.setImpactoFt(f.getImpacto() == null 
                && !f.getImpacto().toString().isEmpty()? "---" : f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularModulo(FuncaoTransacao f) {
        funcoesDTO.setModuloFt(f.getFuncionalidade() == null 
                && f.getFuncionalidade().getModulo() == null ? "---" : f.getFuncionalidade().getModulo().getNome());
    }
    
    /**
     * 
     * @param f
     */
    private void popularNome(FuncaoTransacao f) {
        funcoesDTO.setNomeFt(f.getName() == null 
                && !f.getName().isEmpty() ? "---" : f.getName());
    }
    
    /**
     * 
     * @param f
     */
    public FuncoesDTO recuperarCounts(Analise analise) {
        for(FuncaoTransacao f : analise.getFuncaoTransacaos()) {
            this.countEeComplex(f);
            this.countSeComplex(f);
            this.countCeComplex(f);
            this.countInmComplex(f);
            this.countEeImpacto(f);
            this.countSeImpacto(f);
            this.countCeImpacto(f);
            this.countInmImpacto(f);
            this.popularPFsTipo(f);
        }
        return funcoesDTO;
    }
    
    /**Double
     * 
     * @param f
     */
    private void countEeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFt().setEeSem(incrementar(funcoesDTO.getComplexidadeDtoFt().getEeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFt().setEeBaixa(incrementar(funcoesDTO.getComplexidadeDtoFt().getEeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFt().setEeMedia(incrementar(funcoesDTO.getComplexidadeDtoFt().getEeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFt().setEeAlta(incrementar(funcoesDTO.getComplexidadeDtoFt().getEeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFt().setSeSem(incrementar(funcoesDTO.getComplexidadeDtoFt().getSeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFt().setSeBaixa(incrementar(funcoesDTO.getComplexidadeDtoFt().getSeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFt().setSeMedia(incrementar(funcoesDTO.getComplexidadeDtoFt().getSeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFt().setSeAlta(incrementar(funcoesDTO.getComplexidadeDtoFt().getSeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFt().setCeSem(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFt().setCeBaixa(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFt().setCeMedia(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFt().setCeAlta(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFt().setCeSem(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeSem()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFt().setCeBaixa(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeBaixa()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFt().setCeMedia(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeMedia()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFt().setCeAlta(incrementar(funcoesDTO.getComplexidadeDtoFt().getCeAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countEeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setEeInclusao(incrementar(funcoesDTO.getImpactoDtoFt().getEeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFt().setEeAlteracao(incrementar(funcoesDTO.getImpactoDtoFt().getEeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setEeExclusao(incrementar(funcoesDTO.getImpactoDtoFt().getEeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFt().setEeConversao(incrementar(funcoesDTO.getImpactoDtoFt().getEeConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setSeInclusao(incrementar(funcoesDTO.getImpactoDtoFt().getSeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFt().setSeAlteracao(incrementar(funcoesDTO.getImpactoDtoFt().getSeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setSeExclusao(incrementar(funcoesDTO.getImpactoDtoFt().getSeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFt().setSeConversao(incrementar(funcoesDTO.getImpactoDtoFt().getSeConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setCeInclusao(incrementar(funcoesDTO.getImpactoDtoFt().getCeInclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFt().setCeAlteracao(incrementar(funcoesDTO.getImpactoDtoFt().getCeAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setCeExclusao(incrementar(funcoesDTO.getImpactoDtoFt().getCeExclusao()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFt().setCeConversao(incrementar(funcoesDTO.getImpactoDtoFt().getCeConversao()));
        }
    }

    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setInmInclusaoFt(incrementar(funcoesDTO.getImpactoDtoFt().getInmInclusaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFt().setInmAlteracaoFt(incrementar(funcoesDTO.getImpactoDtoFt().getInmAlteracaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFt().setInmExclusaoFt(incrementar(funcoesDTO.getImpactoDtoFt().getInmExclusaoFt()));
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFt().setInmConversaoFt(incrementar(funcoesDTO.getImpactoDtoFt().getInmConversaoFt()));
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
