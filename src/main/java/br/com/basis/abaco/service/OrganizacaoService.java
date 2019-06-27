package br.com.basis.abaco.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.service.dto.OrganizacaoDropdownDTO;

@Service
@Transactional
public class OrganizacaoService {

    private final OrganizacaoRepository organizacaoRepository;

    public OrganizacaoService(OrganizacaoRepository organizacaoRepository) {
        this.organizacaoRepository = organizacaoRepository;
    }

    @Transactional(readOnly = true)
    public List<OrganizacaoDropdownDTO> getOrganizacaoDropdown() {
        return organizacaoRepository.getOrganizacaoDropdown();
    }

}
