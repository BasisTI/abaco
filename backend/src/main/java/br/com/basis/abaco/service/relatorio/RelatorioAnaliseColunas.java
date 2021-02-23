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
    
    private static final String[][] colunas = {{ORGANIZACAO_NOME, "Organização"},{IDENTIFICADOR_ANALISE,"Identificador"}, {EQUIPE_RESPONSAVEL_NOME,"Equipe"}, {SISTEMA_NOME,"Sistema"}
    , {METODO_CONTAGEM_STRING,"Método de contagem"}, {PF_TOTAL,"PF Total"},{ ADJUST_PF_TOTAL,"PF Ajustado"},{ CREATED_ON,"Data Criação"},{ BLOQUEIA_STRING,"Bloqueada?"}};


    public RelatorioAnaliseColunas(List<String> colunasVisiveis) {
        super("Listagem das Analises", "Total de Analises");
        for (String[] string : colunas) {
            if(colunasVisiveis.contains(string[0])) {
                super.getColunas().add(new ColunasPropriedadeRelatorio(string[0], string[1], String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
            }
        }
    }
}
