package br.com.basis.abaco.service.relatorio;

import java.util.List;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioUserColunas extends PropriedadesRelatorio {

    private static final String IS_ACTIVATED = "isActivated";
    private static final String EQUIPES = "equipes";
    private static final String NOME_PERFIL = "nomePerfil";
    private static final String NOME_ORG = "nomeOrg";
    private static final String EMAIL = "email";
    private static final String LOGIN = "login";
    private static final String FIRST_NAME = "firstName";
    
    private static final String[][] colunas = {{FIRST_NAME, "Nome"},{LOGIN,"Login"}, {EMAIL,"Email"}, {NOME_ORG,"Organização"}
    , {NOME_PERFIL,"Perfil"}, {EQUIPES,"Equipe"},{ IS_ACTIVATED,"Ativo"}};

    public RelatorioUserColunas(List<String> colunasVisiveis) {
        super("Listagem de Usuários", "Total de Usuários");
        for (String[] string : colunas) {
            if(colunasVisiveis.contains(string[0])) {
                super.getColunas().add(new ColunasPropriedadeRelatorio(string[0], string[1], String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
            }
        }
    }
}
