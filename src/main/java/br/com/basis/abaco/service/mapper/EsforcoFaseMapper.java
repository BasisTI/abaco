package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.service.dto.EsforcoFaseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface EsforcoFaseMapper {

    EsforcoFase toEntity(EsforcoFaseDTO dto);

    EsforcoFaseDTO toDto(EsforcoFase entity);

}
