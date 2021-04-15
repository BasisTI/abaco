package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.web.rest.errors.UploadException;
import br.com.basis.abaco.web.rest.util.HeaderUtil;
import com.google.common.net.HttpHeaders;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.persistence.PreRemove;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UploadController {

    private final Logger log = LoggerFactory.getLogger(UploadController.class);

    @Autowired
    private UploadedFilesRepository filesRepository;

    @Autowired
    private ManualRepository manualRepository;

    @Autowired
    private FuncaoDadosRepository funcaoDadosRepository;

    @Autowired
    ServletContext context;

    private byte[] bytes;

    @PostMapping("/uploadFile")
    public ResponseEntity<String> singleFileUpload(@RequestParam("file") MultipartFile[] files,
            HttpServletRequest request, RedirectAttributes redirectAttributes) {
        try {
            for (MultipartFile obj : files) {
                UploadedFile upFile = new UploadedFile();
                byte[] bytes = obj.getBytes();

                byte[] bytesFileNames = (obj.getOriginalFilename() + String.valueOf(System.currentTimeMillis()))
                    .getBytes("UTF-8");
                String fileName = DatatypeConverter.printHexBinary(MessageDigest.getInstance("MD5").digest(bytesFileNames));
                String extension = FilenameUtils.getExtension(obj.getOriginalFilename());
                fileName += "." + extension;

                upFile.setLogo(bytes);
                upFile.setDateOf(new Date());
                upFile.setOriginalName(obj.getOriginalFilename());
                upFile.setFilename(fileName);
                upFile.setSizeOf(bytes.length);
                filesRepository.save(upFile);
            }
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new UploadException("Erro ao efetuar o upload do arquivo", e);
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "/saveFile").body("Upload dos arquivos efetuado com sucesso");
    }

    @GetMapping("/uploadStatus")
    public String uploadStatus() {
        return "uploadStatus";
    }

    @GetMapping("/getFile/{id}")
    public UploadedFile getUploadedFile(@PathVariable Long id) throws IOException {
        return filesRepository.findOne(id);
    }

    @GetMapping("/downloadFile/{id}")
    public void downloadPDFResource(HttpServletResponse response, @PathVariable Long id) throws IOException {
    byte [] arquivo = filesRepository.findOne(id).getLogo();
    response.setContentType("application/pdf");
    response.addHeader("Content-Disposition", "attachment; filename=arquivo-manual.pdf");
    response.getOutputStream().write(arquivo);
    }

    @GetMapping("/downloadImage/{id}")
    public void downloadImageResource(HttpServletResponse response, @PathVariable Long id) throws IOException {
        byte [] arquivo = filesRepository.findOne(id).getLogo();
        response.setContentType("image/*");
        response.addHeader("Content-Disposition", "attachment; filename=arquivo-evidencia.png");
        response.getOutputStream().write(arquivo);
    }

    @DeleteMapping("/deleteFile")
    public ResponseEntity<Void> deleteFile(@RequestParam("arquivoId") Long id, @RequestParam("manualId") Long manualId) {
        log.debug("REST request to delete File : {}", id);

        UploadedFile file = filesRepository.findOne(id);
        Manual manual = manualRepository.findOne(manualId);

        manual.removeArquivoManual(file);

        manualRepository.save(manual);
        filesRepository.save(file);

        if(file.getManuais().isEmpty()){
            filesRepository.delete(id);
        }

        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("UploadedFile", id.toString())).build();
    }
    @DeleteMapping("/deleteFileEvidence")
    public ResponseEntity<Void> deleteFileEvidencia(@RequestParam("fileId") Long id, @RequestParam("funcaoDadosId") Long funcaoId) {
        log.debug("REST request to delete File : {}", id);

        UploadedFile file = filesRepository.findOne(id);
        FuncaoDados funcaoDados = funcaoDadosRepository.findOne(funcaoId);

        funcaoDados.removeArquivoEvidencia(file);

        funcaoDadosRepository.save(funcaoDados);

        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("UploadedFile", funcaoDados.toString())).build();
    }

    @GetMapping("/getLogo/info/{id}")
    public UploadedFile getFileInfo(@PathVariable Long id) {
        return filesRepository.findOne(id);
    }

    @GetMapping("/getLogo/{id}")
    public UploadedFile getLogo(@PathVariable Long id) {
        return filesRepository.findOne(id);
    }

    @PostMapping("/uploadLogo")
    public ResponseEntity<UploadedFile> singleFileUpload(@RequestParam("file") MultipartFile file) throws IOException {
        this.bytes = file.getBytes();

        UploadedFile uploadedFile = new UploadedFile();

        uploadedFile.setLogo(bytes);
        uploadedFile.setDateOf(new Date());
        uploadedFile = filesRepository.save(uploadedFile);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "/saveFile").body(uploadedFile);
    }
}
