package br.com.basis.abaco.config;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.ManualContrato;
import br.com.basis.abaco.domain.Modulo;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.enumeration.IndexadoresUtil;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.ContratoRepository;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.EsforcoFaseRepository;
import br.com.basis.abaco.repository.FatorAjusteRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.repository.ManualContratoRepository;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.ModuloRepository;
import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.AlrSearchRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.ContratoSearchRepository;
import br.com.basis.abaco.repository.search.DerSearchRepository;
import br.com.basis.abaco.repository.search.EsforcoFaseSearchRepository;
import br.com.basis.abaco.repository.search.FatorAjusteSearchRepository;
import br.com.basis.abaco.repository.search.FuncaoDadosSearchRepository;
import br.com.basis.abaco.repository.search.FuncaoTransacaoSearchRepository;
import br.com.basis.abaco.repository.search.FuncionalidadeSearchRepository;
import br.com.basis.abaco.repository.search.ManualContratoSearchRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.repository.search.ModuloSearchRepository;
import br.com.basis.abaco.repository.search.OrganizacaoSearchRepository;
import br.com.basis.abaco.repository.search.RlrSearchRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.repository.search.TipoEquipeSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.service.Indexador;
import br.com.basis.abaco.service.IndexadorComMapper;
import br.com.basis.abaco.service.IndexadorSemMapper;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import br.com.basis.abaco.service.mapper.AnaliseMapper;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;

@AllArgsConstructor
@Configuration
public class IndexadorConfiguration {

    private ElasticsearchTemplate elasticsearchTemplate;

    private AnaliseRepository analiseRepository;
    private AlrRepository alrRepository;
    private UserRepository userRepository;
    private SistemaRepository sistemaRepository;
    private ContratoRepository contratoRepository;
    private DerRepository derRepository;
    private EsforcoFaseRepository esforcoFaseRepository;
    private FatorAjusteRepository fatorAjusteRepository;
    private FuncaoDadosRepository funcaoDadosRepository;
    private FuncaoTransacaoRepository funcaoTransacaoRepository;
    private FuncionalidadeRepository funcionalidadeRepository;
    private ManualRepository manualRepository;
    private ManualContratoRepository manualContratoRepository;
    private ModuloRepository moduloRepository;
    private OrganizacaoRepository organizacaoRepository;
    private RlrRepository rlrRepository;
    private TipoEquipeRepository tipoEquipeRepository;

