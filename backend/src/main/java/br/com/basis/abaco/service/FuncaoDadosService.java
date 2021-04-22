package br.com.basis.abaco.service;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.web.rest.errors.UploadException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;

@Service
@Transactional
public class FuncaoDadosService {

    private final FuncaoDadosRepository funcaoDadosRepository;
    private final UploadedFilesRepository filesRepository;


    public FuncaoDadosService(FuncaoDadosRepository funcaoDadosRepository, UploadedFilesRepository filesRepository) {
        this.funcaoDadosRepository = funcaoDadosRepository;
        this.filesRepository = filesRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getFuncaoDadosDropdown() {
        return funcaoDadosRepository.getFuncaoDadosDropdown();
    }

    public List<UploadedFile> uploadFiles(List<MultipartFile> files){
        List<UploadedFile> uploadedFiles = new ArrayList<>();
        try {
            for(MultipartFile file : files) {
                UploadedFile uploadedFile = new UploadedFile();
                byte[] bytes = file.getBytes();
                byte[] bytesFileName = (file.getOriginalFilename() + String.valueOf(System.currentTimeMillis()))
                    .getBytes("UTF-8");
                String filename = DatatypeConverter.printHexBinary(MessageDigest.getInstance("MD5").digest(bytesFileName));
                String ext = FilenameUtils.getExtension(file.getOriginalFilename());
                filename += "." + ext;
                uploadedFile.setLogo(bytes);
                uploadedFile.setDateOf(new Date());
                uploadedFile.setOriginalName(file.getOriginalFilename());
                uploadedFile.setFilename(filename);
                uploadedFile.setSizeOf(bytes.length);
                uploadedFiles.add(uploadedFile);
            }
            return uploadedFiles;
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new UploadException("Erro ao efetuar o upload do arquivo", e);
        }
    }

}
