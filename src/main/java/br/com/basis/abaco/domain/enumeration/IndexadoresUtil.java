package br.com.basis.abaco.domain.enumeration;

public enum IndexadoresUtil {
    ESFORCO_FASE("esforço_fase"),
    MANUAL_CONTRATO("manual_contrato"),
    ORGANIZACAO("organização"),
    ALR("alr"),
    SISTEMA("sistema"),
    FUNCIONALIDADE("funcionalidade"),
    CONTRATO("contrato"),
    MANUAL("manual"),
    TIPO_EQUIPE("tipo_equipe"),
    FATOR_AJUSTE("fator_ajuste"),
    DER("der"),
    ANALISE("analise"),
    RLR("rlr"),
    FUNCAO_DADOS("funcao_dados"),
    USER("user"),
    MODULO("modulo"),
    BASE_LINE_ANALITICO("baseline_analitico"),
    BASE_LINE_SINTETICO("baseline_sintetico"),
    FUNCAO_TRANSACAO("função_transação"),
    STATUS("status"),
    NOMENCLATURA("nomenclatura");

    public final String label;

    IndexadoresUtil(String label) {
        this.label = label;
    }
}
