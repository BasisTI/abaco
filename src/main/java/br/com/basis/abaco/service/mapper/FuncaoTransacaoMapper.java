package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.service.dto.FuncaoTransacaoDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FuncaoTransacaoMapper {

    FuncaoTransacao toEntity(FuncaoTransacaoDTO dto);

    FuncaoTransacaoDTO toDto(FuncaoTransacao entity);

}
