package br.com.basis.abaco.service;

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
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.VwAnaliseSomaPf;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.CompartilhadaRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoDadosVersionavelRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.UserRepository;
import br.com.basis.abaco.repository.VwAnaliseSomaPfRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
import br.com.basis.abaco.repository.search.UserSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import br.com.basis.abaco.service.dto.AnaliseEditDTO;
import br.com.basis.abaco.utils.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.*;

@Service
public class AnaliseService extends BaseService {
    public static final String ORGANIZACAO_ID = "organizacao.id";
    public static final String EQUIPE_RESPONSAVEL_ID = "equipeResponsavel.id";
    public static final String COMPARTILHADAS_EQUIPE_ID = "compartilhadas.equipeId";
    private BigDecimal percent  = new BigDecimal("100");
    private static final int decimalPlace = 2;
    private final static  String EMPTY_STRING = "";

    private final AnaliseRepository analiseRepository;
    private final AnaliseSearchRepository analiseSearchRepository;
    private final UserRepository userRepository;
    private final CompartilhadaRepository compartilhadaRepository;
    private final FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;
    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final VwAnaliseSomaPfRepository vwAnaliseSomaPfRepository;
    @Autowired
    private UserSearchRepository userSearchRepository;


    public AnaliseService(AnaliseRepository analiseRepository,
                          FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository,
                          UserRepository userRepository,
                          FuncaoDadosRepository funcaoDadosRepository,
                          CompartilhadaRepository compartilhadaRepository,
                          FuncaoTransacaoRepository funcaoTransacaoRepository,
                          AnaliseSearchRepository analiseSearchRepository,
                          VwAnaliseSomaPfRepository vwAnaliseSomaPfRepository) {
        this.analiseRepository = analiseRepository;
        this.funcaoDadosVersionavelRepository = funcaoDadosVersionavelRepository;
        this.userRepository = userRepository;
        this.compartilhadaRepository = compartilhadaRepository;
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.analiseSearchRepository = analiseSearchRepository;
        this.vwAnaliseSomaPfRepository = vwAnaliseSomaPfRepository;
    }

