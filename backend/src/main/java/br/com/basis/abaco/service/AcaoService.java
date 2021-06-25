package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Acao;
import br.com.basis.abaco.repository.AcaoRepository;
import br.com.basis.abaco.service.dto.AcaoDTO;
import br.com.basis.abaco.service.mapper.AcaoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Acao}.
 */
@Service
@Transactional
public class AcaoService {

    private final Logger log = LoggerFactory.getLogger(AcaoService.class);

    private final AcaoMapper acaoMapper;

    private final AcaoRepository acaoRepository;

    public AcaoService(AcaoMapper acaoMapper, AcaoRepository acaoRepository) {
        this.acaoMapper = acaoMapper;
        this.acaoRepository = acaoRepository;
    }

    /**
     * Save a acao.
     *
     * @param acaoDTO the entity to save.
     * @return the persisted entity.
     */
    public AcaoDTO save(AcaoDTO acaoDTO) {
        log.debug("Request to save Acao : {}", acaoDTO);
        Acao acao = acaoMapper.toEntity(acaoDTO);
        acao = acaoRepository.save(acao);
        return acaoMapper.toDto(acao);
    }

    /**
     * Get all the acaos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<AcaoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Acaos");
        return acaoRepository.findAll(pageable)
            .map(acaoMapper::toDto);
    }


    /**
     * Get one acao by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<AcaoDTO> findOne(Long id) {
        log.debug("Request to get Acao : {}", id);
        return acaoRepository.findById(id)
            .map(acaoMapper::toDto);
    }

    /**
     * Get one acao by sigla.
     *
     * @param sigla the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Acao> findOneBySigla(String sigla) {
        log.debug("Request to get Acao : {}", sigla);
        return acaoRepository.findBySigla(sigla);
    }

    /**
     * Delete the acao by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Acao : {}", id);
        acaoRepository.delete(id);
    }
}
