package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.PEAnalitico;
import br.com.basis.abaco.repository.PEAnaliticoRepository;
import br.com.basis.abaco.service.dto.PEAnaliticoDTO;
import br.com.basis.abaco.utils.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PEAnaliticoService {

    private final PEAnaliticoRepository peAnaliticoRepository;

    public PEAnaliticoService(PEAnaliticoRepository peAnaliticoRepository) {
        this.peAnaliticoRepository = peAnaliticoRepository;
    }

    public PEAnalitico convertToEntity(PEAnaliticoDTO peAnaliticoDTO) {
        return new ModelMapper().map(peAnaliticoDTO, PEAnalitico.class);
    }

    public PEAnaliticoDTO convertToPEAnaliticoDTO(PEAnalitico peAnalitico) {
        return new ModelMapper().map(peAnalitico, PEAnaliticoDTO.class);
    }

    @Transactional
    public Set<PEAnaliticoDTO> getPeAnaliticoDTOS( Long idModulo, Long idFuncionalidade, String name, Long idSistema, String tipo) {
        Set<PEAnalitico> lstPeAnaliticos;
        if (idFuncionalidade != null && idFuncionalidade > 0) {
            if(StringUtils.isEmptyString(name)){
                lstPeAnaliticos = peAnaliticoRepository.findAllByIdFuncionalidadeAndTipoOrderByName(idFuncionalidade, tipo);
            } else {
                lstPeAnaliticos = peAnaliticoRepository.findAllByIdFuncionalidadeAndTipoAndNameContainsIgnoreCaseOrderByName(idFuncionalidade, tipo, name);
            }
        } else if(idModulo != null && idModulo > 0){
            if(StringUtils.isEmptyString(name)){
                lstPeAnaliticos = peAnaliticoRepository.findAllByIdModuloAndTipoOrderByName(idModulo, tipo);
            } else {
                lstPeAnaliticos = peAnaliticoRepository.findAllByIdModuloAndTipoAndNameContainsIgnoreCaseOrderByName(idModulo, tipo, name);
            }
        } else {
            if(StringUtils.isEmptyString(name)){
                lstPeAnaliticos = peAnaliticoRepository.findAllByidsistemaAndTipoOrderByName(idSistema, tipo);
            } else {
                lstPeAnaliticos = peAnaliticoRepository.findAllByidsistemaAndTipoAndNameContainsIgnoreCaseOrderByName(idSistema, tipo, name);
            }
        }
        return lstPeAnaliticos.stream().map(this::convertToPEAnaliticoDTO).collect(Collectors.toSet());
    }


}
