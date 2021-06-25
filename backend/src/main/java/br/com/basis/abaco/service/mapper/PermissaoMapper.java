package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.Permissao;
import br.com.basis.abaco.service.dto.PermissaoDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface PermissaoMapper {

    Permissao toEntity(PermissaoDTO dto);

    PermissaoDTO toDto(Permissao entity);

}
