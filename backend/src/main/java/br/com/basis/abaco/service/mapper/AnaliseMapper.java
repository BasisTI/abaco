package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.service.EntityMapper;
import br.com.basis.abaco.service.dto.AnaliseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

public class AnaliseMapper implements EntityMapper<AnaliseDTO, Analise> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Analise toEntity(AnaliseDTO dto) {
        return modelMapper.map(dto, Analise.class);
    }

    @Override
    public AnaliseDTO toDto(Analise entity) {
        return modelMapper.map(entity, AnaliseDTO.class);
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
