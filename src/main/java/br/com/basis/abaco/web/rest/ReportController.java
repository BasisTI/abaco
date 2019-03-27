package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.utils.StringUtils;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by roman on 10/24/17.
 */

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private AnaliseRepository analiseRepository;

    public static class DetailFunctionRecord {

        private String name;
        private String module;
        private String functionality;
        private String adjFactor;
        private String classification;
        private JRBeanCollectionDataSource rlr;
        private JRBeanCollectionDataSource der;
        private String sustentation;
        private JRBeanCollectionDataSource files;
        private long type;

        public long getType() {
            return type;
        }

        public void setType(long type) {
            this.type = type;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getModule() {
            return module;
        }

        public void setModule(String module) {
            this.module = module;
        }

        public String getFunctionality() {
            return functionality;
        }

        public void setFunctionality(String functionality) {
            this.functionality = functionality;
        }

        public String getAdjFactor() {
            return adjFactor;
        }

        public void setAdjFactor(String adjFactor) {
            this.adjFactor = adjFactor;
        }

        public String getClassification() {
            return classification;
        }

        public void setClassification(String classification) {
            this.classification = classification;
        }

        public JRBeanCollectionDataSource getRlr() {
            return rlr;
        }

        public void setRlr(JRBeanCollectionDataSource rlr) {
            this.rlr = rlr;
        }

        public JRBeanCollectionDataSource getDer() {
            return der;
        }

        public void setDer(JRBeanCollectionDataSource der) {
            this.der = der;
        }

        public String getSustentation() {
            return sustentation;
        }

        public void setSustentation(String sustentation) {
            this.sustentation = sustentation;
        }

        public JRBeanCollectionDataSource getFiles() {
            return files;
        }

        public void setFiles(JRBeanCollectionDataSource files) {
            this.files = files;
        }
    }

    public static class StringRecord {

        private String value;
        private long type;

        public String getValue() {
            return value;
        }

        public StringRecord() {

        }

        public StringRecord(String value, long type) {
            this.value = value;
            this.type = type;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public long getType() {
            return type;
        }

        public void setType(long type) {
            this.type = type;
        }
    }

    public static class FileRecord {

        private String name;
        private String size;
        private String format;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public String getFormat() {
            return format;
        }

        public void setFormat(String format) {
            this.format = format;
        }
    }

    public static class FunctionRecord {

        private String name;
        private String adjFactor;
        private String module;
        private String functionality;
        private String classification;
        private String rlr;
        private String der;
        private String complexcity;
        private BigDecimal grossFp;
        private BigDecimal netFp;
        private BigDecimal adjValue;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAdjFactor() {
            return adjFactor;
        }

        public void setAdjFactor(String adjFactor) {
            this.adjFactor = adjFactor;
        }

        public String getModule() {
            return module;
        }

        public void setModule(String module) {
            this.module = module;
        }

        public String getFunctionality() {
            return functionality;
        }

        public void setFunctionality(String functionality) {
            this.functionality = functionality;
        }

        public String getClassification() {
            return classification;
        }

        public void setClassification(String classification) {
            this.classification = classification;
        }

        public String getRlr() {
            return rlr;
        }

        public void setRlr(String rlr) {
            this.rlr = rlr;
        }

        public String getDer() {
            return der;
        }

        public void setDer(String der) {
            this.der = der;
        }

        public String getComplexcity() {
            return complexcity;
        }

        public void setComplexcity(String complexcity) {
            this.complexcity = complexcity;
        }

        public BigDecimal getGrossFp() {
            return grossFp;
        }

        public void setGrossFp(BigDecimal grossFp) {
            this.grossFp = grossFp;
        }

        public BigDecimal getNetFp() {
            return netFp;
        }

        public void setNetFp(BigDecimal netFp) {
            this.netFp = netFp;
        }

        public BigDecimal getAdjValue() {
            return adjValue;
        }

        public void setAdjValue(BigDecimal adjValue) {
            this.adjValue = adjValue;
        }
    }

    public static class TotalRecord {

        private String title;
        private int none = 0;
        private int low = 0;
        private int average = 0;
        private int high = 0;
        private int total = 0;
        private BigDecimal netFp = BigDecimal.ZERO;
        private BigDecimal grossFp = BigDecimal.ZERO;

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }

        public TotalRecord(String title) {
            this.title = title;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getNone() {
            return none;
        }

        public void setNone(int none) {
            this.none = none;
        }

        public int getLow() {
            return low;
        }

        public void setLow(int low) {
            this.low = low;
        }

        public int getAverage() {
            return average;
        }

        public void setAverage(int average) {
            this.average = average;
        }

        public int getHigh() {
            return high;
        }

        public void setHigh(int high) {
            this.high = high;
        }

        public BigDecimal getNetFp() {
            return netFp;
        }

        public void setNetFp(BigDecimal netFp) {
            this.netFp = netFp;
        }

        public BigDecimal getGrossFp() {
            return grossFp;
        }

        public void setGrossFp(BigDecimal grossFp) {
            this.grossFp = grossFp;
        }
    }

    private List<DetailFunctionRecord> convertDataFunctions(Analise analise) {
        List<DetailFunctionRecord> list = new ArrayList<>();
        Set<FuncaoDados> funcaoDados = analise.getFuncaoDados();
        if (funcaoDados != null) {
            verificaFuncaoDados(list, funcaoDados);
        }

        return list;
    }

    private void verificaFuncaoDados(List<DetailFunctionRecord> list, Set<FuncaoDados> funcaoDados) {
        for (FuncaoDados f : funcaoDados) {
            DetailFunctionRecord record = getDetailFunctionRecord(f);
            List<StringRecord> relList = criaRelList(f);
            record.setRlr(new JRBeanCollectionDataSource(relList));
            List<StringRecord> derList = criaDerList(f);
            record.setDer(new JRBeanCollectionDataSource(derList));
            List<FileRecord> files = new ArrayList<>();
            List<UploadedFile> filesData = f.getFiles();
            verificaDadoDeArquivo((List<FileRecord>) files, filesData);
            record.setFiles(new JRBeanCollectionDataSource(files));
            list.add(record);
        }
    }

    private List<StringRecord> criaDerList(FuncaoDados f) {
        List<StringRecord> derList = new ArrayList<>();
        verificaRetStr(derList, f.getDetStr(), 0);
        if (derList.size()==0) {
            derList.add(new StringRecord("0",0));
        }
        return derList;
    }

    private List<StringRecord> criaRelList(FuncaoDados f) {
        List<StringRecord> relList = new ArrayList<>();
        verificaRetStr((List<StringRecord>) relList, f.getRetStr(), 0);
        if (relList.size()==0) {
            relList.add(new StringRecord("0",0));
        }
        return relList;
    }

    private void verificaDadoDeArquivo(List<FileRecord> files, List<UploadedFile> filesData) {
        if (filesData != null) {
            for (UploadedFile uploadedFile : filesData) {
                FileRecord file = new FileRecord();
                file.setName(uploadedFile.getFilename());
                file.setSize(FileUtils.byteCountToDisplaySize(uploadedFile.getSizeOf()));
                file.setFormat(StringUtils.getFormatFile(uploadedFile.getFilename()));
                files.add(file);
            }
        }
    }

    private void verificaRetStr(List<StringRecord> relList, String retStr, int i) {
        if (retStr != null && !retStr.isEmpty()) {
            for (String row : retStr.split("\n")) {
                relList.add(new StringRecord(row, i));
            }
        }
    }

    private DetailFunctionRecord getDetailFunctionRecord(FuncaoDados f) {
        DetailFunctionRecord record = new DetailFunctionRecord();
        record.setName(f.getName());
        record.setModule((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getModulo().getNome());
        record.setAdjFactor((f.getFatorAjuste()==null)?"":f.getFatorAjuste().getNome());
        record.setFunctionality((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getNome());
        record.setClassification((f.getComplexidade()==null)?"":f.getComplexidade().toString());
        record.setSustentation((f.getSustantation()==null)?"":f.getSustantation());
        record.setType(0);
        return record;
    }

    private List<DetailFunctionRecord> convertTranFunctions(Analise analise) {
        List<DetailFunctionRecord> list = new ArrayList<>();
        for(FuncaoTransacao f:analise.getFuncaoTransacaos()) {
            DetailFunctionRecord record = new DetailFunctionRecord();
            setRecord(f, record);
            realizarVerificacoes(list, f, record);
        }
        return list;
    }

    private void realizarVerificacoes(List<DetailFunctionRecord> list, FuncaoTransacao f, DetailFunctionRecord record) {
        List<StringRecord> relList = new ArrayList<>();
        verificaFtrStr((List<StringRecord>) relList, f.getFtrStr(), 1);
        if (relList.size()==0) {
            relList.add(new StringRecord("0",0));
        }
        record.setRlr(new JRBeanCollectionDataSource(relList));
        List<StringRecord> derList = new ArrayList<>();
        verificaDetStr((List<StringRecord>) derList, f.getDetStr(), 1);
        if (derList.size()==0) {
            derList.add(new StringRecord("0",0));
        }
        record.setDer(new JRBeanCollectionDataSource(derList));
        List<FileRecord> files = new ArrayList<>();
        List<UploadedFile> filesTran = f.getFiles();
        verificaArquivos((List<FileRecord>) files, filesTran);
        record.setFiles(new JRBeanCollectionDataSource(files));
        list.add(record);
    }

    private void verificaArquivos(List<FileRecord> files, List<UploadedFile> filesTran) {
        if (filesTran != null) {
            for (UploadedFile uploadedFile : filesTran) {
                FileRecord file = new FileRecord();
                file.setName(uploadedFile.getFilename());
                file.setSize(FileUtils.byteCountToDisplaySize(uploadedFile.getSizeOf()));
                file.setFormat(StringUtils.getFormatFile(uploadedFile.getFilename()));
                files.add(file);
            }
        }
    }

    private void verificaDetStr(List<StringRecord> derList, String detStr, int i) {
        if (detStr != null && !detStr.isEmpty()) {
            for (String row : detStr.split("\n")) {
                derList.add(new StringRecord(row, i));
            }
        }
    }

    private void verificaFtrStr(List<StringRecord> relList, String ftrStr, int i) {
        if (ftrStr != null && !ftrStr.isEmpty()) {
            for (String row : ftrStr.split("\n")) {
                relList.add(new StringRecord(row, i));
            }
        }
    }

    private void setRecord(FuncaoTransacao f, DetailFunctionRecord record) {
        record.setName(f.getName());
        record.setModule((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getModulo().getNome());
        record.setAdjFactor((f.getFatorAjuste()==null)?"":f.getFatorAjuste().getNome());
        record.setFunctionality((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getNome());
        record.setClassification((f.getComplexidade()==null)?"":f.getComplexidade().toString());
        record.setSustentation((f.getSustantation()==null)?"":f.getSustantation());
        record.setType(1);
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    @GetMapping("/analiseReport/detailed/{id}")
    public ResponseEntity<byte[]> createDetailedReport(@PathVariable long id) throws FileNotFoundException, JRException {
        Analise analise = this.analiseRepository.findOne(id);
        Map params = criaparams(analise);
        List<DetailFunctionRecord> data = this.convertDataFunctions(analise);
        data.addAll(this.convertTranFunctions(analise));
        JRDataSource dataSource = new JRBeanCollectionDataSource(data);
        File jasperFile = new File(getClass().getClassLoader().getResource("reports/detailed_analise_report.jasper").getFile());
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile),params, dataSource);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        return new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
    }

    private Map criaparams(Analise analise) {
        Map params = new HashMap();
        params.put("Organization",analise.getOrganizacao()==null?"Organization":analise.getOrganizacao().getNome());
        params.put("OS",analise.getNumeroOs());
        params.put("System",analise.getSistema().getNome());
        params.put("fp",analise.getPfTotal());
        params.put("createDate",analise.getAudit().getCreatedOn());
        params.put("updateDate",analise.getAudit().getUpdatedOn());
        return params;
    }

}
