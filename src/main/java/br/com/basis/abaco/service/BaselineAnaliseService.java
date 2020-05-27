package br.com.basis.abaco.service;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Service;

@Service
public class BaselineAnaliseService extends BaseService{

    public BoolQueryBuilder getBoolQueryBuilder(String idSistema, String idEquipeResponsavel, String tipo) {
        BoolQueryBuilder qb = QueryBuilders.boolQuery();
        bindFilterSearch(idSistema, idEquipeResponsavel, tipo, qb);
        return qb;
    }

    public void bindFilterSearch(String idSistema, String idEquipeResponsavel, String tipo, BoolQueryBuilder qb) {
        mustMatchPhaseQuery(tipo, qb, "tipo");
        mustTermQuery(idEquipeResponsavel, qb, "equipeResponsavelId");
        mustTermQuery(idSistema, qb, "idsistema");
    }

}
