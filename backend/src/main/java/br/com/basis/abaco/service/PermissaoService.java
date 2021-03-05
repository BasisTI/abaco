package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Acao;
import br.com.basis.abaco.domain.FuncionalidadeAbaco;
import br.com.basis.abaco.domain.Permissao;
import br.com.basis.abaco.repository.AcaoRepository;
import br.com.basis.abaco.repository.FuncionalidadeAbacoRepository;
import br.com.basis.abaco.repository.PermissaoRepository;
import br.com.basis.abaco.service.dto.PermissaoDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Permissao}.
 */
@Service
@Transactional
public class PermissaoService {

    private final Logger log = LoggerFactory.getLogger(PermissaoService.class);

    private final PermissaoRepository permissaoRepository;

    private final AcaoRepository acaoRepository;

    private final FuncionalidadeAbacoRepository funcionalidadeAbacoRepository;

    public PermissaoService(PermissaoRepository permissaoRepository, AcaoRepository acaoRepository, FuncionalidadeAbacoRepository funcionalidadeAbacoRepository) {
        this.permissaoRepository = permissaoRepository;
        this.acaoRepository = acaoRepository;
        this.funcionalidadeAbacoRepository = funcionalidadeAbacoRepository;
    }

    /**
     * Save a permissao.
     *
     * @param permissaoDTO the entity to save.
     * @return the persisted entity.
     */
    public Permissao save(PermissaoDTO permissaoDTO) {
        log.debug("Request to save Permissao : {}", permissaoDTO);
        Permissao permissao = new Permissao();
        if(permissaoDTO.getId() != null){
            permissao.setId(permissaoDTO.getId());
        }
        Optional<Acao> acao = acaoRepository.findById(permissaoDTO.getAcaoId());
        Optional<FuncionalidadeAbaco> funcionalidadeAbaco = funcionalidadeAbacoRepository.findById(permissaoDTO.getFuncionalidadeId());

        if(acao.isPresent() && funcionalidadeAbaco.isPresent()){
            permissao.setAcao(acao.get());
            permissao.setFuncionalidadeAbaco(funcionalidadeAbaco.get());
            permissao = permissaoRepository.save(permissao);
        }
        return permissao;
    }

    /**
     * Get one permissao by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Permissao> findOne(Long id) {
        log.debug("Request to get Permissao : {}", id);
        return permissaoRepository.findById(id);
    }

    /**
     * Delete the permissao by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Permissao : {}", id);
        permissaoRepository.delete(id);
    }


}
