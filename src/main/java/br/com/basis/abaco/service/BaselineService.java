package br.com.basis.abaco.service;

import br.com.basis.abaco.config.IndexadorConfiguration;
import br.com.basis.abaco.domain.enumeration.IndexadoresUtil;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@EnableScheduling
public class BaselineService {
    private static final String TIME_ZONE = "America/Sao_Paulo";

    private final ElasticSearchIndexService elasticSearchIndexService;
    private final IndexadorConfiguration indexadorConfiguration;

    public BaselineService(ElasticSearchIndexService elasticSearchIndexService, IndexadorConfiguration indexadorConfiguration ) {
        this.elasticSearchIndexService = elasticSearchIndexService;
        this.indexadorConfiguration = indexadorConfiguration;
    }

    @Scheduled(cron = "0 2 * * *", zone = TIME_ZONE)
    public void atualizarBaseline(){
        List<String> indexBaseline =  new ArrayList();
        indexBaseline.add(IndexadoresUtil.BASE_LINE_ANALITICO.toString());
        indexBaseline.add(IndexadoresUtil.BASE_LINE_SINTETICO.toString());
        this.elasticSearchIndexService.reindexar(indexBaseline);
    }
}
