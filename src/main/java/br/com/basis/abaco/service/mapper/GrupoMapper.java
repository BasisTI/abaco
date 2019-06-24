package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.Grupo;
import br.com.basis.abaco.service.dto.GrupoDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {})
public interface GrupoMapper {

    GrupoDTO grupoToGrupoDTO(Grupo grupo);

    List<GrupoDTO> gruposToGrupoDTOs(List<Grupo> grupos);

    Grupo grupoDTOToGrupo(GrupoDTO grupoDTO);

    List<Grupo> gruposDTOsToGrupos(List<GrupoDTO> grupoDTOs);

}
