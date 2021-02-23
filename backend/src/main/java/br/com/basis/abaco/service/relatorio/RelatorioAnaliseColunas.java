package br.com.basis.abaco.service.relatorio;

import java.util.List;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioAnaliseColunas extends PropriedadesRelatorio {

    private static final String BLOQUEIA_STRING = "bloqueiaString";
    private static final String CREATED_ON = "createdOn";
    private static final String ADJUST_PF_TOTAL = "adjustPFTotal";
    private static final String PF_TOTAL = "pfTotal";
    private static final String METODO_CONTAGEM_STRING = "metodoContagemString";
    private static final String SISTEMA_NOME = "sistema.nome";
    private static final String EQUIPE_RESPONSAVEL_NOME = "equipeResponsavel.nome";
    private static final String IDENTIFICADOR_ANALISE = "identificadorAnalise";
    private static final String ORGANIZACAO_NOME = "organizacao.nome";

    public RelatorioAnaliseColunas(List<String> colunasVisiveis) {
        super("Listagem das Analises", "Total de Analises");
        if (colunasVisiveis == null || colunasVisiveis.contains(ORGANIZACAO_NOME)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(ORGANIZACAO_NOME, "Organização", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(IDENTIFICADOR_ANALISE)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(IDENTIFICADOR_ANALISE, "Identificador", String.class,10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(EQUIPE_RESPONSAVEL_NOME)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(EQUIPE_RESPONSAVEL_NOME, "Equipe", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(SISTEMA_NOME)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(SISTEMA_NOME, "Sistema", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(METODO_CONTAGEM_STRING)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(METODO_CONTAGEM_STRING, "Método de contagem",String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(PF_TOTAL)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(PF_TOTAL, "PF Total", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(ADJUST_PF_TOTAL)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(ADJUST_PF_TOTAL, "PF Ajustado", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(CREATED_ON)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(CREATED_ON, "Data Criação", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_DIREITA));
        }
        if (colunasVisiveis == null || colunasVisiveis.contains(BLOQUEIA_STRING)) {
            super.getColunas().add(new ColunasPropriedadeRelatorio(BLOQUEIA_STRING, "Bloqueada?", String.class, 10,DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
    }
}
