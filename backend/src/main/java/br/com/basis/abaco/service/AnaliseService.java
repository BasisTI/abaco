package br.com.basis.abaco.service;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.nestedQuery;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Compartilhada;
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoDadosVersionavel;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.VwAnaliseDivergenteSomaPf;
import br.com.basis.abaco.domain.VwAnaliseSomaPf;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.StatusFuncao;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.CompartilhadaRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoDadosVersionavelRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.VwAnaliseDivergenteSomaPfRepository;
import br.com.basis.abaco.repository.VwAnaliseSomaPfRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import br.com.basis.abaco.service.dto.AnaliseDivergenceEditDTO;
import br.com.basis.abaco.service.dto.AnaliseEditDTO;
import br.com.basis.abaco.service.dto.filter.AnaliseFilterDTO;
import br.com.basis.abaco.utils.StringUtils;
import br.com.basis.dynamicexports.service.DynamicExportsService;

@Service
public class AnaliseService extends BaseService {
    public static final String ORGANIZACAO_ID = "organizacao.id";
    public static final String EQUIPE_RESPONSAVEL_ID = "equipeResponsavel.id";
    public static final String COMPARTILHADAS_EQUIPE_ID = "compartilhadas.equipeId";
    private BigDecimal percent = new BigDecimal("100");
    private static final int decimalPlace = 2;
    private final static String EMPTY_STRING = "";

    private final AnaliseRepository analiseRepository;
    private final AnaliseSearchRepository analiseSearchRepository;
    private final UserRepository userRepository;
    private final CompartilhadaRepository compartilhadaRepository;
    private final FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final VwAnaliseDivergenteSomaPfRepository vwAnaliseDivergenteSomaPfRepository;
    private final VwAnaliseSomaPfRepository vwAnaliseSomaPfRepository;
    private final TipoEquipeRepository tipoEquipeRepository;
    private final MailService mailService;
    private final DynamicExportsService dynamicExportsService;


    @Autowired
    private UserSearchRepository userSearchRepository;


