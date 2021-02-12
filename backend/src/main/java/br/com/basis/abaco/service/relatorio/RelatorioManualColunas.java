package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;
import com.itextpdf.text.Element;

import java.math.BigDecimal;

public class RelatorioManualColunas extends PropriedadesRelatorio {
    private static String mascara = "##.##'%'";

    public RelatorioManualColunas() {
        super("Listagem de Manuais", "Total de Manuais");
        super.getColunas().add(new ColunasPropriedadeRelatorio("id", "Código", Long.class, 10, "####",DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("nome", "Nome", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("valorVariacaoEstimada", "Estimada", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("valorVariacaoIndicativa", "Indicativa", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("parametroInclusao", "Inclusão", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("parametroAlteracao", "Alteração", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("parametroExclusao", "Exclusão", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("parametroConversao", "Conversão", BigDecimal.class, 10, mascara, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("observacao", "Observação", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));

    }
}
