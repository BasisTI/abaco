package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.service.EntityMapper;
import br.com.basis.abaco.service.dto.TipoEquipeDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

public class TipoEquipeMapper implements EntityMapper<TipoEquipeDTO, TipoEquipe> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public TipoEquipe toEntity(TipoEquipeDTO dto) {
        return modelMapper.map(dto, TipoEquipe.class);
    }

    @Override
    public TipoEquipeDTO toDto(TipoEquipe entity) {
        return modelMapper.map(entity, TipoEquipeDTO.class);
    }

    @Override
    public List<TipoEquipe> toEntity(List<TipoEquipeDTO> dtoList) {
        return dtoList.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    @Override
    public List<TipoEquipeDTO> toDto(List<TipoEquipe> entityList) {
        return entityList.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
}
