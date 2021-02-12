package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.service.EntityMapper;
import br.com.basis.abaco.service.dto.SistemaListDTO;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class SistemaElasticSearchMapper implements EntityMapper<SistemaListDTO, Sistema> {

    private ModelMapper modelMapper = new ModelMapper();

    @Override
    public Sistema toEntity(SistemaListDTO dto) {
        return modelMapper.map(dto, Sistema.class);
    }

    @Override
    public SistemaListDTO toDto(Sistema entity) {
        return modelMapper.map(entity, SistemaListDTO.class);
    }

    @Override
    public List<Sistema> toEntity(List<SistemaListDTO> dtoList) {
        return dtoList.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    @Override
    public List<SistemaListDTO> toDto(List<Sistema> entityList) {
        return entityList.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
}
