package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.service.dto.FuncaoDadosDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FuncaoDadosMapper {

    FuncaoDados toEntity(FuncaoDadosDTO dto);

    FuncaoDadosDTO toDto(FuncaoDados entity);

}


