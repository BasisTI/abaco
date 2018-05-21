package br.com.basis.abaco.reports.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Der;
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
            this.popularObjetoFt(f);
            list.add(dadosFt);
        }
        return list;
    }
    
    /**
     * 
     * @param f
     */
    private void popularObjetoFt(FuncaoTransacao f) {
        dadosFt.setFatorAjuste(f.getFatorAjuste() == null ? "---" : f.getFatorAjuste().getNome());
        dadosFt.setImpacto(f.getImpacto() == null && !f.getImpacto().toString().isEmpty()? "---" : f.getImpacto().toString());
        dadosFt.setModulo(f.getFuncionalidade() == null && f.getFuncionalidade().getModulo() == null ? "---" : f.getFuncionalidade().getModulo().getNome());
        dadosFt.setFuncionalidade(f.getFuncionalidade() == null? "---" : f.getFuncionalidade().getNome());
        dadosFt.setNome(f.getName() == null && !f.getName().isEmpty() ? "---" : f.getName());
        dadosFt.setTipo(f.getTipo() == null ? "---" : f.getTipo().toString());
        dadosFt.setComplexidade(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
        dadosFt.setPfTotal(f.getGrossPF() == null ? BigDecimal.valueOf(0L) : f.getGrossPF());
        dadosFt.setPfTotal(f.getPf() == null ? BigDecimal.valueOf(0L) : f.getPf());
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
    
    /**
     * 
     * @param f
     */
    private void countEeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setEeSem(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setEeBaixa(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setEeMedia(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setEeAlta(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setSeSem(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setSeBaixa(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setSeMedia(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setSeAlta(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setCeSem(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setCeBaixa(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setCeMedia(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setCeAlta(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countInmComplex(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.SEM) {
            dadosFt.getComplexidadeDto().setCeSem(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.BAIXA) {
            dadosFt.getComplexidadeDto().setCeBaixa(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.MEDIA) {
            dadosFt.getComplexidadeDto().setCeMedia(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getComplexidade() == Complexidade.ALTA) {
            dadosFt.getComplexidadeDto().setCeAlta(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countEeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setEeInclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setEeAlteracao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setEeExclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.EE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setEeConversao(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countSeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setSeInclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setSeAlteracao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setSeExclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.SE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setSeConversao(+1);
        }
    }
    
    /**
     * 
     * @param f
     */
    private void countCeImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setCeInclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setCeAlteracao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setCeExclusao(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.CE && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setCeConversao(+1);
        }
    }

    /**
     * 
     * @param f
     */
    private void countInmImpacto(FuncaoTransacao f) {
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.INCLUSAO) {
            dadosFt.getImpactoDto().setInmInclusaoFt(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.ALTERACAO) {
            dadosFt.getImpactoDto().setInmAlteracaoFt(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.EXCLUSAO) {
            dadosFt.getImpactoDto().setInmExclusaoFt(+1);
        }
        if(f.getTipo() == TipoFuncaoTransacao.INM && f.getImpacto() == ImpactoFatorAjuste.CONVERSAO) {
            dadosFt.getImpactoDto().setInmConversaoFt(+1);
        }
    }
    
    /**
     * Método responsável por popular um objeto do tipo 
     * String concatenando as informações recuperadas da lista
     * e somando a quantidade de registros encontrados em função de transação.
     * @param f
     */
    public FuncaoTransacaoDTO popularDerListFt(FuncaoTransacao f) {
        String der = "";
        Integer total = 0;
        List<Der> ders = new ArrayList<Der>();
        
        if(ders != null && ders.size() > 0) {
            for(Der d : ders) {
                if(d.getFuncaoTransacao().getId() == f.getId()) {
                    der += d.getNome() + ", ";
                    total ++;
                }
            }
        }
        dadosFt.setDer(der);
        dadosFt.setTotalDer(total);
        return dadosFt;
    }
}
