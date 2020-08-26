package br.com.basis.abaco.repository.search;

import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.service.dto.SistemaDropdownDTO;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface SistemaSearchRepository extends ElasticsearchRepository<Sistema, Long> {


}
