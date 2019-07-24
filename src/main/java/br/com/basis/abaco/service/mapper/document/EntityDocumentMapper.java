package br.com.basis.abaco.service.mapper.document;

import java.util.List;

public interface EntityDocumentMapper<D, E> {

    D toDocument(E entity);

    E toEntity(D document);

    List<D> toDocumentList(List<E> entityList);

    List<E> toEntityList(List<D> documentList);
}