    public AnaliseService(AnaliseRepository analiseRepository,
                          FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository,
                          UserRepository userRepository,
                          FuncaoDadosRepository funcaoDadosRepository,
                          CompartilhadaRepository compartilhadaRepository,
                          FuncaoTransacaoRepository funcaoTransacaoRepository,
                          AnaliseSearchRepository analiseSearchRepository,
                          VwAnaliseSomaPfRepository vwAnaliseSomaPfRepository,
                          TipoEquipeRepository tipoEquipeRepository,
                          VwAnaliseDivergenteSomaPfRepository vwAnaliseDivergenteSomaPfRepository,
                          MailService mailService
        ,DynamicExportsService dynamicExportsService) {
        this.analiseRepository = analiseRepository;
        this.funcaoDadosVersionavelRepository = funcaoDadosVersionavelRepository;
        this.userRepository = userRepository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.mailService = mailService;
        this.vwAnaliseSomaPfRepository = vwAnaliseSomaPfRepository;
        this.vwAnaliseDivergenteSomaPfRepository = vwAnaliseDivergenteSomaPfRepository;
        this.tipoEquipeRepository = tipoEquipeRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    public void bindFilterSearch(String identificador, Set<Long> sistema, Set<MetodoContagem> metodo, Set<Long> usuario, Long equipesIds, Set<Long> equipesUsersId, Set<Long> organizacoes, Set<Long> status, BoolQueryBuilder qb) {
        if (!StringUtils.isEmptyString((identificador))) {
            BoolQueryBuilder queryBuilderIdentificador = QueryBuilders.boolQuery()
                .must(
                    nestedQuery(
                        "analisesComparadas",
                        boolQuery().must(QueryBuilders.matchPhraseQuery("analisesComparadas.identificadorAnalise", identificador)
                        )
                    )
                );
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                .should(queryBuilderIdentificador)
                .should(QueryBuilders.matchPhraseQuery("numeroOs", identificador))
                .should(QueryBuilders.matchPhraseQuery("identificadorAnalise", identificador));
            qb.must(boolQueryBuilder);
        }
        bindFilterEquipeAndOrganizacao(equipesIds, equipesUsersId, organizacoes, qb);
        BoolQueryBuilder boolQueryBuilderDivergence;
        boolQueryBuilderDivergence = QueryBuilders.boolQuery()
            .mustNot(QueryBuilders.termQuery("isDivergence", true));
        qb.must(boolQueryBuilderDivergence);
        if (sistema != null && sistema.size() > 0) {
            BoolQueryBuilder boolQueryBuilderSistema = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery("sistema.id", sistema));
            qb.must(boolQueryBuilderSistema);
        }
        if (metodo != null && metodo.size() > 0) {
            BoolQueryBuilder boolQueryBuilderSistema = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery("metodoContagem", metodo));
            qb.must(boolQueryBuilderSistema);
        }
        if (status != null && status.size() > 0) {
            BoolQueryBuilder boolQueryBuilderStatus = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery("status.id", status));
            qb.must(boolQueryBuilderStatus);
        }

        if (usuario != null && usuario.size() > 0) {
            BoolQueryBuilder queryBuilderUsers = QueryBuilders.boolQuery()
                .must(
                    nestedQuery(
                        "users",
                        boolQuery().must(QueryBuilders.termsQuery("users.id", usuario)
                        )
                    )
                );
            qb.must(queryBuilderUsers);
        }
    }

    public void bindFilterSearchDivergence(String identificador, Set<Long> sistema, Set<Long> organizacoes, BoolQueryBuilder qb) {
        if (!StringUtils.isEmptyString((identificador))) {
            BoolQueryBuilder queryBuilderIdentificador = QueryBuilders.boolQuery()
                .must(
                    nestedQuery(
                        "analisesComparadas",
                        boolQuery().must(QueryBuilders.matchPhraseQuery("analisesComparadas.identificadorAnalise", identificador)
                        )
                    )
                );
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                .should(queryBuilderIdentificador)
                .should(QueryBuilders.matchPhraseQuery("numeroOs", identificador))
                .should(QueryBuilders.matchPhraseQuery("identificadorAnalise", identificador));
            qb.must(boolQueryBuilder);
        }
        bindFilterEquipeAndOrganizacaoDivergence(organizacoes, qb);
        BoolQueryBuilder boolQueryBuilderDivergence;
        boolQueryBuilderDivergence = QueryBuilders.boolQuery()
            .must(QueryBuilders.termQuery("isDivergence", true));
        qb.must(boolQueryBuilderDivergence);
        if (sistema != null && sistema.size() > 0) {
            BoolQueryBuilder boolQueryBuilderSistema = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery("sistema.id", sistema));
            qb.must(boolQueryBuilderSistema);
        }
    }

    private void bindFilterEquipeAndOrganizacao(Long equipesIds, Set<Long> equipesUsersId, Set<Long> organizacoes, BoolQueryBuilder qb) {
        BoolQueryBuilder boolQueryBuilderEquipe;
        BoolQueryBuilder boolQueryBuilderCompartilhada;
        if (equipesIds != null && equipesIds > 0) {
            if (equipesUsersId.contains(equipesIds)) {
                boolQueryBuilderEquipe = QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery(EQUIPE_RESPONSAVEL_ID, equipesIds))
                    .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));
                boolQueryBuilderCompartilhada = QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery(EQUIPE_RESPONSAVEL_ID, equipesIds))
                    .must(QueryBuilders.termsQuery(COMPARTILHADAS_EQUIPE_ID, equipesUsersId))
                    .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));

                BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                    .should(boolQueryBuilderEquipe)
                    .should(boolQueryBuilderCompartilhada);
                qb.must(boolQueryBuilder);
            } else {
                boolQueryBuilderCompartilhada = QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery(EQUIPE_RESPONSAVEL_ID, equipesIds))
                    .must(QueryBuilders.termsQuery(COMPARTILHADAS_EQUIPE_ID, equipesUsersId))
                    .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));

                BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                    .should(boolQueryBuilderCompartilhada);
                qb.must(boolQueryBuilder);
            }
        } else {
            boolQueryBuilderEquipe = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery(EQUIPE_RESPONSAVEL_ID, equipesUsersId))
                .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));

            boolQueryBuilderCompartilhada = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery(COMPARTILHADAS_EQUIPE_ID, equipesUsersId))
                .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                .should(boolQueryBuilderEquipe)
                .should(boolQueryBuilderCompartilhada);
            qb.must(boolQueryBuilder);
        }
    }

    private void bindFilterEquipeAndOrganizacaoDivergence( Set<Long> organizacoes, BoolQueryBuilder qb) {
        BoolQueryBuilder boolQueryBuilderEquipe = QueryBuilders.boolQuery()
            .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));
        BoolQueryBuilder boolQueryBuilderCompartilhada = QueryBuilders.boolQuery()
            .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
            .should(boolQueryBuilderEquipe)
            .should(boolQueryBuilderCompartilhada);
        qb.must(boolQueryBuilder);
    }


    private Set<Long> getIdEquipes(User user) {
        Set<TipoEquipe> listaEquipes = user.getTipoEquipes();
        Set<Long> equipesIds = new HashSet<>();
        listaEquipes.forEach(tipoEquipe -> {
            equipesIds.add(tipoEquipe.getId());
        });
        return equipesIds;
    }

    private Set<Long> getIdOrganizacoes(User user) {
        Set<Organizacao> organizacaos = user.getOrganizacoes();
        Set<Long> organizacoesIds = new HashSet<>();
        organizacaos.forEach(organizacao -> {
            organizacoesIds.add(organizacao.getId());
        });
        return organizacoesIds;
    }

    private Boolean checarPermissao(Long idAnalise) {
        Optional<User> logged = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());
        List<BigInteger> equipesIds = userRepository.findUserEquipes(logged.get().getId());
        List<Long> convertidos = equipesIds.stream().map(bigInteger -> bigInteger.longValue()).collect(Collectors.toList());
        Integer analiseDaEquipe = analiseRepository.analiseEquipe(idAnalise, convertidos);
        if (analiseDaEquipe.intValue() == 0) {
            return verificaCompartilhada(idAnalise);
        } else {
            return true;
        }

    }

    private Boolean verificaCompartilhada(Long idAnalise) {
        return compartilhadaRepository.existsByAnaliseId(idAnalise);
    }

    public Analise recuperarAnalise(Long id) {

        boolean retorno = checarPermissao(id);

        if (retorno) {
            return analiseRepository.findById(id);
        } else {
            return null;
        }
    }

    public Analise recuperarAnaliseDivergence(Long id) {
        return analiseRepository.findOneById(id);
    }

    @Transactional(readOnly = true)
    public Analise recuperarAnaliseContagem(@NotNull Long id) {

        boolean retorno = checarPermissao(id);

        if (retorno) {
            Analise analise = analiseRepository.reportContagem(id);
            Sistema sistema = analise.getSistema();
            if (sistema != null) {
                sistema.getModulos().forEach(modulo -> {
                    modulo.getFuncionalidades().forEach(funcionalidade -> {
                        funcionalidade.setFuncoesDados(funcaoDadosRepository.findByAnaliseFuncionalidade(id, funcionalidade.getId()));
                        funcionalidade.setFuncoesTransacao(funcaoTransacaoRepository.findByAnaliseFuncionalidade(id, funcionalidade.getId()));
                    });
                });
                return analise;
            }
            return null;
        } else {
            return null;
        }
    }

    public void linkFuncoesToAnalise(Analise analise) {
        linkAnaliseToFuncaoDados(analise);
        linkAnaliseToFuncaoTransacaos(analise);
    }

    private void linkAnaliseToFuncaoDados(Analise analise) {
        Optional.ofNullable(analise.getFuncaoDados()).orElse(Collections.emptySet())
            .forEach(funcaoDados -> {
                funcaoDados.setAnalise(analise);
                linkFuncaoDadosRelationships(funcaoDados);
                handleVersionFuncaoDados(funcaoDados, analise.getSistema());
            });
    }

    private void linkFuncaoDadosRelationships(FuncaoDados funcaoDados) {
        Optional.ofNullable(funcaoDados.getFiles()).orElse(Collections.emptyList())
            .forEach(file -> file.setFuncaoDados(funcaoDados));
        Optional.ofNullable(funcaoDados.getDers()).orElse(Collections.emptySet())
            .forEach(der -> der.setFuncaoDados(funcaoDados));
        Optional.ofNullable(funcaoDados.getRlrs()).orElse(Collections.emptySet())
            .forEach(rlr -> rlr.setFuncaoDados(funcaoDados));
    }

    private void handleVersionFuncaoDados(FuncaoDados funcaoDados, Sistema sistema) {
        String nome = funcaoDados.getName();
        Optional<FuncaoDadosVersionavel> funcaoDadosVersionavel =
            funcaoDadosVersionavelRepository.findOneByNomeIgnoreCaseAndSistemaId(nome, sistema.getId());
        if (funcaoDadosVersionavel.isPresent()) {
            funcaoDados.setFuncaoDadosVersionavel(funcaoDadosVersionavel.get());
        } else {
            FuncaoDadosVersionavel novaFDVersionavel = new FuncaoDadosVersionavel();
            novaFDVersionavel.setNome(funcaoDados.getName());
            novaFDVersionavel.setSistema(sistema);
            FuncaoDadosVersionavel result = funcaoDadosVersionavelRepository.save(novaFDVersionavel);
            funcaoDados.setFuncaoDadosVersionavel(result);
        }
    }

    private void linkAnaliseToFuncaoTransacaos(Analise analise) {
        Optional.ofNullable(analise.getFuncaoTransacaos()).orElse(Collections.emptySet())
            .forEach(funcaoTransacao -> {
                funcaoTransacao.setAnalise(analise);
                Optional.ofNullable(funcaoTransacao.getFiles()).orElse(Collections.emptyList())
                    .forEach(file -> file.setFuncaoTransacao(funcaoTransacao));
                Optional.ofNullable(funcaoTransacao.getDers()).orElse(Collections.emptySet())
                    .forEach(der -> der.setFuncaoTransacao(funcaoTransacao));
                Optional.ofNullable(funcaoTransacao.getAlrs()).orElse(Collections.emptySet())
                    .forEach(alr -> alr.setFuncaoTransacao(funcaoTransacao));
            });
    }

    public void salvaNovaData(Analise analise) {
        if (analise.getDataHomologacao() != null) {
            Timestamp dataDeHoje = new Timestamp(System.currentTimeMillis());
            Timestamp dataParam = analise.getDataHomologacao();
            dataParam.setHours(dataDeHoje.getHours());
            dataParam.setMinutes(dataDeHoje.getMinutes());
            dataParam.setSeconds(dataDeHoje.getSeconds());
        }
    }

    public Set<FuncaoDados> bindCloneFuncaoDados(Analise analise, Analise analiseClone) {
        Set<FuncaoDados> funcaoDados = new HashSet<>();
        analise.getFuncaoDados().forEach(fd -> {
            FuncaoDados funcaoDado = bindFuncaoDados(analiseClone, fd);
            funcaoDados.add(funcaoDado);
        });
        return funcaoDados;
    }

    private FuncaoDados bindFuncaoDados(Analise analiseClone, FuncaoDados fd) {
        Set<Rlr> rlrs = new HashSet<>();
        Set<Der> ders = new HashSet<>();
        FuncaoDados funcaoDado = new FuncaoDados();
        bindFuncaoDados(analiseClone, fd, rlrs, ders, funcaoDado);
        funcaoDado.setDers(ders);
        funcaoDado.setRlrs(rlrs);
        return funcaoDado;
    }

    public Set<FuncaoDados> bindDivergenceFuncaoDados(Analise analise, Analise analiseClone) {
        Set<FuncaoDados> funcaoDados = new HashSet<>();
        analise.getFuncaoDados().forEach(fd -> {
            FuncaoDados funcaoDado = bindFuncaoDados(analiseClone, fd);
            funcaoDado.setStatusFuncao(StatusFuncao.DIVERGENTE);
            funcaoDados.add(funcaoDado);
        });
        return funcaoDados;
    }

    public Set<FuncaoTransacao> bindCloneFuncaoTransacaos(Analise analise, Analise analiseClone) {
        Set<FuncaoTransacao> funcaoTransacoes = new HashSet<>();
        analise.getFuncaoTransacaos().forEach(ft -> {
            FuncaoTransacao funcaoTransacao = bindFuncaoTransacao(analiseClone, ft);
            funcaoTransacoes.add(funcaoTransacao);
        });
        return funcaoTransacoes;
    }

    public Set<FuncaoTransacao> bindDivergenceFuncaoTransacaos(Analise analise, Analise analiseClone) {
        Set<FuncaoTransacao> funcaoTransacoes = new HashSet<>();
        analise.getFuncaoTransacaos().forEach(ft -> {
            FuncaoTransacao funcaoTransacao = bindFuncaoTransacao(analiseClone, ft);
            funcaoTransacao.setStatusFuncao(StatusFuncao.DIVERGENTE);
            funcaoTransacoes.add(funcaoTransacao);
        });
        return funcaoTransacoes;
    }

    private FuncaoTransacao bindFuncaoTransacao(Analise analiseClone, FuncaoTransacao ft) {
        Set<Alr> alrs = new HashSet<>();
        Set<Der> ders = new HashSet<>();
        FuncaoTransacao funcaoTransacao = new FuncaoTransacao();
        funcaoTransacao.bindFuncaoTransacao(ft.getTipo(), ft.getFtrStr(), ft.getQuantidade(), alrs, null, ft.getFtrValues(), ft.getImpacto(), ders, analiseClone, ft.getComplexidade(), ft.getPf(), ft.getGrossPF(), ft.getFuncionalidade(), ft.getDetStr(), ft.getFatorAjuste(), ft.getName(), ft.getSustantation(), ft.getDerValues());
        ft.getAlrs().forEach(alr -> {
            Alr alrClone = new Alr(null, alr.getNome(), alr.getValor(), funcaoTransacao, null);
            alrs.add(alrClone);
        });
        ft.getDers().forEach(der -> {
            Der derClone = new Der(null, der.getNome(), der.getValor(), der.getRlr(), null, funcaoTransacao);
            ders.add(derClone);
        });
        return funcaoTransacao;
    }

    public void bindAnaliseCloneForTipoEquipe(Analise analise, TipoEquipe tipoEquipe, Analise analiseClone) {
        analiseClone.setPfTotal("0");
        analiseClone.setAdjustPFTotal("0");
        analiseClone.setEquipeResponsavel(tipoEquipe);
        analiseClone.setUsers(new HashSet<>());
        analiseClone.setBloqueiaAnalise(false);
        analiseClone.setClonadaParaEquipe(true);
        salvaNovaData(analiseClone);
        analiseClone.setDataCriacaoOrdemServico(analise.getDataHomologacao());
    }

    private void bindFuncaoDados(Analise analiseClone, FuncaoDados fd, Set<Rlr> rlrs, Set<Der> ders, FuncaoDados funcaoDado) {
        funcaoDado.bindFuncaoDados(fd.getComplexidade(), fd.getPf(), fd.getGrossPF(), analiseClone, fd.getFuncionalidade(), fd.getDetStr(), fd.getFatorAjuste(), fd.getName(), fd.getSustantation(), fd.getDerValues(), fd.getTipo(), fd.getFuncionalidades(), fd.getRetStr(), fd.getQuantidade(), rlrs, fd.getAlr(), fd.getFiles(), fd.getRlrValues(), ders, fd.getFuncaoDadosVersionavel(), fd.getImpacto());
        Optional.ofNullable(fd.getDers()).orElse(Collections.emptySet())
            .forEach(der -> {
                Rlr rlr = null;
                if (der.getRlr() != null) {
                    rlr = new Rlr(null, der.getRlr().getNome(), der.getRlr().getValor(), der.getRlr().getDers(), funcaoDado);
                }
                Der derClone = new Der(null, der.getNome(), der.getValor(), rlr, funcaoDado, null);
                ders.add(derClone);
            });
        Optional.ofNullable(fd.getRlrs()).orElse(Collections.emptySet())
            .forEach(rlr -> {
                Rlr rlrClone = new Rlr(null, rlr.getNome(), rlr.getValor(), ders, funcaoDado);
                rlrs.add(rlrClone);
            });
    }

    public AnaliseDTO convertToDto(Analise analise) {
        return new ModelMapper().map(analise, AnaliseDTO.class);
    }

    public Analise convertToEntity(AnaliseDTO analiseDTO) {
        return new ModelMapper().map(analiseDTO, Analise.class);
    }

    public AnaliseEditDTO convertToAnaliseEditDTO(Analise analise) {
        return new ModelMapper().map(analise, AnaliseEditDTO.class);
    }

    public AnaliseDivergenceEditDTO convertToAnaliseDivergenceEditDTO(Analise analise) {
        return new ModelMapper().map(analise, AnaliseDivergenceEditDTO.class);
    }

    public Analise convertToEntity(AnaliseEditDTO analiseEditDTO) {
        return new ModelMapper().map(analiseEditDTO, Analise.class);
    }

    public void bindAnalise(@RequestBody @Valid Analise analiseUpdate, Analise analise) {
        salvaNovaData(analiseUpdate);
        analise.setNumeroOs(analiseUpdate.getNumeroOs());
        analise.setIdentificadorAnalise(analiseUpdate.getIdentificadorAnalise());
        analise.setDataCriacaoOrdemServico(analiseUpdate.getDataCriacaoOrdemServico());
        analise.setMetodoContagem(analiseUpdate.getMetodoContagem());
        analise.setUsers(analiseUpdate.getUsers());
        analise.setPropositoContagem(analiseUpdate.getPropositoContagem());
        analise.setEscopo(analiseUpdate.getEscopo());
        analise.setFronteiras(analiseUpdate.getFronteiras());
        analise.setDocumentacao(analiseUpdate.getDocumentacao());
        analise.setBaselineImediatamente(analiseUpdate.getBaselineImediatamente());
        analise.setDataHomologacao(analiseUpdate.getDataHomologacao());
        analise.setEnviarBaseline(analiseUpdate.isEnviarBaseline());
        analise.setObservacoes(analiseUpdate.getObservacoes());
        analise.setEsforcoFases(analiseUpdate.getEsforcoFases());
        analise.setStatus(analiseUpdate.getStatus());
    }

    public BoolQueryBuilder getBoolQueryBuilder(String identificador, Set<Long> sistema, Set<MetodoContagem> metodo, Set<Long> organizacao, Long equipe, Set<Long> usuario, Set<Long> idsStatus) {
        User user = userSearchRepository.findByLogin(SecurityUtils.getCurrentUserLogin());
        Set<Long> equipesIds = getIdEquipes(user);
        Set<Long> organicoesIds = (organizacao != null && organizacao.size() > 0) ? organizacao : getIdOrganizacoes(user);
        BoolQueryBuilder qb = QueryBuilders.boolQuery();
        bindFilterSearch(identificador, sistema, metodo, usuario, equipe, equipesIds, organicoesIds, idsStatus, qb);
        return qb;
    }

    public BoolQueryBuilder getBoolQueryBuilderDivergence(String identificador, Set<Long> sistema, Set<Long> organizacao) {
        User user = userSearchRepository.findByLogin(SecurityUtils.getCurrentUserLogin());
        Set<Long> organicoesIds = (organizacao != null && organizacao.size() > 0) ? organizacao : getIdOrganizacoes(user);
        BoolQueryBuilder qb = QueryBuilders.boolQuery();
        bindFilterSearchDivergence(identificador, sistema, organicoesIds, qb);
        return qb;
    }


    public void saveAnaliseCompartilhada(Set<Compartilhada> lstCompartilhadas) {
        if (lstCompartilhadas != null && lstCompartilhadas.size() > 0) {
            long idAnalise = lstCompartilhadas.stream().findFirst().get().getAnaliseId();
            Analise analise = analiseRepository.findOne(idAnalise);
            analise.setCompartilhadas(lstCompartilhadas);
            analiseRepository.save(analise);
            analiseSearchRepository.save(convertToEntity(convertToDto(analise)));
            lstCompartilhadas.forEach(compartilhada -> {
                TipoEquipe tipoEquipe = this.tipoEquipeRepository.findById(compartilhada.getEquipeId());
                if (!(StringUtils.isEmptyString(tipoEquipe.getEmailPreposto()) && StringUtils.isEmptyString(tipoEquipe.getPreposto()))) {
                    this.mailService.sendAnaliseSharedEmail(analise, tipoEquipe);
                }
            });
        }
    }

    public boolean permissionToEdit(User user, Analise analise) {
        boolean canEdit = false;
        if (user.getOrganizacoes().contains(analise.getOrganizacao())) {
            if (user.getTipoEquipes().contains(analise.getEquipeResponsavel())) {
                return true;
            } else {
                for (TipoEquipe tipoEquipe : user.getTipoEquipes()) {
                    for (Compartilhada compartilhada : analise.getCompartilhadas()) {
                        if (compartilhada.getEquipeId().longValue() == tipoEquipe.getId().longValue() && !compartilhada.isViewOnly()) {
                            canEdit = true;
                        }
                    }
                }
            }
        }
        return canEdit;
    }

    public void updatePf(Analise analise) {
        VwAnaliseSomaPf vwAnaliseSomaPf = vwAnaliseSomaPfRepository.findByAnaliseId(analise.getId());
        BigDecimal sumFase = new BigDecimal(BigInteger.ZERO).setScale(decimalPlace);
        for (EsforcoFase esforcoFase : analise.getEsforcoFases()) {
            sumFase = sumFase.add(esforcoFase.getEsforco().setScale(decimalPlace));
        }
        sumFase = sumFase.divide(percent).setScale(decimalPlace);
        analise.setPfTotal(vwAnaliseSomaPf.getPfGross().setScale(decimalPlace).toString());
        analise.setAdjustPFTotal(vwAnaliseSomaPf.getPfTotal().multiply(sumFase).setScale(decimalPlace, BigDecimal.ROUND_HALF_DOWN).toString());
    }

    public void updatePFDivergente(Analise analise) {
        VwAnaliseDivergenteSomaPf vwAnaliseDivergenteSomaPf = vwAnaliseDivergenteSomaPfRepository.findByAnaliseId(analise.getId());
        BigDecimal sumFase = new BigDecimal(BigInteger.ZERO).setScale(decimalPlace);
        for (EsforcoFase esforcoFase : analise.getEsforcoFases()) {
            sumFase = sumFase.add(esforcoFase.getEsforco().setScale(decimalPlace));
        }
        sumFase = sumFase.divide(percent).setScale(decimalPlace);
        analise.setPfTotal(vwAnaliseDivergenteSomaPf.getPfGross().setScale(decimalPlace).toString());
        analise.setAdjustPFTotal(vwAnaliseDivergenteSomaPf.getPfTotal().multiply(sumFase).setScale(decimalPlace, BigDecimal.ROUND_HALF_DOWN).toString());
    }


    public Analise bindCloneAnalise(Analise analiseClone, Analise analise, User user) {
        Set<User> lstUsers = new LinkedHashSet<>();
        lstUsers.add(user);
        salvaNovaData(analiseClone);
        analiseClone.setUsers(lstUsers);
        analiseClone.setDocumentacao(EMPTY_STRING);
        analiseClone.setFronteiras(EMPTY_STRING);
        analiseClone.setPropositoContagem(EMPTY_STRING);
        analiseClone.setEscopo(EMPTY_STRING);
        analiseClone.setDataCriacaoOrdemServico(analise.getDataHomologacao());
        analiseClone.setFuncaoDados(bindCloneFuncaoDados(analise, analiseClone));
        analiseClone.setFuncaoTransacaos(bindCloneFuncaoTransacaos(analise, analiseClone));
        analiseClone.setEsforcoFases(bindCloneEsforcoFase(analise));
        analiseClone.setBloqueiaAnalise(false);
        return analiseClone;
    }

    public Analise bindDivergenceAnalise(Analise analiseClone, Analise analise, User user) {
        Set<User> lstUsers = new LinkedHashSet<>();
        lstUsers.add(user);
        salvaNovaData(analiseClone);
        analiseClone.setUsers(lstUsers);
        analiseClone.setDocumentacao(EMPTY_STRING);
        analiseClone.setFronteiras(EMPTY_STRING);
        analiseClone.setPropositoContagem(EMPTY_STRING);
        analiseClone.setEscopo(EMPTY_STRING);
        analiseClone.setFuncaoDados(bindDivergenceFuncaoDados(analise, analiseClone));
        analiseClone.setFuncaoTransacaos(bindDivergenceFuncaoTransacaos(analise, analiseClone));
        analiseClone.setEsforcoFases(bindCloneEsforcoFase(analise));
        analiseClone.setBloqueiaAnalise(false);
        return analiseClone;
    }

    public Set<EsforcoFase> bindCloneEsforcoFase(Analise analise) {
        Set<EsforcoFase> esforcoFases = new HashSet<>();
        analise.getEsforcoFases().forEach(esforcoFase -> {
            esforcoFase = new EsforcoFase(esforcoFase.getId(), esforcoFase.getEsforco(), esforcoFase.getManual(), esforcoFase.getFase());
            esforcoFases.add(esforcoFase);
        });
        return esforcoFases;
    }

    public boolean changeStatusAnalise(Analise analise, Status status, User user) {

        if (user.getTipoEquipes().contains(analise.getEquipeResponsavel()) && user.getOrganizacoes().contains(analise.getOrganizacao())) {
            analise.setStatus(status);
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    public Analise generateDivergence(Analise analise, Status status) {
        Optional<User> optUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        if (optUser.isPresent()) {
            User user = optUser.get();
            Analise analiseDivergencia = new Analise(analise, user);
            analiseDivergencia = bindDivergenceAnalise(analiseDivergencia, analise, user);
            analiseDivergencia.setStatus(status);
            analiseDivergencia.setIsDivergence(true);
            updateAnaliseRelationAndSendEmail(analise, status, analiseDivergencia);
            analiseDivergencia = save(analiseDivergencia);
            return analiseDivergencia;
        }
        return new Analise();
    }

    @Transactional
    public Analise generateDivergence(Analise analisePricinpal, Analise analiseSecundaria, Status status, boolean isUnionFunction) {
        Analise analiseDivergencia = bindAnaliseDivegernce(analisePricinpal, analiseSecundaria, status, isUnionFunction);
        save(analiseDivergencia);
        updateAnaliseRelationAndSendEmail(analisePricinpal, status, analiseDivergencia);
        updateAnaliseRelationAndSendEmail(analiseSecundaria, status, analiseDivergencia);
        sharedAnaliseDivergence(analiseSecundaria, analiseDivergencia);
        return analiseDivergencia;
    }

    private void sharedAnaliseDivergence(Analise analiseSecundaria, Analise analiseDivergencia) {
        Compartilhada compartilhada = new Compartilhada();
        compartilhada.setAnaliseId(analiseDivergencia.getId());
        compartilhada.setEquipeId(analiseSecundaria.getEquipeResponsavel().getId());
        compartilhada.setNomeEquipe(analiseSecundaria.getEquipeResponsavel().getNome());
        compartilhada.setViewOnly(true);
        compartilhadaRepository.save(compartilhada);
    }

    private void updateAnaliseRelationAndSendEmail(Analise analisePricinpal, Status status, Analise analiseDivergencia) {
        analisePricinpal.setStatus(status);
        analisePricinpal.setAnaliseDivergence(analiseDivergencia);
        save(analisePricinpal);
        if (analisePricinpal.getEquipeResponsavel().getNome() != null && analisePricinpal.getEquipeResponsavel().getEmailPreposto() != null) {
            mailService.sendDivergenceEmail(analisePricinpal);
        }
    }

    private Analise bindAnaliseDivegernce(Analise analisePrincipal, Analise analiseSecundaria, Status status, boolean isUnionFunction) {
        Optional<User> optUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        if (optUser.isPresent()) {
            User user = optUser.get();
            Analise analiseDivergenciaPrincipal = new Analise(analisePrincipal, user);
            analiseDivergenciaPrincipal = bindDivergenceAnalise(analiseDivergenciaPrincipal, analisePrincipal, user);
            if (isUnionFunction) {
                unionFuncaoDadosAndFuncaoTransacao(analisePrincipal, analiseSecundaria, analiseDivergenciaPrincipal);
            }
            analiseDivergenciaPrincipal.setStatus(status);
            analiseDivergenciaPrincipal.setIsDivergence(true);
            analiseDivergenciaPrincipal.setDataCriacaoOrdemServico(Timestamp.from(Instant.now()));
            return analiseDivergenciaPrincipal;
        }
        return new Analise();
    }

    private void unionFuncaoDadosAndFuncaoTransacao(Analise analisePrincipal, Analise analiseSecundaria, Analise analiseDivergenciaPrincipal) {
        Set<FuncaoDados> lstFuncaoDados = new HashSet<>();
        Set<FuncaoTransacao> lstFuncaoTransacaos = new HashSet<>();
        lstFuncaoDados.addAll(analisePrincipal.getFuncaoDados());
        lstFuncaoDados.addAll(analiseSecundaria.getFuncaoDados());
        lstFuncaoTransacaos.addAll(analisePrincipal.getFuncaoTransacaos());
        lstFuncaoTransacaos.addAll(analiseSecundaria.getFuncaoTransacaos());
        analisePrincipal.setFuncaoDados(lstFuncaoDados);
        analisePrincipal.setFuncaoTransacaos(lstFuncaoTransacaos);
        analiseDivergenciaPrincipal.setFuncaoDados(bindDivergenceFuncaoDados(analisePrincipal, analiseDivergenciaPrincipal));
        analiseDivergenciaPrincipal.setFuncaoTransacaos(bindDivergenceFuncaoTransacaos(analisePrincipal, analiseDivergenciaPrincipal));
    }

    public Analise save(Analise analise) {
        analise = analiseRepository.save(analise);
        AnaliseDTO analiseDTO = convertToDto(analise);
        analise = convertToEntity(analiseDTO);
        analise = analiseSearchRepository.save(analise);
        return analise;
    }

    public Analise updateDivergenceAnalise(Analise analise) {
        updatePFDivergente(analise);
        analise.setIdentificadorAnalise(analise.getId().toString());
        analise = save(analise);
        return analise;
    }

    public void deleteDivergence(Long id, Analise analise) {
        analise.getCompartilhadas().forEach(compartilhada -> {
            compartilhadaRepository.delete(compartilhada.getId());
        });
        analise.getAnalisesComparadas().forEach(analiseComparada -> {
            analiseComparada.setAnaliseDivergence(null);
            save(analiseComparada);
        });
        analiseRepository.delete(id);
        analiseSearchRepository.delete(id);
    }

    
    public SearchQuery getQueryExportRelatorio(AnaliseFilterDTO filter,  Pageable pageable) {
        Set<Long> sistema = new HashSet<>();
        Set<MetodoContagem> metodo = new HashSet<>();
        Set<Long> organizacao = new HashSet<>();
        Set<Long> usuario = new HashSet<>();
        Set<Long> status = new HashSet<>();
        
        preencheFiltro(sistema,metodo,organizacao,usuario,status, filter);
        
        pageable = dynamicExportsService.obterPageableMaximoExportacao();
        BoolQueryBuilder qb =  getBoolQueryBuilder(filter.getIdentificadorAnalise(), sistema, metodo, organizacao, filter.getEquipe() == null ? null : filter.getEquipe().getId(), usuario, status);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
        return searchQuery;
    }

    private void preencheFiltro(Set<Long> sistema, Set<MetodoContagem> metodo, Set<Long> organizacao, Set<Long> usuario,
            Set<Long> status, AnaliseFilterDTO filter) {
        if(filter.getSistema() != null) {
            sistema.add(filter.getSistema().getId());
        }
        if(filter.getMetodoContagem() != null) {
            metodo.add(filter.getMetodoContagem());
        }
        if(filter.getOrganizacao() != null) {
            organizacao.add(filter.getOrganizacao().getId());
        }
        if(filter.getUsuario() != null) {
            usuario.add(filter.getUsuario().getId());
        }
        if(filter.getStatus() != null) {
            status.add(filter.getStatus().getId());
        }
        
    }

    public SearchQuery getQueryExportRelatorioDivergencia(AnaliseFilterDTO filter, Pageable pageable) {
        Set<Long> sistema = new HashSet<>();
        Set<Long> organizacao = new HashSet<>();
        preencheFiltro(sistema,null,organizacao,null,null, filter);
        
        BoolQueryBuilder qb = getBoolQueryBuilderDivergence(filter.getIdentificadorAnalise(), sistema, organizacao);
        SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(qb).withPageable(pageable).build();
        return searchQuery;
    }


}
