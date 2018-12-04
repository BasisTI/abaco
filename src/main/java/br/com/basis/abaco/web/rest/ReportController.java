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

/**
 * Created by roman on 10/24/17.
 */

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private AnaliseRepository analiseRepository;

    public static class DetailFunctionRecord{

        private String name;
        private String module;
        private String functionality;
        private String adj_factor;
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

        public String getAdj_factor() {
            return adj_factor;
        }

        public void setAdj_factor(String adj_factor) {
            this.adj_factor = adj_factor;
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

    public static class StringRecord{

        private String value;
        private long type;

        public String getValue() {
            return value;
        }

        public StringRecord() {

        }

        public StringRecord(String value, long type) {
            this.value=value;
            this.type=type;
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
       private String adj_factor;
       private String module;
       private String functionality;
       private String classification;
       private String rlr;
       private String der;
       private String complexcity;
       private BigDecimal gross_fp;
       private BigDecimal net_fp;
       private BigDecimal adj_value;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAdj_factor() {
            return adj_factor;
        }

        public void setAdj_factor(String adj_factor) {
            this.adj_factor = adj_factor;
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

        public BigDecimal getGross_fp() {
            return gross_fp;
        }

        public void setGross_fp(BigDecimal gross_fp) {
            this.gross_fp = gross_fp;
        }

        public BigDecimal getNet_fp() {
            return net_fp;
        }

        public void setNet_fp(BigDecimal net_fp) {
            this.net_fp = net_fp;
        }

        public BigDecimal getAdj_value() {
            return adj_value;
        }

        public void setAdj_value(BigDecimal adj_value) {
            this.adj_value = adj_value;
        }
    }

    public static class TotalRecord {

        private String title;
        private int none=0;
        private int low=0;
        private int average=0;
        private int high=0;
        private int total=0;
        private BigDecimal net_fp=BigDecimal.ZERO;
        private BigDecimal gross_fp=BigDecimal.ZERO;

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }

        public TotalRecord(String title){
            this.title=title;
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

        public BigDecimal getNet_fp() {
            return net_fp;
        }

        public void setNet_fp(BigDecimal net_fp) {
            this.net_fp = net_fp;
        }

        public BigDecimal getGross_fp() {
            return gross_fp;
        }

        public void setGross_fp(BigDecimal gross_fp) {
            this.gross_fp = gross_fp;
        }
    }

    private List<DetailFunctionRecord> convertDataFunctions(Analise analise) {
        List<DetailFunctionRecord> list = new ArrayList<>();
        for(FuncaoDados f:analise.getFuncaoDados()) {
            DetailFunctionRecord record = new DetailFunctionRecord();
            record.setName(f.getName());
            record.setModule((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getModulo().getNome());
            record.setAdj_factor((f.getFatorAjuste()==null)?"":f.getFatorAjuste().getNome());
            record.setFunctionality((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getNome());
            record.setClassification((f.getComplexidade()==null)?"":f.getComplexidade().toString());
            record.setSustentation((f.getSustantation()==null)?"":f.getSustantation());
            record.setType(0);
            List<StringRecord> relList = new ArrayList<>();
            if (f.getRetStr()!=null && !f.getRetStr().isEmpty()){
                for(String row:f.getRetStr().split("\n")) {
                    relList.add(new StringRecord(row,0));
                }
            }
            if (relList.size()==0) {
                relList.add(new StringRecord("0",0));
            }
            record.setRlr(new JRBeanCollectionDataSource(relList));
            List<StringRecord> derList = new ArrayList<>();
            if (f.getDetStr()!=null && !f.getDetStr().isEmpty()){
                for(String row:f.getDetStr().split("\n")) {
                    derList.add(new StringRecord(row,0));
                }
            }
            if (derList.size()==0) {
                derList.add(new StringRecord("0",0));
            }
            record.setDer(new JRBeanCollectionDataSource(derList));
            List<FileRecord> files = new ArrayList<>();
            for(UploadedFile uploadedFile:f.getFiles()){
                FileRecord file = new FileRecord();
                file.setName(uploadedFile.getFilename());
                file.setSize(FileUtils.byteCountToDisplaySize(uploadedFile.getSizeOf()));
                file.setFormat(StringUtils.getFormatFile(uploadedFile.getFilename()));
                files.add(file);
            }
            record.setFiles(new JRBeanCollectionDataSource(files));
            list.add(record);
        }

        return list;
    }

    private List<DetailFunctionRecord> convertTranFunctions(Analise analise) {
        List<DetailFunctionRecord> list = new ArrayList<>();
        for(FuncaoTransacao f:analise.getFuncaoTransacaos()) {
            DetailFunctionRecord record = new DetailFunctionRecord();
            record.setName(f.getName());
            record.setModule((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getModulo().getNome());
            record.setAdj_factor((f.getFatorAjuste()==null)?"":f.getFatorAjuste().getNome());
            record.setFunctionality((f.getFuncionalidade()==null)?"":f.getFuncionalidade().getNome());
            record.setClassification((f.getComplexidade()==null)?"":f.getComplexidade().toString());
            record.setSustentation((f.getSustantation()==null)?"":f.getSustantation());
            record.setType(1);
            List<StringRecord> relList = new ArrayList<>();
            if (f.getFtrStr()!=null && !f.getFtrStr().isEmpty()){
                for(String row:f.getFtrStr().split("\n")) {
                    relList.add(new StringRecord(row,1));
                }
            }
            if (relList.size()==0) {
                relList.add(new StringRecord("0",0));
            }
            record.setRlr(new JRBeanCollectionDataSource(relList));
            List<StringRecord> derList = new ArrayList<>();
            if (f.getDetStr()!=null && !f.getDetStr().isEmpty()){
                for(String row:f.getDetStr().split("\n")) {
                    derList.add(new StringRecord(row,1));
                }
            }
            if (derList.size()==0) {
                derList.add(new StringRecord("0",0));
            }
            record.setDer(new JRBeanCollectionDataSource(derList));
            List<FileRecord> files = new ArrayList<>();
            for(UploadedFile uploadedFile:f.getFiles()){
                FileRecord file = new FileRecord();
                file.setName(uploadedFile.getFilename());
                file.setSize(FileUtils.byteCountToDisplaySize(uploadedFile.getSizeOf()));
                file.setFormat(StringUtils.getFormatFile(uploadedFile.getFilename()));
                files.add(file);
            }
            record.setFiles(new JRBeanCollectionDataSource(files));
            list.add(record);
        }
        return list;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    @GetMapping("/analiseReport/detailed/{id}")
    public ResponseEntity<byte[]> createDetailedReport(@PathVariable long id) throws FileNotFoundException, JRException {
        Analise analise = this.analiseRepository.findOne(id);
        Map params = new HashMap();
        params.put("Organization",analise.getOrganizacao()==null?"Organization":analise.getOrganizacao().getNome());
        params.put("OS",analise.getNumeroOs());
        params.put("System",analise.getSistema().getNome());
        params.put("fp",analise.getPfTotal());
        params.put("createDate",analise.getAudit().getCreatedOn());
        params.put("updateDate",analise.getAudit().getUpdatedOn());
        List<DetailFunctionRecord> data = this.convertDataFunctions(analise);
        data.addAll(this.convertTranFunctions(analise));
        JRDataSource dataSource = new JRBeanCollectionDataSource(data);
        File jasperFile = new File(getClass().getClassLoader().getResource("reports/detailed_analise_report.jasper").getFile());
        JasperPrint jasperPrint = (JasperPrint) JasperFillManager.fillReport(new FileInputStream(jasperFile),params, dataSource);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(),headers, HttpStatus.OK);
        return response;
    }

}
