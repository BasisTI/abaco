package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.service.EntityMapper;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class AnaliseMapper implements EntityMapper<AnaliseDTO, Analise> {

    private ModelMapper modelMapper = new ModelMapper();

    @Override
    public Analise toEntity(AnaliseDTO dto) {
        Analise analise = modelMapper.map(dto, Analise.class);
        return analise;
    }

    @Override
    public AnaliseDTO toDto(Analise entity) {
        AnaliseDTO analiseDTO = modelMapper.map(entity, AnaliseDTO.class);
        return analiseDTO;
    }

    @Override
    public List<Analise> toEntity(List<AnaliseDTO> dtoList) {
        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnaliseDTO> toDto(List<Analise> entityList) {
        return entityList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
