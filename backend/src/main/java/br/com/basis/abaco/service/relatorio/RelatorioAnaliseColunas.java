package br.com.basis.abaco.service.relatorio;

import java.util.List;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioAnaliseColunas extends PropriedadesRelatorio {

    public RelatorioAnaliseColunas() {
        super("Listagem das Analises", "Total de Analises");
        super.getColunas().add(new ColunasPropriedadeRelatorio("organizacao.nome", "Organização", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("identificadorAnalise", "Identificador", String.class,
                10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("equipeResponsavel.nome", "Equipe", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("sistema.nome", "Sistema", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("metodoContagemString", "Método de contagem",
                String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("pfTotal", "PF Total", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("adjustPFTotal", "PF Ajustado", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("createdOn", "Data Criação", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        super.getColunas().add(new ColunasPropriedadeRelatorio("bloqueiaString", "Bloqueada?", String.class, 10,
                DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
    }

    public RelatorioAnaliseColunas(List<String> colunasVisiveis) {
        super("Listagem das Analises", "Total de Analises");
        if (colunasVisiveis.contains("organizacao.nome")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("organizacao.nome", "Organização", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis.contains("identificadorAnalise")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("identificadorAnalise", "Identificador", String.class,10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis.contains("equipeResponsavel.nome")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("equipeResponsavel.nome", "Equipe", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis.contains("sistema.nome")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("sistema.nome", "Sistema", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis.contains("metodoContagemString")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("metodoContagemString", "Método de contagem",String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis.contains("pfTotal")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("pfTotal", "PF Total", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if (colunasVisiveis.contains("adjustPFTotal")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("adjustPFTotal", "PF Ajustado", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if (colunasVisiveis.contains("createdOn")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("createdOn", "Data Criação", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if (colunasVisiveis.contains("bloqueiaString")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("bloqueiaString", "Bloqueada?", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
    }
}
