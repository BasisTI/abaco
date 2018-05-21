package br.com.basis.abaco.reports.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import br.com.basis.abaco.service.dto.ComplexidadeDTO;
import br.com.basis.abaco.service.dto.FuncaoDadosDTO;
import br.com.basis.abaco.service.dto.ImpactoDTO;

/**
 * @author eduardo.andrade
 * @since 15/05/2018
 */
public class RelatorioFuncaoDados {
       
    private FuncaoDadosDTO dadosFd;
        
    private void init() {
        dadosFd = new FuncaoDadosDTO();
        dadosFd.setComplexidadeDto(new ComplexidadeDTO());
        dadosFd.setImpactoDto(new ImpactoDTO());
    }
    
    /**
     * 
     * @param analise
     * @return
     */
    public List<FuncaoDadosDTO> prepararListaFuncaoDados(Analise analise) {
        List<FuncaoDadosDTO> list = new ArrayList<>();
        
        for(FuncaoDados f : analise.getFuncaoDados()) {
            this.init();
            this.popularObjeto(f);
            this.popularImpacto(f);
            this.popularModulo(f);
            this.popularNome(f);
            list.add(dadosFd);
        }
        return list;
    }
    
    /**
     * 
     * @param f
     */
    private void popularObjeto(FuncaoDados f) {
        dadosFd.setFatorAjuste(f.getFatorAjuste() == null 
                ? "---" : f.getFatorAjuste().getNome());
        dadosFd.setFuncionalidade(f.getFuncionalidade() == null
                ? "---" : f.getFuncionalidade().getNome());
        dadosFd.setTipo(f.getTipo() == null 
                ? "---" : f.getTipo().toString());
        dadosFd.setComplexidade(f.getComplexidade() == null 
                ? "---" : f.getComplexidade().toString());
        dadosFd.setPfTotal(f.getGrossPF() == null 
                ? BigDecimal.valueOf(0L) : f.getGrossPF());
        dadosFd.setPfTotal(f.getPf() == null 
                ? BigDecimal.valueOf(0L) : f.getPf());
    }
    
    /**
     * 
     * @param f
     */
    private void popularImpacto(FuncaoDados f) {
        dadosFd.setImpacto(f.getImpacto() == null 
                && !f.getImpacto().toString().isEmpty() 
                ? "---" : f.getImpacto().toString());
    }
    
    /**
     * 
     * @param f
     */
    private void popularModulo(FuncaoDados f) {
        dadosFd.setModulo(f.getFuncionalidade() == null 
                && f.getFuncionalidade().getModulo() == null 
                ? "---" : f.getFuncionalidade().getModulo().getNome());
    }
    
    /**
     * 
     * @param f
     */
    private void popularNome(FuncaoDados f) {
        dadosFd.setNome(f.getName() == null 
                && !f.getName().isEmpty() ? "---" : f.getName());
    }
    
    /**
     * 
     * @param f
     */
    public FuncaoDadosDTO recuperarCounts(Analise analise) {
        
        for(FuncaoDados f : analise.getFuncaoDados()) {
            this.countALiComplex(f);
            this.countAieComplex(f);
            this.countInmComplex(f);
            this.countAliImpacto(f);
            this.countAieImpacto(f);
            this.countInmImpacto(f);
        }
        return dadosFd;
    }
    
    /**
     * 
     * @param f
     */
    private void countALiComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.SEM) {
            dadosFd.getComplexidadeDto().setAliSem(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFd.getComplexidadeDto().setAliBaixa(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFd.getComplexidadeDto().setAliMedia(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.ALTA) {
            dadosFd.getComplexidadeDto().setAliAlta(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.SEM) {
            dadosFd.getComplexidadeDto().setAieSem(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFd.getComplexidadeDto().setAieBaixa(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFd.getComplexidadeDto().setAieMedia(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFd.getComplexidadeDto().setAieAlta(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.SEM) {
            dadosFd.getComplexidadeDto().setInmSemFd(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFd.getComplexidadeDto().setInmBaixaFd(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFd.getComplexidadeDto().setInmMediaFd(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.ALTA) {
            dadosFd.getComplexidadeDto().setInmAltaFd(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAliImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFd.getImpactoDto().setAliInclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFd.getImpactoDto().setAliAlteracao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFd.getImpactoDto().setAliExclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFd.getImpactoDto().setAliConversao(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFd.getImpactoDto().setAieInclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFd.getImpactoDto().setAieAlteracao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFd.getImpactoDto().setAieExclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFd.getImpactoDto().setAieConversao(+1);
        }
    }
 
    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFd.getImpactoDto().setAieInclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFd.getImpactoDto().setInmAlteracaoFd(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFd.getImpactoDto().setInmExclusaoFd(+1);
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFd.getImpactoDto().setInmConversaoFd(+1);
        }
    }
    

        
}
