package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.PEAnalitico;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.PEAnaliticoRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.service.dto.DropdownDTO;
import com.codahale.metrics.annotation.Timed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PEAnaliticoResource {

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final PEAnaliticoRepository peAnaliticoRepository;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;


    public PEAnaliticoResource(FuncaoTransacaoRepository funcaoTransacaoRepository, PEAnaliticoRepository peAnaliticoRepository) {
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.peAnaliticoRepository = peAnaliticoRepository;
    }

    @GetMapping("/peanalitico/drop-down/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public Set<DropdownDTO> getFuncaoDadosByAnalise(@PathVariable Long id) {
        Set<PEAnalitico> peAnaliticos = peAnaliticoRepository.findAllByidsistemaAndTipoOrderByName(id, "fd");
        return peAnaliticos.stream().map(this::convertToDto).collect(Collectors.toSet());
    }

    private DropdownDTO convertToDto(PEAnalitico peAnalitico) {
        return new DropdownDTO(peAnalitico.getIdfuncaodados(), peAnalitico.getName());
    }
}
