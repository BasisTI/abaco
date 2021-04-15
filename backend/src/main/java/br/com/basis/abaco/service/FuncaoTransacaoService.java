package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
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
public class FuncaoTransacaoService {

    private final FuncaoTransacaoRepository funcaoTransacaoRepository;
    private final UploadedFilesRepository filesRepository;


    public FuncaoTransacaoService(FuncaoTransacaoRepository funcaoTransacaoRepository, UploadedFilesRepository filesRepository) {
        this.funcaoTransacaoRepository = funcaoTransacaoRepository;
        this.filesRepository = filesRepository;
    }

    public List<UploadedFile> uploadFiles(List<MultipartFile> files, FuncaoTransacao funcaoTransacao){
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

                if(!funcaoTransacao.getFiles().contains(uploadedFile)){
                    filesRepository.save(uploadedFile);
                }
            }
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new UploadException("Erro ao efetuar o upload do arquivo", e);
        }
        return uploadedFiles;
    }

}
