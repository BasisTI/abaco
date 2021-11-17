package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.*;
import br.com.basis.abaco.reports.util.RelatorioUtil;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BaselineAnaliseService extends BaseService{

    private final FuncaoDadosRepository funcaoDadosRepository;
    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final PlanilhaService planilhaService;
    private final AnaliseRepository analiseRepository;

    public BaselineAnaliseService(FuncaoDadosRepository funcaoDadosRepository, FuncaoTransacaoRepository funcaoTransacaoRepository, PlanilhaService planilhaService, AnaliseRepository analiseRepository){
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.planilhaService = planilhaService;
        this.analiseRepository = analiseRepository;
    }

    public BoolQueryBuilder getBoolQueryBuilder(String idSistema, String idEquipeResponsavel) {
        BoolQueryBuilder qb = QueryBuilders.boolQuery();
        bindFilterSearch(idSistema, idEquipeResponsavel, qb);
        return qb;
    }

    public void bindFilterSearch(String idSistema, String idEquipeResponsavel, BoolQueryBuilder qb) {
        mustTermQuery(idEquipeResponsavel, qb, "equipeResponsavelId");
        mustTermQuery(idSistema, qb, "idsistema");
    }

    public ResponseEntity<byte[]> exportarExcel(BaseLineSintetico baseLineSintetico, List<BaseLineAnaliticoFD> baseLineAnaliticoFD, List<BaseLineAnaliticoFT> baseLineAnaliticoFT, Long modelo) throws IOException {
        Analise analise = analiseRepository.findBySistemaAndEquipe(baseLineSintetico.getEquipeResponsavelId(), baseLineSintetico.getIdsistema() ).get(0);
        analise.setIdentificadorAnalise("Baseline "+baseLineSintetico.getNome());
        analise.setFronteiras(null);
        analise.setEscopo(null);
        analise.setPropositoContagem(null);
        analise.setObservacoes(null);
        analise.setNumeroOs(null);

        List<FuncaoDados> fds = new ArrayList<>();
        List<FuncaoTransacao> fts = new ArrayList<>();
        for (BaseLineAnaliticoFD blFD : baseLineAnaliticoFD) {
            FuncaoDados fd = funcaoDadosRepository.findById(blFD.getIdfuncaodados());
            fds.add(fd);
        }

        for (BaseLineAnaliticoFT blFT : baseLineAnaliticoFT) {
            FuncaoTransacao ft = funcaoTransacaoRepository.findOne(blFT.getIdfuncaodados());
            fts.add(ft);
        }

        analise.setFuncaoDados(fds.stream().collect(Collectors.toSet()));
        analise.setFuncaoTransacaos(fts.stream().collect(Collectors.toSet()));
        ByteArrayOutputStream byteArrayOutputStream = planilhaService.selecionarModelo(analise, modelo);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=%s.xlsx", RelatorioUtil.pegarNomeRelatorio(analise)));
        return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(),headers, HttpStatus.OK);
    }
}
