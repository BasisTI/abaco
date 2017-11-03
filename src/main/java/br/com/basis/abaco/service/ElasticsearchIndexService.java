package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.Modulo;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.ContratoRepository;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.EsforcoFaseRepository;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.repository.FatorAjusteRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.ModuloRepository;
import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.search.AlrSearchRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.ContratoSearchRepository;
import br.com.basis.abaco.repository.search.DerSearchRepository;
import br.com.basis.abaco.repository.search.EsforcoFaseSearchRepository;
import br.com.basis.abaco.repository.search.FaseSearchRepository;
import br.com.basis.abaco.repository.search.FatorAjusteSearchRepository;
import br.com.basis.abaco.repository.search.FuncaoDadosSearchRepository;
import br.com.basis.abaco.repository.search.FuncaoTransacaoSearchRepository;
import br.com.basis.abaco.repository.search.FuncionalidadeSearchRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.repository.search.ModuloSearchRepository;
import br.com.basis.abaco.repository.search.OrganizacaoSearchRepository;
import br.com.basis.abaco.repository.search.RlrSearchRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import com.codahale.metrics.annotation.Timed;
import org.elasticsearch.indices.IndexAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.List;

@Service
public class ElasticsearchIndexService {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final AlrRepository alrRepository;

    private final AlrSearchRepository alrSearchRepository;

    private final AnaliseRepository analiseRepository;

    private final AnaliseSearchRepository analiseSearchRepository;

    private final ContratoRepository contratoRepository;

    private final ContratoSearchRepository contratoSearchRepository;

    private final DerRepository derRepository;

    private final DerSearchRepository derSearchRepository;

    private final EsforcoFaseRepository esforcoFaseRepository;

    private final EsforcoFaseSearchRepository esforcoFaseSearchRepository;

    private final FaseRepository faseRepository;

    private final FaseSearchRepository faseSearchRepository;

    private final FatorAjusteRepository fatorAjusteRepository;

    private final FatorAjusteSearchRepository fatorAjusteSearchRepository;

    private final FuncaoDadosRepository funcaoDadosRepository;

    private final FuncaoDadosSearchRepository funcaoDadosSearchRepository;

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;

    private final FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository;

    private final FuncionalidadeRepository funcionalidadeRepository;

    private final FuncionalidadeSearchRepository funcionalidadeSearchRepository;

    private final ManualRepository manualRepository;

    private final ManualSearchRepository manualSearchRepository;

    private final ModuloRepository moduloRepository;

    private final ModuloSearchRepository moduloSearchRepository;

    private final OrganizacaoRepository organizacaoRepository;

    private final OrganizacaoSearchRepository organizacaoSearchRepository;

    private final RlrRepository rlrRepository;

    private final RlrSearchRepository rlrSearchRepository;

    private final SistemaRepository sistemaRepository;

