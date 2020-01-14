package br.com.basis.abaco.config;

import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.enumeration.IndexadoresUtil;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.service.Indexador;
import br.com.basis.abaco.service.IndexadorSemMapper;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;

@AllArgsConstructor
@Configuration
public class IndexadorConfiguration {

    private ElasticsearchTemplate elasticsearchTemplate;

    private UserRepository userRepository;
    private UserSearchRepository userSearchRepository;
    private SistemaRepository sistemaRepository;
    private SistemaSearchRepository sistemaSearchRepository;



    @Bean
    public Indexador indexadorUser() {
        IndexadorSemMapper<User, Long> indexador = new IndexadorSemMapper<>(userRepository,
                userSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.USER.name());
        indexador.setDescricao(IndexadoresUtil.USER.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorSistema() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.SISTEMA.name());
        indexador.setDescricao(IndexadoresUtil.SISTEMA.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorAlr() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ALR.name());
        indexador.setDescricao(IndexadoresUtil.ALR.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorAnalise(){
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ANALISE.name());
        indexador.setDescricao(IndexadoresUtil.ANALISE.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorContrato(){
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.CONTRATO.name());
        indexador.setDescricao(IndexadoresUtil.CONTRATO.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorDer() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.DER.name());
        indexador.setDescricao(IndexadoresUtil.DER.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorEsforcoFase() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ESFORCO_FASE.name());
        indexador.setDescricao(IndexadoresUtil.ESFORCO_FASE.label);
        return indexador;
    }
    @Bean
    public Indexador indexadorFatorAjuste() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FATOR_AJUSTE.name());
        indexador.setDescricao(IndexadoresUtil.FATOR_AJUSTE.label);
        return indexador;
    }    @Bean
    public Indexador indexadorFuncaoDados() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FUNCAO_DADOS.name());
        indexador.setDescricao(IndexadoresUtil.FUNCAO_DADOS.label);
        return indexador;
    }    @Bean
    public Indexador indexadorFuncaoTransacao() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FUNCAO_TRANSACAO.name());
        indexador.setDescricao(IndexadoresUtil.FUNCAO_TRANSACAO.label);
        return indexador;
    }    @Bean
    public Indexador indexadorFuncionalidade() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FUNCIONALIDADE.name());
        indexador.setDescricao(IndexadoresUtil.FUNCIONALIDADE.label);
        return indexador;
    }    @Bean
    public Indexador indexadorManual() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.MANUAL.name());
        indexador.setDescricao(IndexadoresUtil.MANUAL.label);
        return indexador;
    }    @Bean
    public Indexador indexadorManualContrato() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.MANUAL_CONTRATO.name());
        indexador.setDescricao(IndexadoresUtil.MANUAL_CONTRATO.label);
        return indexador;
    }    @Bean
    public Indexador indexadorModulo() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.MODULO.name());
        indexador.setDescricao(IndexadoresUtil.MODULO.label);
        return indexador;
    }    @Bean
    public Indexador indexadorOrganizacao() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ORGANIZACAO.name());
        indexador.setDescricao(IndexadoresUtil.ORGANIZACAO.label);
        return indexador;
    }    @Bean
    public Indexador indexadorRlr() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.RLR.name());
        indexador.setDescricao(IndexadoresUtil.RLR.label);
        return indexador;
    }    @Bean
    public Indexador indexadorTipoEquipe() {
        IndexadorSemMapper<Sistema, Long> indexador = new IndexadorSemMapper<>(sistemaRepository,
                sistemaSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.TIPO_EQUIPE.name());
        indexador.setDescricao(IndexadoresUtil.TIPO_EQUIPE.label);
        return indexador;
    }
}
