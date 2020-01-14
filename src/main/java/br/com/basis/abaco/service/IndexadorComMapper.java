package br.com.basis.abaco.service;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor

public class IndexadorComMapper<A, B, C extends Serializable, D> extends AbstractIndexador {

    private  JpaRepository<A, C> jpaRepository;
    private  ElasticsearchRepository<B, C> elasticsearchClassRepository;
    private  EntityMapper<D, A> classMapper;
    private  ElasticsearchTemplate elasticsearchTemplate;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public void indexar() {
        Class<B> classe = elasticsearchClassRepository.getEntityClass();
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
            List<D> dto = classMapper.toDto(all);
            List list = classMapper.toEntity(dto);
            elasticsearchClassRepository.save(list);
        }

    }

}

