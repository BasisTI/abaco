package br.com.basis.abaco.reports.rest;

import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import br.com.basis.abaco.service.dto.ComplexidadeDTO;
import br.com.basis.abaco.service.dto.FuncoesDTO;
import br.com.basis.abaco.service.dto.ImpactoDTO;

/**
 * @author eduardo.andrade
 * @since 15/05/2018
 */
public class RelatorioFuncaoDados {
       
    private FuncoesDTO funcoesDTO;
    
    private Integer valorRlr;
    
    private Integer valorDer;
            
    private void init() {
        funcoesDTO = new FuncoesDTO();
        funcoesDTO.setComplexidadeDtoFd(new ComplexidadeDTO());
        funcoesDTO.setImpactoDtoFd(new ImpactoDTO());
    }
    
    /**
     * 
     * @param analise
     * @return
     */
    public List<FuncoesDTO> prepararListaFuncaoDados(Analise analise) {
        List<FuncoesDTO> list = new ArrayList<>();
        
        for(FuncaoDados f : analise.getFuncaoDados()) {
            this.popularObjetoFuncoesDTO(f);
            list.add(funcoesDTO);
        }
        
        this.valorRlr = 0;
        this.valorDer = 0;
        
        return list;
    }
    
    /**
     * 
     * @param f
     */
    private void popularObjetoFuncoesDTO(FuncaoDados f) {
        this.init();
        this.popularObjeto(f);
        this.popularImpacto(f);
        this.popularModulo(f);
        this.popularNome(f);
        this.popularPFs(f);
        this.popularRlr(f);
        this.popularDer(f);
    }
    
