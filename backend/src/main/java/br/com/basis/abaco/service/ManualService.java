package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;
import br.com.basis.abaco.service.exception.RelatorioException;
import br.com.basis.abaco.service.relatorio.RelatorioManualColunas;
import br.com.basis.abaco.service.relatorio.RelatorioStatusColunas;
import br.com.basis.abaco.utils.AbacoUtil;
import br.com.basis.abaco.web.rest.errors.UploadException;
import br.com.basis.dynamicexports.service.DynamicExportsService;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@Service
@Transactional
public class ManualService {

    private final ManualRepository manualRepository;
    private final ManualSearchRepository manualSearchRepository;
    private final DynamicExportsService dynamicExportsService;

    private final UploadedFilesRepository filesRepository;

    public ManualService(ManualRepository manualRepository, ManualSearchRepository manualSearchRepository, DynamicExportsService dynamicExportsService, UploadedFilesRepository filesRepository) {
        this.manualRepository = manualRepository;
        this.manualSearchRepository = manualSearchRepository;
        this.dynamicExportsService = dynamicExportsService;
        this.filesRepository = filesRepository;
    }

    public List<DropdownDTO> getManuaisDropdown() {
        return manualRepository.getManualDropdow();
    }

    public List<UploadedFile> uploadFiles(List<MultipartFile> files, Manual manual){
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

                if(!manual.getArquivosManual().contains(uploadedFile)){
                    filesRepository.save(uploadedFile);
                }
            }
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new UploadException("Erro ao efetuar o upload do arquivo", e);
        }
        return uploadedFiles;
    }

    public ByteArrayOutputStream gerarRelatorio(String query, String tipoRelatorio) throws RelatorioException {
        ByteArrayOutputStream byteArrayOutputStream;
        try {
            new NativeSearchQueryBuilder().withQuery(multiMatchQuery(query)).build();
            Page<Manual> result = manualSearchRepository.search(queryStringQuery(query),
                dynamicExportsService.obterPageableMaximoExportacao());
            byteArrayOutputStream = dynamicExportsService.export(new RelatorioManualColunas(), result, tipoRelatorio,
                Optional.empty(), Optional.ofNullable(AbacoUtil.REPORT_LOGO_PATH),
                Optional.ofNullable(AbacoUtil.getReportFooter()));
        } catch (DRException | ClassNotFoundException | JRException | NoClassDefFoundError e) {
            throw new RelatorioException(e);
        }

        return byteArrayOutputStream;
    }
}
