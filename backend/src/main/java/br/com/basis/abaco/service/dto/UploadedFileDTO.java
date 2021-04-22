package br.com.basis.abaco.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadedFileDTO {

    private Long id;

    private byte[] logo;

    private String originalName;

    private String filename;

    private Date dateOf;

    private Integer sizeOf;
}