    /**
     * 
     * @param f
     */
    private void popularRlr(FuncaoDados f) {
        this.valorRlr =+ f.getRlrs().size();
        funcoesDTO.setRlrFd(valorRlr.toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularDer(FuncaoDados f) {
        this.valorDer =+ f.getDers().size();
        funcoesDTO.setDerFd(valorDer.toString());
    }

    /**
     * 
     * @param f
     */
    private void popularPFsTipo(FuncaoDados f) {
        
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getGrossPF() != null && f.getPf() != null) {
            funcoesDTO.getComplexidadeDtoFd().setPfTotalAli(incrementarPfs(funcoesDTO.getComplexidadeDtoFd().getPfTotalAli(), f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFd().setPfAjustadoAli(incrementarPfs(funcoesDTO.getComplexidadeDtoFd().getPfAjustadoAli(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getGrossPF() != null && f.getPf() != null) {
            funcoesDTO.getComplexidadeDtoFd().setPfTotalAie(incrementarPfs(funcoesDTO.getComplexidadeDtoFd().getPfTotalAie(), f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFd().setPfAjustadoAie(incrementarPfs(funcoesDTO.getComplexidadeDtoFd().getPfAjustadoAie(), f.getPf().doubleValue()));
        }
        
        if(f.getTipo() == TipoFuncaoDados.INM && f.getGrossPF() != null && f.getPf() != null) {
            funcoesDTO.getComplexidadeDtoFd().setPfTotalInmFd(incrementarPfs(funcoesDTO.getComplexidadeDtoFd().getPfTotalInmFd(), f.getGrossPF().doubleValue()));
            funcoesDTO.getComplexidadeDtoFd().setPfAjustadoInmFd(incrementarPfs(funcoesDTO.getComplexidadeDtoFd().getPfAjustadoInmFd(), f.getPf().doubleValue()));
        }
    }
    
    /**
     * Método responsável por popular os valores de ponto de função do fieldset do relatório.
     * @param f
     */
    private void popularPFs(FuncaoDados f) {
        if(f.getGrossPF() != null) {
            funcoesDTO.setPfTotalFd(f.getGrossPF().toString());
        } else {
            funcoesDTO.setPfTotalFd("---");
        }
        if(f.getPf() != null) {
            funcoesDTO.setPfAjustadoFd(f.getPf().toString());
        } else {
            funcoesDTO.setPfAjustadoFd("---");
        }
    }
    
    /**
     * 
     * @param f
     */
    private void popularObjeto(FuncaoDados f) {
        funcoesDTO.setFatorAjusteFd(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        funcoesDTO.setFuncionalidadeFd(f.getFuncionalidade() == null ? "---" : f.getFuncionalidade().getNome());
        funcoesDTO.setTipoFd(f.getTipo() == null ? "---" : f.getTipo().toString());
        funcoesDTO.setComplexidadeFd(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
        funcoesDTO.setNomeFd(f.getName() == null ? "---" : f.getName());
        funcoesDTO.setImpactoFd(f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularImpacto(FuncaoDados f) {
        funcoesDTO.setImpactoFd(f.getImpacto() == null 
                && !f.getImpacto().toString().isEmpty() 
                ? "---" : f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularModulo(FuncaoDados f) {
        funcoesDTO.setModuloFd(f.getFuncionalidade() == null 
                && f.getFuncionalidade().getModulo() == null 
                ? "---" : f.getFuncionalidade().getModulo().getNome());
    }
    
    /**
     * 
     * @param f
     */
    private void popularNome(FuncaoDados f) {
        funcoesDTO.setNomeFd(f.getName() == null 
                && !f.getName().isEmpty() ? "---" : f.getName());
    }
    
    /**
     * 
     * @param f
     */
    public FuncoesDTO recuperarCounts(Analise analise) {
        
        for(FuncaoDados f : analise.getFuncaoDados()) {
            this.countALiComplex(f);
            this.countAieComplex(f);
            this.countInmComplex(f);
            this.countAliImpacto(f);
            this.countAieImpacto(f);
            this.countInmImpacto(f);
            this.popularPFsTipo(f);
        }
        return funcoesDTO;
    }
    
    /**
     * 
     * @param f
     */
    private void countALiComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFd().setAliSem(incrementar(funcoesDTO.getComplexidadeDtoFd().getAliSem()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFd().setAliBaixa(incrementar(funcoesDTO.getComplexidadeDtoFd().getAliBaixa()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFd().setAliMedia(incrementar(funcoesDTO.getComplexidadeDtoFd().getAliMedia()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFd().setAliAlta(incrementar(funcoesDTO.getComplexidadeDtoFd().getAliAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFd().setAieSem(incrementar(funcoesDTO.getComplexidadeDtoFd().getAieSem()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFd().setAieBaixa(incrementar(funcoesDTO.getComplexidadeDtoFd().getAieBaixa()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFd().setAieMedia(incrementar(funcoesDTO.getComplexidadeDtoFd().getAieMedia()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFd().setAieAlta(incrementar(funcoesDTO.getComplexidadeDtoFd().getAieAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.SEM) {
            funcoesDTO.getComplexidadeDtoFd().setInmSemFd(incrementar(funcoesDTO.getComplexidadeDtoFd().getInmSemFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.BAIXA) {
            funcoesDTO.getComplexidadeDtoFd().setInmBaixaFd(incrementar(funcoesDTO.getComplexidadeDtoFd().getInmBaixaFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.MEDIA) {
            funcoesDTO.getComplexidadeDtoFd().setInmMediaFd(incrementar(funcoesDTO.getComplexidadeDtoFd().getInmMediaFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.ALTA) {
            funcoesDTO.getComplexidadeDtoFd().setInmAltaFd(incrementar(funcoesDTO.getComplexidadeDtoFd().getInmAltaFd()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAliImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFd().setAliInclusao(incrementar(funcoesDTO.getImpactoDtoFd().getAliInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFd().setAliAlteracao(incrementar(funcoesDTO.getImpactoDtoFd().getAliAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFd().setAliExclusao(incrementar(funcoesDTO.getImpactoDtoFd().getAliExclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFd().setAliConversao(incrementar(funcoesDTO.getImpactoDtoFd().getAliConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFd().setAieInclusao(incrementar(funcoesDTO.getImpactoDtoFd().getAieInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFd().setAieAlteracao(incrementar(funcoesDTO.getImpactoDtoFd().getAieAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFd().setAieExclusao(incrementar(funcoesDTO.getImpactoDtoFd().getAieExclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFd().setAieConversao(incrementar(funcoesDTO.getImpactoDtoFd().getAieConversao()));
        }
    }
 
    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            funcoesDTO.getImpactoDtoFd().setAieInclusao(incrementar(funcoesDTO.getImpactoDtoFd().getAieInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            funcoesDTO.getImpactoDtoFd().setInmAlteracaoFd(incrementar(funcoesDTO.getImpactoDtoFd().getInmAlteracaoFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            funcoesDTO.getImpactoDtoFd().setInmExclusaoFd(incrementar(funcoesDTO.getImpactoDtoFd().getInmExclusaoFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            funcoesDTO.getImpactoDtoFd().setInmConversaoFd(incrementar(funcoesDTO.getImpactoDtoFd().getInmConversaoFd()));
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
