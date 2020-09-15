package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Nomenclatura;
import br.com.basis.abaco.repository.NomenclaturaRepository;
import br.com.basis.abaco.repository.search.NomenclaturaSearchRepository;
import br.com.basis.abaco.service.dto.NomenclaturaDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NomenclaturaService {

    @Autowired
    private NomenclaturaSearchRepository  nomenclaturaSearchRepository;

    @Autowired
    private NomenclaturaRepository nomenclaturaRepository;

    @Transactional
    public NomenclaturaDTO save(NomenclaturaDTO nomenclaturaDTO) {
        Nomenclatura nomenclatura = convertToEntity(nomenclaturaDTO);
        Nomenclatura result = nomenclaturaRepository.save(nomenclatura);
        nomenclaturaSearchRepository.save(result);
        return convertToDto(nomenclatura);
    }


    public NomenclaturaDTO convertToDto(Nomenclatura nomenclatura) {
        return new ModelMapper().map(nomenclatura, NomenclaturaDTO.class);
    }

    public Nomenclatura convertToEntity(NomenclaturaDTO nomenclaturaDTO) {
        return new ModelMapper().map(nomenclaturaDTO, Nomenclatura.class);
    }

    public Nomenclatura setEntityToElatischSearch(Nomenclatura nomenclatura){
        return convertToEntity(convertToDto(nomenclatura));
    }
    public List<NomenclaturaDTO> convert(List<Nomenclatura> lstStatus) {
        return lstStatus.stream().map(this::convertToDto)
            .collect(Collectors.toList());
    }
}
