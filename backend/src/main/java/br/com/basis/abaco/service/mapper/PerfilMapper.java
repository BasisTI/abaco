package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Perfil;
import br.com.basis.abaco.service.dto.PerfilDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link Perfil} and its DTO {@link PerfilDTO}.
 */
@Mapper(componentModel = "spring")
public interface PerfilMapper extends EntityMapper<PerfilDTO, Perfil> {



    default Perfil fromId(Long id) {
        if (id == null) {
            return null;
        }
        Perfil perfil = new Perfil();
        perfil.setId(id);
        return perfil;
    }
}
