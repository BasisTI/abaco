package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.service.dto.FaseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FaseMapper {

    Fase toEntity(FaseDTO dto);

    FaseDTO toDto(Fase entity);
}
