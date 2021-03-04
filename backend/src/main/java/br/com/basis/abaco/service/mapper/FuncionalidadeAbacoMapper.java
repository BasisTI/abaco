package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.FuncionalidadeAbaco;
import br.com.basis.abaco.service.dto.FuncionalidadeAbacoDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link FuncionalidadeAbaco} and its DTO {@link FuncionalidadeAbacoDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FuncionalidadeAbacoMapper extends EntityMapper<FuncionalidadeAbacoDTO, FuncionalidadeAbaco> {



    default FuncionalidadeAbaco fromId(Long id) {
        if (id == null) {
            return null;
        }
        FuncionalidadeAbaco funcionalidadeAbaco = new FuncionalidadeAbaco();
        funcionalidadeAbaco.setId(id);
        return funcionalidadeAbaco;
    }
}