    private AnaliseSearchRepository analiseSearchRepository;
    private AlrSearchRepository alrSearchRepository;
    private UserSearchRepository userSearchRepository;
    private SistemaSearchRepository sistemaSearchRepository;
    private ContratoSearchRepository contratoSearchRepository;
    private DerSearchRepository derSearchRepository;
    private EsforcoFaseSearchRepository esforcoFaseSearchRepository;
    private FatorAjusteSearchRepository fatorAjusteSearchRepository;
    private FuncaoDadosSearchRepository funcaoDadosSearchRepository;
    private FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository;
    private FuncionalidadeSearchRepository funcionalidadeSearchRepository;
    private ManualSearchRepository manualSearchRepository;
    private ManualContratoSearchRepository manualContratoSearchRepository;
    private ModuloSearchRepository moduloSearchRepository;
    private OrganizacaoSearchRepository organizacaoSearchRepository;
    private RlrSearchRepository rlrSearchRepository;
    private TipoEquipeSearchRepository tipoEquipeSearchRepository;

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
        IndexadorSemMapper<Alr, Long> indexador = new IndexadorSemMapper<>(alrRepository,
                alrSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ALR.name());
        indexador.setDescricao(IndexadoresUtil.ALR.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorAnalise() {
        AnaliseMapper analiseMapper = new AnaliseMapper();
        IndexadorComMapper<Analise, Analise, Long, AnaliseDTO> indexador = new IndexadorComMapper<>(analiseRepository
                , analiseSearchRepository
                , analiseMapper
                , elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ANALISE.name());
        indexador.setDescricao(IndexadoresUtil.ANALISE.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorContrato() {
        IndexadorSemMapper<Contrato, Long> indexador = new IndexadorSemMapper<>(contratoRepository,
                contratoSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.CONTRATO.name());
        indexador.setDescricao(IndexadoresUtil.CONTRATO.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorDer() {
        IndexadorSemMapper<Der, Long> indexador = new IndexadorSemMapper<>(derRepository,
                derSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.DER.name());
        indexador.setDescricao(IndexadoresUtil.DER.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorEsforcoFase() {
        IndexadorSemMapper<EsforcoFase, Long> indexador = new IndexadorSemMapper<>(esforcoFaseRepository,
                esforcoFaseSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ESFORCO_FASE.name());
        indexador.setDescricao(IndexadoresUtil.ESFORCO_FASE.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorFatorAjuste() {
        IndexadorSemMapper<FatorAjuste, Long> indexador = new IndexadorSemMapper<>(fatorAjusteRepository,
                fatorAjusteSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FATOR_AJUSTE.name());
        indexador.setDescricao(IndexadoresUtil.FATOR_AJUSTE.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorFuncaoDados() {
        IndexadorSemMapper<FuncaoDados, Long> indexador = new IndexadorSemMapper<>(funcaoDadosRepository,
                funcaoDadosSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FUNCAO_DADOS.name());
        indexador.setDescricao(IndexadoresUtil.FUNCAO_DADOS.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorFuncaoTransacao() {
        IndexadorSemMapper<FuncaoTransacao, Long> indexador = new IndexadorSemMapper<>(funcaoTransacaoRepository,
                funcaoTransacaoSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FUNCAO_TRANSACAO.name());
        indexador.setDescricao(IndexadoresUtil.FUNCAO_TRANSACAO.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorFuncionalidade() {
        IndexadorSemMapper<Funcionalidade, Long> indexador = new IndexadorSemMapper<>(funcionalidadeRepository,
                funcionalidadeSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.FUNCIONALIDADE.name());
        indexador.setDescricao(IndexadoresUtil.FUNCIONALIDADE.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorManual() {
        IndexadorSemMapper<Manual, Long> indexador = new IndexadorSemMapper<>(manualRepository,
                manualSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.MANUAL.name());
        indexador.setDescricao(IndexadoresUtil.MANUAL.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorManualContrato() {
        IndexadorSemMapper<ManualContrato, Long> indexador = new IndexadorSemMapper<>(manualContratoRepository,
                manualContratoSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.MANUAL_CONTRATO.name());
        indexador.setDescricao(IndexadoresUtil.MANUAL_CONTRATO.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorModulo() {
        IndexadorSemMapper<Modulo, Long> indexador = new IndexadorSemMapper<>(moduloRepository,
                moduloSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.MODULO.name());
        indexador.setDescricao(IndexadoresUtil.MODULO.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorOrganizacao() {
        IndexadorSemMapper<Organizacao, Long> indexador = new IndexadorSemMapper<>(organizacaoRepository,
                organizacaoSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.ORGANIZACAO.name());
        indexador.setDescricao(IndexadoresUtil.ORGANIZACAO.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorRlr() {
        IndexadorSemMapper<Rlr, Long> indexador = new IndexadorSemMapper<>(rlrRepository,
                rlrSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.RLR.name());
        indexador.setDescricao(IndexadoresUtil.RLR.label);
        return indexador;
    }

    @Bean
    public Indexador indexadorTipoEquipe() {
        IndexadorSemMapper<TipoEquipe, Long> indexador = new IndexadorSemMapper<>(tipoEquipeRepository,
                tipoEquipeSearchRepository, elasticsearchTemplate);
        indexador.setCodigo(IndexadoresUtil.TIPO_EQUIPE.name());
        indexador.setDescricao(IndexadoresUtil.TIPO_EQUIPE.label);
        return indexador;
    }
}
