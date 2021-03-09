package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.PEAnalitico;
import br.com.basis.abaco.repository.PEAnaliticoRepository;
import br.com.basis.abaco.service.PEAnaliticoService;
import br.com.basis.abaco.service.dto.DropdownFuncaoDadosDTO;
import br.com.basis.abaco.service.dto.PEAnaliticoDTO;
import com.codahale.metrics.annotation.Timed;
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
    private final PEAnaliticoService peAnaliticoService;
    private final static String FUNCAO_DADOS = "fd";


    public PEAnaliticoResource(PEAnaliticoRepository peAnaliticoRepository, PEAnaliticoService peAnaliticoService) {
        this.peAnaliticoRepository = peAnaliticoRepository;
        this.peAnaliticoService = peAnaliticoService;
    }

    @GetMapping("/peanalitico/{tipo}")
    @Timed
    public Set<DropdownFuncaoDadosDTO> getFuncaoBySistemaAndModuloAndFuncionalidade(@PathVariable String tipo, @RequestParam Long idFuncionalidade, @RequestParam String name) {
        Set<PEAnalitico> peAnaliticoSet = peAnaliticoRepository.findByIdFuncionalidadeAndTipoAndNameContainingIgnoreCaseOrderByName(idFuncionalidade, tipo, name);
        return peAnaliticoSet.stream().map(this::convertToDto).collect(Collectors.toSet());
    }

    @GetMapping("/peanalitico/drop-down/{id}")
    @Timed
    public Set<DropdownFuncaoDadosDTO> getFuncaoDadosByAnalise(@PathVariable Long id) {
        Set<PEAnalitico> peAnaliticos = peAnaliticoRepository.findAllByidsistemaAndTipoOrderByName(id, FUNCAO_DADOS);
        return peAnaliticos.stream().map(this::convertToDto).collect(Collectors.toSet());
    }

    @GetMapping("/peanalitico/funcaoTransacao/{idSistema}")
    @Timed
    public Set<PEAnaliticoDTO> getFuncaoTransacaoByModuloOrFuncionalidade(@RequestParam(required = false) Long idModulo, @RequestParam(required = false) Long idFuncionalidade, @RequestParam(required = false) String name, @PathVariable(required = false) Long idSistema) {
        return this.peAnaliticoService.getPeAnaliticoDTOS(idModulo, idFuncionalidade, name, idSistema, "ft");
    }

    @GetMapping("/peanalitico/funcaoDados/{idSistema}")
    @Timed
    public Set<PEAnaliticoDTO> getFuncaoDadosyModuloOrFuncionalidade(@RequestParam(required = false) Long idModulo, @RequestParam(required = false) Long idFuncionalidade, @RequestParam(required = false) String name, @PathVariable(required = false) Long idSistema) {
        return this.peAnaliticoService.getPeAnaliticoDTOS(idModulo, idFuncionalidade, name, idSistema, "fd");
    }

    private DropdownFuncaoDadosDTO convertToDto(PEAnalitico peAnalitico) {
        return new DropdownFuncaoDadosDTO(peAnalitico.getIdfuncaodados(), peAnalitico.getName());
    }
}
