package br.com.basis.abaco.service;

import br.com.basis.abaco.config.IndexadorConfiguration;
import br.com.basis.abaco.domain.enumeration.IndexadoresUtil;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BaselineService {

    private final ElasticSearchIndexService elasticSearchIndexService;
    private final IndexadorConfiguration indexadorConfiguration;

    public BaselineService(ElasticSearchIndexService elasticSearchIndexService, IndexadorConfiguration indexadorConfiguration ) {
        this.elasticSearchIndexService = elasticSearchIndexService;
        this.indexadorConfiguration = indexadorConfiguration;
    }

    @Scheduled(cron = "0 0 0 * * *" )
    public void atualizarBaseline(){
        List<String> indexBaseline =  new ArrayList();
        indexBaseline.add(IndexadoresUtil.BASE_LINE_ANALITICO_FD.toString());
        indexBaseline.add(IndexadoresUtil.BASE_LINE_ANALITICO_FT.toString());
        indexBaseline.add(IndexadoresUtil.BASE_LINE_SINTETICO.toString());
        this.elasticSearchIndexService.reindexar(indexBaseline);
    }
}