    public void bindFilterSearch(String identificador, String sistema, String metodo, String organizacao, String equipe, String usuario, Set<Long> equipesIds, Set<Long> organizacoes, BoolQueryBuilder qb) {
        mustMatchPhaseQuery(identificador, qb, "identificadorAnalise");
        mustTermQuery(sistema, qb, "sistema.id");
        mustMatchPhaseQuery(metodo, qb, "metodoContagem");
        mustTermQuery(organizacao, qb, ORGANIZACAO_ID);

        if (!StringUtils.isEmptyString((equipe))) {
            BoolQueryBuilder boolQueryBuilderEdquipe = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery(EQUIPE_RESPONSAVEL_ID, equipe))
                .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                .should(boolQueryBuilderEdquipe)
                .should(QueryBuilders.termsQuery(COMPARTILHADAS_EQUIPE_ID, equipe));
            qb.must(boolQueryBuilder);
        } else if (equipesIds != null && equipesIds.size() > 0) {
            BoolQueryBuilder boolQueryBuilderEdquipe = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery(EQUIPE_RESPONSAVEL_ID, equipesIds))
                .must(QueryBuilders.termsQuery(ORGANIZACAO_ID, organizacoes));
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                .should(boolQueryBuilderEdquipe)
                .should(QueryBuilders.termsQuery(COMPARTILHADAS_EQUIPE_ID, equipesIds));
            qb.must(boolQueryBuilder);
        }
        if (!StringUtils.isEmptyString((usuario))) {
            qb.must(nestedQuery("users", QueryBuilders.boolQuery().should(QueryBuilders.termQuery("users.id", usuario))));
        }

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
            Set<Rlr> rlrs = new HashSet<>();
            Set<Der> ders = new HashSet<>();
            FuncaoDados funcaoDado = new FuncaoDados();
            bindFuncaoDados(analiseClone, fd, rlrs, ders, funcaoDado);
            funcaoDado.setDers(ders);
            funcaoDado.setRlrs(rlrs);
            funcaoDados.add(funcaoDado);
        });
        return funcaoDados;
    }

    public Set<FuncaoTransacao> bindCloneFuncaoTransacaos(Analise analise, Analise analiseClone) {
        Set<FuncaoTransacao> funcaoTransacoes = new HashSet<>();
        analise.getFuncaoTransacaos().forEach(ft -> {
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
            funcaoTransacoes.add(funcaoTransacao);
        });
        return funcaoTransacoes;
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
    }

    public BoolQueryBuilder getBoolQueryBuilder(@RequestParam(value = "identificador", required = false) String identificador, @RequestParam(value = "sistema", required = false) String sistema, @RequestParam(value = "metodo", required = false) String metodo, @RequestParam(value = "organizacao", required = false) String organizacao, @RequestParam(value = "equipe", required = false) String equipe, @RequestParam(value = "usuario", required = false) String usuario) {
        User user = userSearchRepository.findByLogin(SecurityUtils.getCurrentUserLogin());
        Set<Long> equipesIds = getIdEquipes(user);
        Set<Long> organicoesIds = getIdOrganizacoes(user);
        BoolQueryBuilder qb = QueryBuilders.boolQuery();
        bindFilterSearch(identificador, sistema, metodo, organizacao, equipe, usuario, equipesIds, organicoesIds, qb);
        return qb;
    }

    public void bindAnaliseCompartilhada(Set<Compartilhada> lstCompartilhadas){
        if(lstCompartilhadas != null && lstCompartilhadas.size() > 0){
            long idAnalise = lstCompartilhadas.stream().findFirst().get().getAnaliseId();
            Analise analise = analiseRepository.findOne(idAnalise);
            analise.setCompartilhadas(lstCompartilhadas);
            analiseRepository.save(analise);
            analiseSearchRepository.save(convertToEntity(convertToDto(analise)));
        }
    }
    public boolean permissionToEdit(User user, Analise analise){
        boolean canEdit = false;
        if(user.getOrganizacoes().contains(analise.getOrganizacao())){
            if(user.getTipoEquipes().contains(analise.getEquipeResponsavel())){
                return true;
            }else {
                for (TipoEquipe tipoEquipe:user.getTipoEquipes()) {
                    for(Compartilhada compartilhada:analise.getCompartilhadas()){
                        if(compartilhada.getEquipeId().longValue() == tipoEquipe.getId().longValue() && !compartilhada.isViewOnly()){
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
            sumFase = sumFase.add(esforcoFase.getEsforco());
        }
        sumFase = sumFase.divide(percent);
        analise.setPfTotal(vwAnaliseSomaPf.getPfGross().setScale(decimalPlace).toString());
        analise.setAdjustPFTotal(vwAnaliseSomaPf.getPfTotal().multiply(sumFase).setScale(decimalPlace).toString());
    }
    public Analise bindCloneAnalise(Analise analiseClone, Analise analise, User user){
        List<User> lstUsers = new ArrayList<>();
        lstUsers.add(analiseClone.getCreatedBy());
        salvaNovaData(analiseClone);
        analiseClone.setDocumentacao(EMPTY_STRING);
        analiseClone.setFronteiras(EMPTY_STRING);
        analiseClone.setPropositoContagem(EMPTY_STRING);
        analiseClone.setEscopo(EMPTY_STRING);
        analiseClone.setDataCriacaoOrdemServico(analise.getDataHomologacao());
        analiseClone.setFuncaoDados(bindCloneFuncaoDados(analise, analiseClone));
        analiseClone.setFuncaoTransacaos(bindCloneFuncaoTransacaos(analise, analiseClone));
        analiseClone.setBloqueiaAnalise(false);
        return analiseClone;
    }
}
