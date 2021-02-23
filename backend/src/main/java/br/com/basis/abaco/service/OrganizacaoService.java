package br.com.basis.abaco.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.repository.search.OrganizacaoSearchRepository;
import br.com.basis.abaco.security.SecurityUtils;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.OrganizacaoDropdownDTO;
import br.com.basis.dynamicexports.service.DynamicExportsService;

@Service
@Transactional
public class OrganizacaoService {

    private final OrganizacaoRepository organizacaoRepository;

    private final OrganizacaoSearchRepository organizacaoSearchRepository;

    private final DynamicExportsService dynamicExportsService;

    public OrganizacaoService(OrganizacaoRepository organizacaoRepository, OrganizacaoSearchRepository organizacaoSearchRepository, DynamicExportsService dynamicExportsService) {
        this.organizacaoRepository = organizacaoRepository;
        this.organizacaoSearchRepository = organizacaoSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
    }

    @Transactional(readOnly = true)
    public List<OrganizacaoDropdownDTO> getOrganizacaoDropdown() {
        return organizacaoRepository.getOrganizacaoDropdown();
    }

    @Transactional(readOnly = true)
    public List<OrganizacaoDropdownDTO> getOrganizacaoDropdownAtivo() {
        return organizacaoRepository.getOrganizacaoDropdownAtivo();
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> findActiveUserOrganizations() {
        return organizacaoRepository.findActiveUserOrganizations(SecurityUtils.getCurrentUserLogin());
    }
}
