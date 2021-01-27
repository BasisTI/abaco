package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.web.rest.errors.UploadException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ManualService {

    private final ManualRepository manualRepository;

    private final UploadedFilesRepository filesRepository;

    public ManualService(ManualRepository manualRepository, UploadedFilesRepository filesRepository) {
        this.manualRepository = manualRepository;
        this.filesRepository = filesRepository;
    }

    public List<DropdownDTO> getManuaisDropdown() {
        return manualRepository.getManualDropdow();
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
                filesRepository.save(uploadedFile);
            }
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new UploadException("Erro ao efetuar o upload do arquivo", e);
        }
        return uploadedFiles;
    }
}
