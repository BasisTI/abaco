package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioFaseColunas extends PropriedadesRelatorio {

    public RelatorioFaseColunas() {
        super("Listagem Fase", "Total Fase");
        super.getColunas().add(new ColunasPropriedadeRelatorio("tipoFase", "Nome da Fase", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));

    }
}
