package br.com.basis.abaco.web.rest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Optional;

import javax.servlet.ServletContext;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.common.net.HttpHeaders;

import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.web.rest.errors.UploadException;
import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class UploadController {
	
	
    //Save the uploaded file to this folder
    private static String UPLOADED_FOLDER = "/uploaded";

    private final Logger log = LoggerFactory.getLogger(UploadController.class);

    @Autowired
    private ServletContext servletContext;

    @Autowired
    private UploadedFilesRepository filesRepository;

    @PostMapping("/upload")
    public ResponseEntity<UploadedFile> singleFileUpload(@RequestParam("file") MultipartFile file,
                                                         RedirectAttributes redirectAttributes) {

        UploadedFile uploadedFile = new UploadedFile();
        try {
            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            String folderPath = this.servletContext.getRealPath(UPLOADED_FOLDER);
            File directory = new File(folderPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            byte[] bytesFileName = (file.getOriginalFilename() + String.valueOf(System.currentTimeMillis())).getBytes("UTF-8");
            String filename = DatatypeConverter.printHexBinary(MessageDigest.getInstance("MD5").digest(bytesFileName));
            String ext = FilenameUtils.getExtension(file.getOriginalFilename());
            filename += "." + ext;
            Path path = Paths.get(folderPath + "/" + filename);
            System.out.println(path);
            Files.write(path, bytes);


            uploadedFile.setDateOf(new Date());
            uploadedFile.setOriginalName(file.getOriginalFilename());
            uploadedFile.setFilename(filename);
            uploadedFile.setSizeOf(bytes.length);
            filesRepository.save(uploadedFile);
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new UploadException("Erro ao efetuar o upload do arquivo", e);
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(uploadedFile));
    }

    @GetMapping("/uploadStatus")
    public String uploadStatus() {
        return "uploadStatus";
    }
    
    @GetMapping("/getFile")
    public ResponseEntity<Resource> getUploadedFile(@RequestParam Long id) throws IOException {
		
    	UploadedFile uploadedFile = filesRepository.findOne(id);
    	
    	String folderPath = this.servletContext.getRealPath(UPLOADED_FOLDER);
    	
    	Resource file = new FileSystemResource(folderPath + "/" + uploadedFile.getFilename());
    			
    	return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    	
    }
    
    @GetMapping("/getFile/info")
    public UploadedFile getFileInfo(@RequestParam Long id) {
    	UploadedFile uploadedFile = filesRepository.findOne(id);
    	
    	return uploadedFile;
    }

}