    private final SistemaSearchRepository sistemaSearchRepository;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        AlrRepository alrRepository,
        AlrSearchRepository alrSearchRepository,
        AnaliseRepository analiseRepository,
        AnaliseSearchRepository analiseSearchRepository,
        ContratoRepository contratoRepository,
        ContratoSearchRepository contratoSearchRepository,
        DerRepository derRepository,
        DerSearchRepository derSearchRepository,
        EsforcoFaseRepository esforcoFaseRepository,
        EsforcoFaseSearchRepository esforcoFaseSearchRepository,
        FaseRepository faseRepository,
        FaseSearchRepository faseSearchRepository,
        FatorAjusteRepository fatorAjusteRepository,
        FatorAjusteSearchRepository fatorAjusteSearchRepository,
        FuncaoDadosRepository funcaoDadosRepository,
        FuncaoDadosSearchRepository funcaoDadosSearchRepository,
        FuncaoTransacaoRepository funcaoTransacaoRepository,
        FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository,
        FuncionalidadeRepository funcionalidadeRepository,
        FuncionalidadeSearchRepository funcionalidadeSearchRepository,
        ManualRepository manualRepository,
        ManualSearchRepository manualSearchRepository,
        ModuloRepository moduloRepository,
        ModuloSearchRepository moduloSearchRepository,
        OrganizacaoRepository organizacaoRepository,
        OrganizacaoSearchRepository organizacaoSearchRepository,
        RlrRepository rlrRepository,
        RlrSearchRepository rlrSearchRepository,
        SistemaRepository sistemaRepository,
        SistemaSearchRepository sistemaSearchRepository,
        ElasticsearchTemplate elasticsearchTemplate) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.alrRepository = alrRepository;
        this.alrSearchRepository = alrSearchRepository;
        this.analiseRepository = analiseRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.contratoRepository = contratoRepository;
        this.contratoSearchRepository = contratoSearchRepository;
        this.derRepository = derRepository;
        this.derSearchRepository = derSearchRepository;
        this.esforcoFaseRepository = esforcoFaseRepository;
        this.esforcoFaseSearchRepository = esforcoFaseSearchRepository;
        this.faseRepository = faseRepository;
        this.faseSearchRepository = faseSearchRepository;
        this.fatorAjusteRepository = fatorAjusteRepository;
        this.fatorAjusteSearchRepository = fatorAjusteSearchRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoDadosSearchRepository = funcaoDadosSearchRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.funcaoTransacaoSearchRepository = funcaoTransacaoSearchRepository;
        this.funcionalidadeRepository = funcionalidadeRepository;
        this.funcionalidadeSearchRepository = funcionalidadeSearchRepository;
        this.manualRepository = manualRepository;
        this.manualSearchRepository = manualSearchRepository;
        this.moduloRepository = moduloRepository;
        this.moduloSearchRepository = moduloSearchRepository;
        this.organizacaoRepository = organizacaoRepository;
        this.organizacaoSearchRepository = organizacaoSearchRepository;
        this.rlrRepository = rlrRepository;
        this.rlrSearchRepository = rlrSearchRepository;
        this.sistemaRepository = sistemaRepository;
        this.sistemaSearchRepository = sistemaSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Async
    @Timed
    public void reindexAll() {
        reindexForClass(Alr.class, alrRepository, alrSearchRepository);
        reindexForClass(Analise.class, analiseRepository, analiseSearchRepository);
        reindexForClass(Contrato.class, contratoRepository, contratoSearchRepository);
        reindexForClass(Der.class, derRepository, derSearchRepository);
        reindexForClass(EsforcoFase.class, esforcoFaseRepository, esforcoFaseSearchRepository);
        reindexForClass(Fase.class, faseRepository, faseSearchRepository);
        reindexForClass(FatorAjuste.class, fatorAjusteRepository, fatorAjusteSearchRepository);
        reindexForClass(FuncaoDados.class, funcaoDadosRepository, funcaoDadosSearchRepository);
        reindexForClass(FuncaoTransacao.class, funcaoTransacaoRepository, funcaoTransacaoSearchRepository);
        reindexForClass(Funcionalidade.class, funcionalidadeRepository, funcionalidadeSearchRepository);
        reindexForClass(Manual.class, manualRepository, manualSearchRepository);
        reindexForClass(Modulo.class, moduloRepository, moduloSearchRepository);
        reindexForClass(Organizacao.class, organizacaoRepository, organizacaoSearchRepository);
        reindexForClass(Rlr.class, rlrRepository, rlrSearchRepository);
        reindexForClass(Sistema.class, sistemaRepository, sistemaSearchRepository);
        reindexForClass(User.class, userRepository, userSearchRepository);

        log.info("Elasticsearch: Successfully performed reindexing");
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    private <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,
                                                              ElasticsearchRepository<T, ID> elasticsearchRepository) {
        elasticsearchTemplate.deleteIndex(entityClass);
        try {
            elasticsearchTemplate.createIndex(entityClass);
        } catch (IndexAlreadyExistsException e) {
            // Do nothing. Index was already concurrently recreated by some other service.
        }
        elasticsearchTemplate.putMapping(entityClass);
        if (jpaRepository.count() > 0) {
            try {
                Method m = jpaRepository.getClass().getMethod("findAllWithEagerRelationships");
                elasticsearchRepository.save((List<T>) m.invoke(jpaRepository));
            } catch (Exception e) {
                elasticsearchRepository.save(jpaRepository.findAll());
            }
        }
        log.info("Elasticsearch: Indexed all rows for " + entityClass.getSimpleName());
    }
}
