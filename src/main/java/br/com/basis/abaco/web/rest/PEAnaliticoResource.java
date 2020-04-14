package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.PEAnalitico;
import br.com.basis.abaco.repository.PEAnaliticoRepository;
import br.com.basis.abaco.security.AuthoritiesConstants;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.dto.DropdownFuncaoDadosDTO;
import com.codahale.metrics.annotation.Timed;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PEAnaliticoResource {

    private final PEAnaliticoRepository peAnaliticoRepository;

    private final String FUNCAO_DADOS = "fd";
    private final String FUNCAO_TRANSACAO = "ft";

    public PEAnaliticoResource(PEAnaliticoRepository peAnaliticoRepository) {
        this.peAnaliticoRepository = peAnaliticoRepository;
    }

    @GetMapping("/peanalitico/{tipo}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public Set<DropdownFuncaoDadosDTO> getFuncaoBySistemaAndModuloAndFuncionalidade(@PathVariable String tipo, @RequestParam Long idFuncionalidade, @RequestParam String name) {
        Set<PEAnalitico> peAnaliticoSet = peAnaliticoRepository.findByIdFuncionalidadeAndTipoAndNameContainingIgnoreCaseOrderByName(idFuncionalidade, tipo, name);
        return peAnaliticoSet.stream().map(this::convertToDto).collect(Collectors.toSet());
    }

    @GetMapping("/peanalitico/drop-down/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public Set<DropdownFuncaoDadosDTO> getFuncaoDadosByAnalise(@PathVariable Long id) {
        Set<PEAnalitico> peAnaliticos = peAnaliticoRepository.findAllByidsistemaAndTipoOrderByName(id, FUNCAO_DADOS);
        return peAnaliticos.stream().map(this::convertToDto).collect(Collectors.toSet());
    }

    @GetMapping("/peanalitico/funcaoTransacao/{idModulo}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.GESTOR, AuthoritiesConstants.ANALISTA})
    public Set<PEAnalitico> getFuncaoTransacaoByModuloOrFuncionalidade(@PathVariable Long idModulo, @RequestParam(required = false) Long idFuncionalidade) {
        Set<PEAnalitico> peAnaliticos;
        if (idFuncionalidade != null && idFuncionalidade > 0) {
            peAnaliticos = peAnaliticoRepository.findAllByIdFuncionalidadeAndTipoOrderByName(idFuncionalidade, FUNCAO_TRANSACAO);
        } else {
            peAnaliticos = peAnaliticoRepository.findAllByIdModuloAndTipoOrderByName(idModulo, FUNCAO_TRANSACAO);
        }
        return peAnaliticos;
    }

    private DropdownFuncaoDadosDTO convertToDto(PEAnalitico peAnalitico) {
        return new DropdownFuncaoDadosDTO(peAnalitico.getIdfuncaodados(), peAnalitico.getName());
    }
}
