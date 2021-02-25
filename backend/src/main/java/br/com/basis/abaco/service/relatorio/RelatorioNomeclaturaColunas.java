package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioNomeclaturaColunas extends PropriedadesRelatorio {

    public RelatorioNomeclaturaColunas() {
        super("Listagem de Nomenclatura", "Total de Nomenclatura");
        super.getColunas().add(new ColunasPropriedadeRelatorio("nome", "Nome", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("descricao", "Descrição", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));

    }
}
