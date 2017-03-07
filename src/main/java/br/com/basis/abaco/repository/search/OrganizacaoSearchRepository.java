package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Organizacao;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Organizacao entity.
 */
public interface OrganizacaoSearchRepository extends ElasticsearchRepository<Organizacao, Long> {
}
