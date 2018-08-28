package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

import java.math.BigDecimal;

public class RelatorioBaselineSinteticoColunas extends PropriedadesRelatorio {

    public RelatorioBaselineSinteticoColunas() {
        super("Listagem da Baseline por Sistemas", "Total de Sistemas");
        super.getColunas().add(new ColunasPropriedadeRelatorio("nome", "Nome do Sistema", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("sigla", "Sigla", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("numeroocorrencia", "Número da Ocorrência", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("sum", "Pontos de Função", BigDecimal.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
    }
}
