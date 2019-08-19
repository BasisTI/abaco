package br.com.basis.abaco.service.mapper;

import org.mapstruct.Mapper;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filtro.FaseFiltroDTO;

@Mapper(componentModel = "spring", uses = {})
public interface FaseMapper {

    Fase toEntity(FaseDTO dto);

    FaseDTO toDto(Fase entity);

    FaseFiltroDTO toFiltroDTO(Fase fase);

    Fase toEntity(FaseFiltroDTO filtro);
}
