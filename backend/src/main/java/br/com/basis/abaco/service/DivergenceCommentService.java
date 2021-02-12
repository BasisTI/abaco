package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.DivergenceCommentFuncaoDados;
import br.com.basis.abaco.domain.DivergenceCommentFuncaoTransacao;
import br.com.basis.abaco.repository.DivergenceCommentFuncaoDadosRepository;
import br.com.basis.abaco.repository.DivergenceCommentFuncaoTransacaoRepository;
import br.com.basis.abaco.service.dto.DivergenceCommentDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DivergenceCommentService {

    private final DivergenceCommentFuncaoDadosRepository divergenceCommentFuncaoDadosRepository;
    private final DivergenceCommentFuncaoTransacaoRepository divergenceCommentFuncaoTransacaoRepository;

    public DivergenceCommentService(DivergenceCommentFuncaoDadosRepository divergenceCommentFuncaoDadosRepository,
                                    DivergenceCommentFuncaoTransacaoRepository divergenceCommentFuncaoTransacaoRepository) {
        this.divergenceCommentFuncaoDadosRepository = divergenceCommentFuncaoDadosRepository;
        this.divergenceCommentFuncaoTransacaoRepository = divergenceCommentFuncaoTransacaoRepository;
    }

    @Transactional
    public DivergenceCommentDTO saveCommentFuncaoDados(DivergenceCommentFuncaoDados divergenceCommentFuncaoDados) {
        DivergenceCommentFuncaoDados result = divergenceCommentFuncaoDadosRepository.save(divergenceCommentFuncaoDados);
        return convertToDto(result);
    }

    @Transactional
    public DivergenceCommentDTO saveFuncaoTransacao(DivergenceCommentFuncaoTransacao divergenceCommentFuncaoTransacao) {
        DivergenceCommentFuncaoTransacao result = divergenceCommentFuncaoTransacaoRepository.save(divergenceCommentFuncaoTransacao);
        return convertToDto(result);
    }

    public DivergenceCommentDTO convertToDto(DivergenceCommentFuncaoDados divergenceCommentFuncaoDados) {
        return new ModelMapper().map(divergenceCommentFuncaoDados, DivergenceCommentDTO.class);
    }

    public DivergenceCommentDTO convertToDto(DivergenceCommentFuncaoTransacao divergenceCommentFuncaoTransacao) {
        return new ModelMapper().map(divergenceCommentFuncaoTransacao, DivergenceCommentDTO.class);
    }

    public DivergenceCommentFuncaoDados convertToEntityFuncaoDados(DivergenceCommentDTO divergenceCommentDTO) {
        return new ModelMapper().map(divergenceCommentDTO, DivergenceCommentFuncaoDados.class);
    }

    public DivergenceCommentFuncaoTransacao convertToEntityFuncaoTransacao(DivergenceCommentDTO divergenceCommentDTO) {
        return new ModelMapper().map(divergenceCommentDTO, DivergenceCommentFuncaoTransacao.class);
    }

    public List<DivergenceCommentDTO> convertFuncaoDados(List<DivergenceCommentFuncaoDados> lstDivergenceCommentFuncaoDados) {
        return lstDivergenceCommentFuncaoDados.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<DivergenceCommentDTO> convertFuncaoTransacao(List<DivergenceCommentFuncaoTransacao> lstDivergenceCommentFuncaoTransacaos) {
        return lstDivergenceCommentFuncaoTransacaos.stream().map(this::convertToDto).collect(Collectors.toList());
    }
}
