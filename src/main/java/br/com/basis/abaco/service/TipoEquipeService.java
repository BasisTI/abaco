package br.com.basis.abaco.service;

import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TipoEquipeService {

    private final TipoEquipeRepository tipoEquipeRepository;

    public TipoEquipeService(TipoEquipeRepository tipoEquipeRepository) {
        this.tipoEquipeRepository = tipoEquipeRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getTipoEquipeDropdown() {
        return tipoEquipeRepository.getTipoEquipeDropdown();
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findActiveUserTipoEquipes() {
        return tipoEquipeRepository.findActiveUserTipoEquipes(SecurityUtils.getCurrentUserLogin());
    }

}
