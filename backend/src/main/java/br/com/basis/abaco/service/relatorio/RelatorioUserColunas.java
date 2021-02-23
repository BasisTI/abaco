package br.com.basis.abaco.service.relatorio;

import java.util.List;

import br.com.basis.dynamicexports.constants.DynamicExportsConstants;
import br.com.basis.dynamicexports.pojo.ColunasPropriedadeRelatorio;
import br.com.basis.dynamicexports.pojo.PropriedadesRelatorio;

public class RelatorioUserColunas extends PropriedadesRelatorio {

    public RelatorioUserColunas(List<String> colunasVisiveis) {
        super("Listagem de Usuários", "Total de Usuários");
        if(colunasVisiveis.contains("nome")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("firstName", "Nome", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("login")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("login", "Login", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("email")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("email", "Email", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("organizacao")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("nomeOrg", "Organização", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("perfil")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("nomePerfil", "Perfil", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("equipe")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("equipes", "Equipe", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }
        if(colunasVisiveis.contains("activated")) {
            super.getColunas().add(new ColunasPropriedadeRelatorio("isActivated", "Ativo?", String.class, 10, DynamicExportsConstants.MASCARA_NULL, DynamicExportsConstants.ALINHAR_ESQUERDA));
        }

    }
}
