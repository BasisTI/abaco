package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.service.ElasticSearchIndexService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ElasticsearchIndexResource {

    private ElasticSearchIndexService elasticSearchIndexService;

    public ElasticsearchIndexResource(ElasticSearchIndexService elasticSearchIndexService) {
        this.elasticSearchIndexService = elasticSearchIndexService;
    }

    @GetMapping("/reindexar")
    public ResponseEntity<Void> reindexar(@RequestParam List<String> lstIndexadores) {
        this.elasticSearchIndexService.reindexar(lstIndexadores);
        return ResponseEntity.ok(null);
    }

}
