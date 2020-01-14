package br.com.basis.abaco.domain.enumeration;

public enum IndexadoresUtil {
   ESFORCO_FASE("Esforço Fase"),
   MANUAL_CONTRATO("Manual Contrato"),
   ORGANIZACAO("Organização"),
   ALR("Alr"),
   SISTEMA("Sistema"),
   FUNCIONALIDADE("Funcionalidade"),
   CONTRATO("Contrato"),
   MANUAL("Manual"),
   TIPO_EQUIPE("Tipo Equipe"),
   FATOR_AJUSTE("Fator Ajuste"),
   DER("Der"),
   ANALISE("Analise"),
   RLR("Rlr"),
   FUNCAO_DADOS("Funcao Dados"),
   USER("User"),
   MODULO("Modulo"),
   FUNCAO_TRANSACAO("Função Transação");

   public final String label;

   IndexadoresUtil(String label) {
      this.label = label;
   }
}
