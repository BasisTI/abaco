package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.service.ElasticSearchIndexService;
import br.com.basis.abaco.service.ElasticsearchIndexService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for managing Elasticsearch index.
 */
@RestController
@RequestMapping("/api")
public class ElasticsearchIndexResource {


    private ElasticSearchIndexService elasticSearchIndexService;
    private ElasticsearchIndexService elasticsearchIndexService;

    public ElasticsearchIndexResource(ElasticSearchIndexService elasticSearchIndexService, ElasticsearchIndexService elasticsearchIndexService) {
        this.elasticSearchIndexService = elasticSearchIndexService;
        this.elasticsearchIndexService = elasticsearchIndexService;
    }

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexResource.class);

    @GetMapping("/reindexar")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> reindexar(@RequestParam List<String> lstIndexadores) {
        this.elasticSearchIndexService.reindexar(lstIndexadores);
        return ResponseEntity.ok(null);
    }


}
