package br.com.basis.abaco.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import static java.util.Collections.unmodifiableList;


@Service
@Transactional
public class ElasticSearchIndexService {

    private static final Lock reindexLock = new ReentrantLock();
    private final List<Indexador> indexadores;
    private Map<String, Indexador> indexadoresPorCodigo;

    public ElasticSearchIndexService(List<Indexador> indexadores) {
        this.indexadores = unmodifiableList(indexadores);
    }

    public void reindexar(List<String> codigos) {
        if (reindexLock.tryLock()) {
            try {
                codigos.forEach(c -> {
                    indexadoresPorCodigo.get(c).indexar();
                });
            } finally {
                reindexLock.unlock();
            }
        }
    }

    @PostConstruct
    public void inicializaIndexadoresPorCodigo() {
        indexadoresPorCodigo = new HashMap<>();
        indexadores.forEach(i -> indexadoresPorCodigo.put(i.getCodigo(), i));
    }
}
