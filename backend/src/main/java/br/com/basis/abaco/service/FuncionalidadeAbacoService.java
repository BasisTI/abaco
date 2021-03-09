package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.FuncionalidadeAbaco;
import br.com.basis.abaco.repository.FuncionalidadeAbacoRepository;
import br.com.basis.abaco.service.dto.FuncionalidadeAbacoDTO;
import br.com.basis.abaco.service.mapper.FuncionalidadeAbacoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link FuncionalidadeAbaco}.
 */
@Service
@Transactional
public class FuncionalidadeAbacoService {

    private final Logger log = LoggerFactory.getLogger(FuncionalidadeAbacoService.class);

    private final FuncionalidadeAbacoRepository funcionalidadeAbacoRepository;

    private final FuncionalidadeAbacoMapper funcionalidadeAbacoMapper;

    public FuncionalidadeAbacoService(FuncionalidadeAbacoRepository funcionalidadeAbacoRepository, FuncionalidadeAbacoMapper funcionalidadeAbacoMapper) {
        this.funcionalidadeAbacoRepository = funcionalidadeAbacoRepository;
        this.funcionalidadeAbacoMapper = funcionalidadeAbacoMapper;
    }

    /**
     * Save a funcionalidadeAbaco.
     *
     * @param funcionalidadeAbacoDTO the entity to save.
     * @return the persisted entity.
     */
    public FuncionalidadeAbacoDTO save(FuncionalidadeAbacoDTO funcionalidadeAbacoDTO) {
        log.debug("Request to save FuncionalidadeAbaco : {}", funcionalidadeAbacoDTO);
        FuncionalidadeAbaco funcionalidadeAbaco = funcionalidadeAbacoMapper.toEntity(funcionalidadeAbacoDTO);
        funcionalidadeAbaco = funcionalidadeAbacoRepository.save(funcionalidadeAbaco);
        return funcionalidadeAbacoMapper.toDto(funcionalidadeAbaco);
    }

    /**
     * Get all the funcionalidadeAbacos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FuncionalidadeAbacoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all FuncionalidadeAbacos");
        return funcionalidadeAbacoRepository.findAll(pageable)
            .map(funcionalidadeAbacoMapper::toDto);
    }


    /**
     * Get one funcionalidadeAbaco by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FuncionalidadeAbacoDTO> findOne(Long id) {
        log.debug("Request to get FuncionalidadeAbaco : {}", id);
        return funcionalidadeAbacoRepository.findById(id)
            .map(funcionalidadeAbacoMapper::toDto);
    }

    /**
     * Get one funcionalidadeAbaco by sigla.
     *
     * @param sigla the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FuncionalidadeAbaco> findOneBySigla(String sigla) {
        log.debug("Request to get FuncionalidadeAbaco : {}", sigla);
        return funcionalidadeAbacoRepository.findBySigla(sigla);
    }

    /**
     * Delete the funcionalidadeAbaco by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete FuncionalidadeAbaco : {}", id);
        funcionalidadeAbacoRepository.delete(id);
    }
}
