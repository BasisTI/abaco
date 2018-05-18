package br.com.basis.abaco.reports.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.service.dto.FuncaoTransacaoDTO;

/**
 * @author eduardo.andrade
 * @since 17/05/2018
 *
 */
public class RelatorioFuncaoTransacao {

    private FuncaoTransacaoDTO dadosFt;
    
    private void init() {
        dadosFt = new FuncaoTransacaoDTO();
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
        dadosFt.setImpacto(f.getImpacto() == null && !f.getImpacto().isEmpty()? "---" : f.getImpacto());
        dadosFt.setModulo(f.getFuncionalidade() == null && f.getFuncionalidade().getModulo() == null ? "---" : f.getFuncionalidade().getModulo().getNome());
        dadosFt.setFuncionalidade(f.getFuncionalidade() == null? "---" : f.getFuncionalidade().getNome());
        dadosFt.setNome(f.getName() == null && !f.getName().isEmpty() ? "---" : f.getName());
        dadosFt.setTipo(f.getTipo() == null ? "---" : f.getTipo().toString());
        dadosFt.setComplexidade(f.getComplexidade() == null ? "---" : f.getComplexidade().toString());
        dadosFt.setPfTotal(f.getGrossPF() == null ? BigDecimal.valueOf(0L) : f.getGrossPF());
        dadosFt.setPfTotal(f.getPf() == null ? BigDecimal.valueOf(0L) : f.getPf());
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
