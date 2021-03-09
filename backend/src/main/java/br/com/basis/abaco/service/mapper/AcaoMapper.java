package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Acao;
import br.com.basis.abaco.service.dto.AcaoDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link Acao} and its DTO {@link AcaoDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AcaoMapper extends EntityMapper<AcaoDTO, Acao> {



    default Acao fromId(Long id) {
        if (id == null) {
            return null;
        }
        Acao acao = new Acao();
        acao.setId(id);
        return acao;
    }



}
