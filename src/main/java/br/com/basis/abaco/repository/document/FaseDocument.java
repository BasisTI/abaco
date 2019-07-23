package br.com.basis.abaco.repository.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "fase")
@Data
public class FaseDocument {
    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Field(index = FieldIndex.not_analyzed, type = FieldType.String)
    private String nome;
}
