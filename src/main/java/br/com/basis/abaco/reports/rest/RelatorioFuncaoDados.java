package br.com.basis.abaco.reports.rest;

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
    private void popularPFs(FuncaoDados f) {

        if(f.getTipo() == TipoFuncaoDados.ALI) {
            dadosFd.getComplexidadeDto().setPfTotalAli(incrementarPfs(dadosFd.getComplexidadeDto().getPfTotalAli(), f.getGrossPF().doubleValue()));
            dadosFd.getComplexidadeDto().setPfAjustadoAli(incrementarPfs(dadosFd.getComplexidadeDto().getPfAjustadoAli(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE) {
            dadosFd.getComplexidadeDto().setPfTotalAie(incrementarPfs(dadosFd.getComplexidadeDto().getPfTotalAie(), f.getGrossPF().doubleValue()));
            dadosFd.getComplexidadeDto().setPfAjustadoAie(incrementarPfs(dadosFd.getComplexidadeDto().getPfAjustadoAie(), f.getPf().doubleValue()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM) {
            dadosFd.getComplexidadeDto().setPfTotalInmFd(incrementarPfs(dadosFd.getComplexidadeDto().getPfTotalInmFd(), f.getGrossPF().doubleValue()));
            dadosFd.getComplexidadeDto().setPfAjustadoInmFd(incrementarPfs(dadosFd.getComplexidadeDto().getPfAjustadoInmFd(), f.getPf().doubleValue()));
        }
    }

    /**
     * 
     * @param f
     */
    private void popularObjeto(FuncaoDados f) {
        dadosFd.setFatorAjuste(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        dadosFd.setFuncionalidade(f.getFuncionalidade() == null ? "---" : f.getFuncionalidade().getNome());
        dadosFd.setTipo(f.getTipo() == null ? "---" : f.getTipo().toString());
        dadosFd.setComplexidade(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
        dadosFd.setNome(f.getName() == null ? "---" : f.getName());
        dadosFd.setImpacto(f.getImpacto().toString());
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
            this.popularPFs(f);
        }
        return dadosFd;
    }
    
    /**
     * 
     * @param f
     */
    private void countALiComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.SEM) {
            dadosFd.getComplexidadeDto().setAliSem(incrementar(dadosFd.getComplexidadeDto().getAliSem()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFd.getComplexidadeDto().setAliBaixa(incrementar(dadosFd.getComplexidadeDto().getAliBaixa()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFd.getComplexidadeDto().setAliMedia(incrementar(dadosFd.getComplexidadeDto().getAliMedia()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getComplexidade() == Complexidade.ALTA) {
            dadosFd.getComplexidadeDto().setAliAlta(incrementar(dadosFd.getComplexidadeDto().getAliAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.SEM) {
            dadosFd.getComplexidadeDto().setAieSem(incrementar(dadosFd.getComplexidadeDto().getAieSem()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFd.getComplexidadeDto().setAieBaixa(incrementar(dadosFd.getComplexidadeDto().getAieBaixa()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFd.getComplexidadeDto().setAieMedia(incrementar(dadosFd.getComplexidadeDto().getAieMedia()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFd.getComplexidadeDto().setAieAlta(incrementar(dadosFd.getComplexidadeDto().getAieAlta()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.SEM) {
            dadosFd.getComplexidadeDto().setInmSemFd(incrementar(dadosFd.getComplexidadeDto().getInmSemFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFd.getComplexidadeDto().setInmBaixaFd(incrementar(dadosFd.getComplexidadeDto().getInmBaixaFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFd.getComplexidadeDto().setInmMediaFd(incrementar(dadosFd.getComplexidadeDto().getInmMediaFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getComplexidade() == Complexidade.ALTA) {
            dadosFd.getComplexidadeDto().setInmAltaFd(incrementar(dadosFd.getComplexidadeDto().getInmAltaFd()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAliImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFd.getImpactoDto().setAliInclusao(incrementar(dadosFd.getImpactoDto().getAliInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFd.getImpactoDto().setAliAlteracao(incrementar(dadosFd.getImpactoDto().getAliAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFd.getImpactoDto().setAliExclusao(incrementar(dadosFd.getImpactoDto().getAliExclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.ALI && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFd.getImpactoDto().setAliConversao(incrementar(dadosFd.getImpactoDto().getAliConversao()));
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countAieImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFd.getImpactoDto().setAieInclusao(incrementar(dadosFd.getImpactoDto().getAieInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFd.getImpactoDto().setAieAlteracao(incrementar(dadosFd.getImpactoDto().getAieAlteracao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFd.getImpactoDto().setAieExclusao(incrementar(dadosFd.getImpactoDto().getAieExclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.AIE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFd.getImpactoDto().setAieConversao(incrementar(dadosFd.getImpactoDto().getAieConversao()));
        }
    }
 
    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoDados f) {
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFd.getImpactoDto().setAieInclusao(incrementar(dadosFd.getImpactoDto().getAieInclusao()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFd.getImpactoDto().setInmAlteracaoFd(incrementar(dadosFd.getImpactoDto().getInmAlteracaoFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFd.getImpactoDto().setInmExclusaoFd(incrementar(dadosFd.getImpactoDto().getInmExclusaoFd()));
        }
        if(f.getTipo() == TipoFuncaoDados.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFd.getImpactoDto().setInmConversaoFd(incrementar(dadosFd.getImpactoDto().getInmConversaoFd()));
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
