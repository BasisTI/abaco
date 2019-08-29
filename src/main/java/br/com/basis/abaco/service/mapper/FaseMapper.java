package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.novo.Fase;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.dropdown.FaseDropdownDTO;
import br.com.basis.abaco.service.dto.filter.FaseFiltroDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FaseMapper {

    Fase toEntity(FaseDTO dto);

    FaseDTO toDto(Fase entity);

    FaseFiltroDTO toFiltroDTO(Fase fase);

    Fase toEntity(FaseFiltroDTO filtro);
    
    Fase toEntity(FaseDropdownDTO dropdownDTO);
    
    FaseDropdownDTO toDropdown(Fase fase);
}
