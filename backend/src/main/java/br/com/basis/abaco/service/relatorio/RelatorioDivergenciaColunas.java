package br.com.basis.abaco.service.relatorio;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioDivergenciaColunas extends PropriedadesRelatorio {
    public RelatorioDivergenciaColunas() {
        super("Listagem das Divergencias ", "Total de Divergencia");
        super.getColunas().add(new ColunasPropriedadeRelatorio("organizacao.nome", "Organização", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("identificadorAnalise", "Identificador da Validação", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("sistema.nome", "Sistema", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("metodoContagemString", "Método de contagem", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("pfTotal", "PF Total", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA ));
        super.getColunas().add(new ColunasPropriedadeRelatorio("adjustPFTotal", "PF Ajustado", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("createdOn", "Data Criação", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));

    }
}
