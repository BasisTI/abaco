package br.com.basis.abaco.service.mapper.filtro;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.dto.filtro.FaseFiltroDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FaseFiltroMapper {

    FaseFiltroDTO toFiltroDTO(Fase fase);

    Fase toEntity(FaseFiltroDTO filtro);
}
