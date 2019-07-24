package br.com.basis.abaco.service.mapper.document;

import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.repository.document.FaseDocument;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FaseDocumentMapper {

    FaseDocument toDocument(Fase fase);

    Fase toEntity(FaseDocument document);
}
