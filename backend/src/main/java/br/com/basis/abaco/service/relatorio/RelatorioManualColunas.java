package br.com.basis.abaco.service.relatorio;

import java.math.BigDecimal;
import java.util.List;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioManualColunas extends PropriedadesRelatorio {
    private static String mascara = "##.##'%'";
    private static final ColunasPropriedadeRelatorio OBSERVACAO = new ColunasPropriedadeRelatorio("observacao", "Observação", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA);
    private static final ColunasPropriedadeRelatorio NOME = new ColunasPropriedadeRelatorio("nome", "Nome", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA);
    private static final ColunasPropriedadeRelatorio ID = new ColunasPropriedadeRelatorio("id", "Código", Long.class, 10, "####",DynamicExportsConstants.ALINHAR_DIREITA);
    private static final ColunasPropriedadeRelatorio CONVERSAO = new ColunasPropriedadeRelatorio("parametroConversao", "Conversão", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA);
    private static final ColunasPropriedadeRelatorio EXCLUSAO = new ColunasPropriedadeRelatorio("parametroExclusao", "Exclusão", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA);
    private static final ColunasPropriedadeRelatorio ALTERACAO = new ColunasPropriedadeRelatorio("parametroAlteracao", "Alteração", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA);
    private static final ColunasPropriedadeRelatorio INCLUSAO = new ColunasPropriedadeRelatorio("parametroInclusao", "Inclusão", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA);
    private static final ColunasPropriedadeRelatorio INDICATIVA = new ColunasPropriedadeRelatorio("valorVariacaoIndicativa", "Indicativa", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA);
    private static final ColunasPropriedadeRelatorio ESTIMADA = new ColunasPropriedadeRelatorio("valorVariacaoEstimada", "Estimada", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA);

    private static final ColunasPropriedadeRelatorio[] colunas = {ID,NOME,ESTIMADA,INDICATIVA,INCLUSAO,ALTERACAO,EXCLUSAO,CONVERSAO,OBSERVACAO};
    
    public RelatorioManualColunas(List<String> colunasVisiveis) {
        super("Listagem de Manuais", "Total de Manuais");
        for (ColunasPropriedadeRelatorio coluna: colunas) {
            if(colunasVisiveis.contains(coluna.getNomePropriedade())) {
                super.getColunas().add(coluna);
            }
        }
    }
}
