package br.com.basis.abaco.reports.rest;

import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.reports.util.TableOfContentBean;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessBufferedFileInputStream;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class RelatorioFatorAjusteRest {

    private static final String PATH_CAPA = "reports/fatorAjuste/Capa.jasper";
    private static final String PATH_INDICE = "reports/fatorAjuste/Indice.jasper";
    private static final String PATH_CONTEUDO = "reports/fatorAjuste/Conteudo.jasper";
    private static final String PATH_CONTRA_CAPA = "reports/fatorAjuste/ContraCapa.jasper";
    private static final String PATH_IMAGE_BASIS = "reports/fatorAjuste/basis-logo.png";

    private static final String PATH_ARQUIVO_LEITURA = System.getProperty("java.io.tmpdir") + "/ArquivoLeitura.pdf";

    private UploadedFile uploadedFiles;

    public RelatorioFatorAjusteRest(){
        super();
    }

    public ResponseEntity<byte[]> gerarFatorAjustePDF(Manual manual) throws JRException, IOException, URISyntaxException {

        Map<String, Object> paramsCapa = popularCapaRelatorio(manual);

        JasperPrint printCapa = JasperFillManager.fillReport(getClass().getClassLoader().getResourceAsStream(PATH_CAPA), paramsCapa, new JREmptyDataSource(1));
        JasperPrint printIndice = gerarIndice(manual);
        JasperPrint printContraCapa = JasperFillManager.fillReport(getClass().getClassLoader().getResourceAsStream(PATH_CONTRA_CAPA), new HashMap<>(), new JREmptyDataSource(1));

        List<JasperPrint> jasperPrintList = new ArrayList<JasperPrint>();
        jasperPrintList.add(printCapa);
        jasperPrintList.add(printIndice);
        jasperPrintList.add(gerarJPConteudo(manual));
        jasperPrintList.add(printContraCapa);

        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterInput(SimpleExporterInput.getInstance(jasperPrintList));

        ByteArrayOutputStream outputArray = new ByteArrayOutputStream();
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputArray));
        SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
        configuration.setMetadataTitle("Manual " + manual.getNome() + ".pdf");
        configuration.setDisplayMetadataTitle(true);
        configuration.setCreatingBatchModeBookmarks(false);
        exporter.setConfiguration(configuration);
        exporter.exportReport();

        Files.delete(Paths.get(PATH_ARQUIVO_LEITURA));

        return new ResponseEntity<>(outputArray.toByteArray(), HttpStatus.OK);
    }

    private JasperPrint gerarJPConteudo(Manual manual) throws JRException {
        List<FatorAjuste> list = manual.getFatoresAjuste().stream().collect(Collectors.toList());
        list.sort((obj1, obj2) -> obj1.compareTo(obj2));
        JRBeanCollectionDataSource jrBean = new JRBeanCollectionDataSource(list);
        return JasperFillManager.fillReport(getClass().getClassLoader().getResourceAsStream(PATH_CONTEUDO), new HashMap<>(), jrBean);
    }

    private String lerConteudoRelatorio(Manual manual) throws JRException, IOException, URISyntaxException {
        JasperExportManager.exportReportToPdfFile(gerarJPConteudo(manual), PATH_ARQUIVO_LEITURA);
        File file = new File(PATH_ARQUIVO_LEITURA);

        try{
            PDFParser parser = new PDFParser(new RandomAccessBufferedFileInputStream(file));
            parser.parse();
            COSDocument cosDoc = parser.getDocument();
            PDFTextStripper pdfStripper = new PDFTextStripper();
            PDDocument pdDoc = new PDDocument(cosDoc);
            pdfStripper.setStartPage(1);
            return pdfStripper.getText(pdDoc);
        }
        catch (FileNotFoundException e) {
            throw e;
        }
        catch (IOException e) {
            throw e;
        }
    }

    private JasperPrint gerarIndice(Manual manual) throws JRException, IOException, URISyntaxException {
        String text = lerConteudoRelatorio(manual);
        String textVect[] = text.split("Pg");
        List<FatorAjuste> fatoresAjuste = manual.getFatoresAjuste().stream().collect(Collectors.toList());
        fatoresAjuste.sort((obj1, obj2) -> obj1.compareTo(obj2));

        Map<String, String> indiceMap = new HashMap<>();

        for(FatorAjuste obj : fatoresAjuste){
            contadorPaginas(obj,textVect,indiceMap);
        }

        List<TableOfContentBean> tableOfContents = new ArrayList<>();

        for(FatorAjuste obj : fatoresAjuste){
            tableOfContents.add(new TableOfContentBean(obj.getCodigo() ,obj.getNome(), indiceMap.get(obj.getCodigo())));
        }

        JRBeanCollectionDataSource jrBean = new JRBeanCollectionDataSource(tableOfContents);
        return JasperFillManager.fillReport(getClass().getClassLoader().getResourceAsStream(PATH_INDICE), new HashMap<>(), jrBean);
    }

    private Map<String, Object> popularCapaRelatorio(Manual manual) {

        Map<String, Object> paramsCapa = new HashMap<>();
        paramsCapa.put("BookTitle", manual.getNome());

        InputStream reportStream;
        if(this.uploadedFiles!= null && this.uploadedFiles.getId() != null && this.uploadedFiles.getId() >0 ) {
            reportStream = new ByteArrayInputStream(uploadedFiles.getLogo());
            paramsCapa.put("IMAGEMLOGO",reportStream);
        }else{
            reportStream = getClass().getClassLoader().getResourceAsStream(PATH_IMAGE_BASIS);
            paramsCapa.put("IMAGEMLOGO", reportStream);
        }
        return paramsCapa;
    }

    private void contadorPaginas(FatorAjuste obj, String[] textVect, Map<String, String> indiceMap){
        for(int i=0 ; i< textVect.length ; i++){
            if(textVect[i].contains(obj.getCodigo())){
                for(int j=i+1 ; j< textVect.length ; j++){
                    if(textVect[j].contains(".-")){
                        String pagina = textVect[j].substring(2,4);
                        indiceMap.put(obj.getCodigo(), pagina);
                        break;
                    }
                }
                break;
            }
        }
    }

}
