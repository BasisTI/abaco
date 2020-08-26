package br.com.basis.abaco.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.Serializable;
import java.util.List;

public class IndexadorSemMapper<A, B extends Serializable> extends AbstractIndexador {

    private final JpaRepository<A, B> jpaRepository;
    private final ElasticsearchRepository<A, B> elasticsearchClassRepository;
    private final ElasticsearchTemplate elasticsearchTemplate;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public IndexadorSemMapper(JpaRepository<A, B> jpaRepository, ElasticsearchRepository<A, B> elasticsearchClassRepository, ElasticsearchTemplate elasticsearchTemplate) {
        this.jpaRepository = jpaRepository;
        this.elasticsearchClassRepository = elasticsearchClassRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public void indexar() {
        Class<A> classe = elasticsearchClassRepository.getEntityClass();
        elasticsearchTemplate.deleteIndex(classe);
        try {
            elasticsearchTemplate.createIndex(classe);
        } catch (IllegalArgumentException e) {
            log.error(e.getMessage(), e);
            log.debug(e.getMessage(), e);
        }
        elasticsearchTemplate.putMapping(classe);
        if (jpaRepository.count() > 0) {
            List<A> all = jpaRepository.findAll();
            elasticsearchClassRepository.save(all);
            ;
        }
    }

}
