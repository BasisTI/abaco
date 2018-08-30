package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Service class for managing Funcao Dados.
 */
@Service
@Transactional
public class FuncaoDadosService {


    private final FuncaoDadosRepository funcaoDadosRepository;

    public FuncaoDadosService(FuncaoDadosRepository funcaoDadosRepository) {
        this.funcaoDadosRepository = funcaoDadosRepository;
    }

	private final Logger log = LoggerFactory.getLogger(FuncaoDadosService.class);


	public List<FuncaoDados> listFuncaoDadosAnaliticos(List<BaseLineAnalitico> baseLineAnaliticos){

	    List<FuncaoDados> funcaoDados = new ArrayList<>();

        for(BaseLineAnalitico baseLineAnalitico : baseLineAnaliticos){
            FuncaoDados fd = funcaoDadosRepository.getOne(baseLineAnalitico.getIdfuncaodados());
            if(!funcaoDados.contains(fd)){
                funcaoDados.add(fd);
            }
        }

	    return funcaoDados;
    }

}

