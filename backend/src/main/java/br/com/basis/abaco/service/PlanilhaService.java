package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import com.itextpdf.styledxmlparser.jsoup.Jsoup;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.regexp.RE;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Analise}.
 */
@Service
@Transactional
public class PlanilhaService {

    private final static String ESTIMATIVA = "AFP - Estimativa";
    private final static String DETALHADA = "AFP - Detalhada";
    private final static String RESUMO = "Resumo";

    private final static String METODO_DETALHADO = "Detalhada";
    private final static String METODO_ESTIMATIVA = "Estimativa";
    private final static String METODO_INDICATIVA = "Indicativa";

    public ByteArrayOutputStream selecionarModelo(Analise analise, Long modelo) throws IOException {
        List<FuncaoDados> funcaoDadosList = analise.getFuncaoDados().stream().collect(Collectors.toList());
        List<FuncaoTransacao> funcaoTransacaoList = analise.getFuncaoTransacaos().stream().collect(Collectors.toList());
        switch(modelo.intValue()) {
            case 1:
                return this.modeloPadraoBasis(analise, funcaoDadosList, funcaoTransacaoList);
            case 2:
                return this.modeloPadraoBNDES(analise, funcaoDadosList, funcaoTransacaoList);
            case 3:
                return this.modeloPadraoANAC(analise, funcaoDadosList, funcaoTransacaoList);
            case 4:
                return this.modeloPadraoEB1(analise, funcaoDadosList, funcaoTransacaoList);
            case 5:
                return this.modeloPadraoEB2(analise, funcaoDadosList, funcaoTransacaoList);
            default:
                return this.modeloPadraoBasis(analise, funcaoDadosList, funcaoTransacaoList);
        }
    }

    //EB 2

    private ByteArrayOutputStream modeloPadraoEB2(Analise analise, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) throws IOException {
        InputStream stream = getClass().getClassLoader().getResourceAsStream("reports/planilhas/modelo5-eb2.xlsx");
        XSSFWorkbook excelFile = new XSSFWorkbook(stream);

        this.setarResumoExcelPadraoEB2(excelFile, analise);
        this.setarDeflatoresExcelPadraoEB2(excelFile, analise);
        if(!analise.getMetodoContagem().equals(MetodoContagem.INDICATIVA)){
            this.setarFuncoesINMExcelPadraoEB2(excelFile, funcaoTransacaoList);
            if(analise.getMetodoContagem().equals(MetodoContagem.ESTIMADA)){
                this.setarFuncoesEstimadaExcelPadraoEB2(excelFile, funcaoDadosList, funcaoTransacaoList);
            }else{
                this.setarFuncoesDetalhadaExcelPadraoEB2(excelFile, funcaoDadosList, funcaoTransacaoList);
            }
        }
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        excelFile.write(outputStream);
        return outputStream;
    }

    private void setarFuncoesEstimadaExcelPadraoEB2(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet(ESTIMATIVA);
        int rowNum = 10;
        int idFuncao = 1;
        for(int i = 0; i < funcaoDadosList.size(); i++){
            FuncaoDados funcaoDados =  funcaoDadosList.get(i);
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(5).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(6).setCellValue(funcaoDados.getName());
            row.getCell(7).setCellValue(funcaoDados.getTipo().toString());
            row.getCell(0).setCellValue(idFuncao++);
            row.getCell(1).setCellValue(funcaoDados.getFatorAjuste().getNome());
            row.getCell(4).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(10).setCellValue(Jsoup.parse(funcaoDados.getSustantation() != null ? funcaoDados.getSustantation() : "").text());
        }
        for (int i = 0; i < funcaoTransacaoList.size(); i++) {
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            if (!funcaoTransacao.getTipo().equals(TipoFuncaoTransacao.INM)) {
                XSSFRow row = excelSheet.getRow(rowNum++);
                row.getCell(0).setCellValue(idFuncao++);
                row.getCell(6).setCellValue(funcaoTransacao.getName());
                row.getCell(7).setCellValue(funcaoTransacao.getTipo().toString());
                row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
                row.getCell(4).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
                row.getCell(5).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
                row.getCell(10).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation() != null ? funcaoTransacao.getSustantation() : "").text());
            }
        }
    }

    private void setarFuncoesDetalhadaExcelPadraoEB2(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet(DETALHADA);
        int idFuncao = 1;
        int rowNum = 9;
        for(int i = 0; i < funcaoDadosList.size(); i++){
            XSSFRow row = excelSheet.getRow(rowNum++);
            FuncaoDados funcaoDados =  funcaoDadosList.get(i);
            row.getCell(0).setCellValue(idFuncao++);
            row.getCell(1).setCellValue(funcaoDados.getFatorAjuste().getNome());
            row.getCell(3).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(4).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(5).setCellValue(funcaoDados.getName());
            row.getCell(6).setCellValue(funcaoDados.getTipo().toString());
            row.getCell(7).setCellValue(funcaoDados.getDers().size());
            String ders = funcaoDados.getDers().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(8).setCellValue(ders);
            row.getCell(9).setCellValue(funcaoDados.getRlrs().size());
            String rlrs = funcaoDados.getRlrs().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(10).setCellValue(rlrs);
            row.getCell(18).setCellValue(Jsoup.parse(funcaoDados.getSustantation() != null ? funcaoDados.getSustantation() : "").text());
        }
        for(int i = 0; i < funcaoTransacaoList.size(); i++) {
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            if (!funcaoTransacao.getTipo().equals(TipoFuncaoTransacao.INM)) {
                XSSFRow row = excelSheet.getRow(rowNum++);
                row.getCell(0).setCellValue(idFuncao++);
                row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
                row.getCell(3).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
                row.getCell(4).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
                row.getCell(5).setCellValue(funcaoTransacao.getName());
                row.getCell(6).setCellValue(funcaoTransacao.getTipo().toString());
                row.getCell(7).setCellValue(funcaoTransacao.getDers().size());
                String ders = funcaoTransacao.getDers().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
                row.getCell(8).setCellValue(ders);
                row.getCell(9).setCellValue(funcaoTransacao.getAlrs().size());
                String alrs = funcaoTransacao.getAlrs().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
                row.getCell(10).setCellValue(alrs);
                row.getCell(18).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation() != null ? funcaoTransacao.getSustantation() : "").text());
            }
        }
    }

    private void setarFuncoesINMExcelPadraoEB2(XSSFWorkbook excelFile, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet("AFP - INM");
        int rowNum = 9;
        int idFuncao = 1;
        if(!funcaoTransacaoList.isEmpty()){
            for (int i = 0; i<funcaoTransacaoList.size(); i++){
                FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
                if(funcaoTransacao.getTipo().equals(TipoFuncaoTransacao.INM)){
                    XSSFRow row = excelSheet.getRow(rowNum++);
                    row.getCell(0).setCellValue(idFuncao++);
                    row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
                    row.getCell(3).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
                    row.getCell(4).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
                    row.getCell(5).setCellValue(funcaoTransacao.getName());
                    row.getCell(7).setCellValue(funcaoTransacao.getQuantidade() != null ? funcaoTransacao.getQuantidade() : Integer.valueOf(0));
                    row.getCell(9).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation() != null ? funcaoTransacao.getSustantation() : "").text());
                }
            }
        }
    }

    private void setarDeflatoresExcelPadraoEB2(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet excelSheet = excelFile.getSheet("Manual EB");
        int rowNum = 2;
        int rowNumUnitario = 2;
        List<FatorAjuste> fatorAjusteList = analise.getManual().getFatoresAjuste().stream().collect(Collectors.toList());
        for(int i = 0; i < fatorAjusteList.size(); i++) {
            FatorAjuste fatorAjuste = fatorAjusteList.get(i);
            if(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.PERCENTUAL)){
                XSSFRow row = excelSheet.getRow(rowNum++);
                row.getCell(0).setCellValue(fatorAjuste.getNome());
                row.getCell(1).setCellValue(fatorAjuste.getFator().doubleValue()/100);
            }else{
                XSSFRow row = excelSheet.getRow(rowNumUnitario++);
                row.getCell(9).setCellValue(fatorAjuste.getNome());
                row.getCell(10).setCellValue(fatorAjuste.getFator().doubleValue());
                row.getCell(11).setCellValue("Q");
            }
        }
    }

    private void setarResumoExcelPadraoEB2(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet excelSheet = excelFile.getSheet(RESUMO);
        switch(analise.getMetodoContagem()){
            case DETALHADA:
                excelSheet.getRow(3).getCell(1).setCellValue(METODO_DETALHADO);
                break;
            case ESTIMADA:
                excelSheet.getRow(3).getCell(1).setCellValue(METODO_ESTIMATIVA);
                break;
            case INDICATIVA:
                excelSheet.getRow(3).getCell(1).setCellValue(METODO_INDICATIVA);
                break;
        }
        if(analise.getSistema() != null){
            excelSheet.getRow(3).getCell(4).setCellValue(analise.getSistema().getNome());
        }
        excelSheet.getRow(13).getCell(0).setCellValue(analise.getEscopo());
    }

    //EB 1

    private ByteArrayOutputStream modeloPadraoEB1(Analise analise, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) throws IOException {
        InputStream stream = getClass().getClassLoader().getResourceAsStream("reports/planilhas/modelo4-eb1.xlsx");
        XSSFWorkbook excelFile = new XSSFWorkbook(stream);

        this.setarResumoExcelPadraoEB1(excelFile, analise);
        this.setarDeflatoresExcelPadraoEB1(excelFile, analise);
        if(analise.getMetodoContagem().equals(MetodoContagem.ESTIMADA)){
            this.setarFuncoesEstimadaExcelPadraoEB1(excelFile, funcaoDadosList, funcaoTransacaoList);
        }else{
            this.setarFuncoesDetalhadaExcelPadraoEB1(excelFile, funcaoDadosList, funcaoTransacaoList);
        }
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        excelFile.write(outputStream);
        return outputStream;
    }

    private void setarFuncoesDetalhadaExcelPadraoEB1(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet(DETALHADA);
        int rowNum = 9;
        int idFuncao = 1;
        for (int i = 0; i < funcaoDadosList.size(); i++) {
            FuncaoDados funcaoDados = funcaoDadosList.get(i);
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(8).setCellValue(funcaoDados.getQuantidade() != null ? funcaoDados.getQuantidade() : Integer.valueOf(0));
            row.getCell(9).setCellValue(funcaoDados.getTipo().toString());row.getCell(0).setCellValue(idFuncao++);
            row.getCell(1).setCellValue(funcaoDados.getFatorAjuste().getNome());
            row.getCell(5).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(6).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(7).setCellValue(funcaoDados.getName());
            row.getCell(10).setCellValue(funcaoDados.getDers().size());
            row.getCell(11).setCellValue(funcaoDados.getRlrs().size());
            row.getCell(19).setCellValue(Jsoup.parse(funcaoDados.getSustantation() != null ? funcaoDados.getSustantation() : "").text());
        }
        for (int i = 0; i < funcaoTransacaoList.size(); i++) {
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(0).setCellValue(idFuncao++);
            row.getCell(8).setCellValue(funcaoTransacao.getQuantidade() != null ? funcaoTransacao.getQuantidade() : Integer.valueOf(0));
            row.getCell(9).setCellValue(funcaoTransacao.getTipo().toString());
            row.getCell(10).setCellValue(funcaoTransacao.getDers().size());
            row.getCell(11).setCellValue(funcaoTransacao.getAlrs().size());
            row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
            row.getCell(5).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
            row.getCell(6).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
            row.getCell(7).setCellValue(funcaoTransacao.getName());
            row.getCell(19).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation() != null ? funcaoTransacao.getSustantation() : "").text());
        }
    }

    private void setarFuncoesEstimadaExcelPadraoEB1(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet(ESTIMATIVA);
        int rowNum = 9;
        int idFuncao = 1;
        for (int i = 0; i < funcaoDadosList.size(); i++) {
            FuncaoDados funcaoDados = funcaoDadosList.get(i);
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(0).setCellValue(idFuncao++);
            row.getCell(1).setCellValue(funcaoDados.getFatorAjuste().getNome());
            row.getCell(5).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(6).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(7).setCellValue(funcaoDados.getName());
            row.getCell(8).setCellValue(funcaoDados.getQuantidade() != null ? funcaoDados.getQuantidade() : Integer.valueOf(0));
            row.getCell(9).setCellValue(funcaoDados.getTipo().toString());
            row.getCell(11).setCellValue(Jsoup.parse(funcaoDados.getSustantation() != null ? funcaoDados.getSustantation() : "").text());
        }
        for (int i = 0; i < funcaoTransacaoList.size(); i++) {
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(0).setCellValue(idFuncao++);
            row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
            row.getCell(5).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
            row.getCell(6).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
            row.getCell(7).setCellValue(funcaoTransacao.getName());
            row.getCell(8).setCellValue(funcaoTransacao.getQuantidade() != null ? funcaoTransacao.getQuantidade() : Integer.valueOf(0));
            row.getCell(9).setCellValue(funcaoTransacao.getTipo().toString());
            row.getCell(11).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation() != null ? funcaoTransacao.getSustantation() : "").text());
        }
    }

    private void setarDeflatoresExcelPadraoEB1(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet excelSheet = excelFile.getSheet("Tipo Projeto");
        int rowNum = 2;
        List<FatorAjuste> fatorAjusteList = analise.getManual().getFatoresAjuste().stream().collect(Collectors.toList());
        for(int i = 0; i < fatorAjusteList.size(); i++) {
            FatorAjuste fatorAjuste = fatorAjusteList.get(i);
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(9).setCellValue(fatorAjuste.getNome());
            row.getCell(10)
                .setCellValue(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.PERCENTUAL) ? fatorAjuste.getFator().doubleValue()/100 : fatorAjuste.getFator().doubleValue());
            row.getCell(11)
                .setCellValue(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.PERCENTUAL) ? "%": "Q");
        }
    }

    private void setarResumoExcelPadraoEB1(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet excelSheet = excelFile.getSheet(RESUMO);
        if(analise.getNumeroOs() != null){
            excelSheet.getRow(3).getCell(1).setCellValue(analise.getNumeroOs());
        }else{
            excelSheet.getRow(3).getCell(1).setCellValue(analise.getIdentificadorAnalise());
        }
        if(analise.getSistema() != null){
            excelSheet.getRow(4).getCell(5).setCellValue(analise.getSistema().getNome());
        }
        switch(analise.getMetodoContagem()){
            case DETALHADA:
                excelSheet.getRow(4).getCell(1).setCellValue(METODO_DETALHADO);
                break;
            case ESTIMADA:
                excelSheet.getRow(4).getCell(1).setCellValue(METODO_ESTIMATIVA);
                break;
            case INDICATIVA:
                excelSheet.getRow(4).getCell(1).setCellValue(METODO_INDICATIVA);
                break;
        }
        excelSheet.getRow(12).getCell(0).setCellValue(analise.getEscopo());
    }

    //ANAC

    private ByteArrayOutputStream modeloPadraoANAC(Analise analise, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) throws IOException {
        InputStream stream = getClass().getClassLoader().getResourceAsStream("reports/planilhas/modelo3-anac.xlsx");
        XSSFWorkbook excelFile = new XSSFWorkbook(stream);
        this.setarResumoExcelPadraoANAC(excelFile, analise);
        this.setarDeflatoresExcelPadraoANAC(excelFile, analise);
        this.setarFuncoesPadraoANAC(excelFile, funcaoDadosList, funcaoTransacaoList);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        excelFile.write(outputStream);
        return outputStream;
    }

    private void setarFuncoesPadraoANAC(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet("Funções");
        int rowNum = 2;
        for (int i = 0; i < funcaoDadosList.size(); i++) {
            FuncaoDados funcaoDados = funcaoDadosList.get(i);
            String nome = funcaoDados.getFuncionalidade().getNome() + " - " + funcaoDados.getName();
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(1).setCellValue(nome);
            row.getCell(2).setCellValue(funcaoDados.getTipo().toString());
            row.getCell(3).setCellValue(funcaoDados.getFatorAjuste().getSigla().isEmpty() ? "" : funcaoDados.getFatorAjuste().getSigla());
            row.getCell(4).setCellValue(funcaoDados.getDers().size());
            String ders = funcaoDados.getDers().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(5).setCellValue(ders);
            row.getCell(6).setCellValue(funcaoDados.getRlrs().size());
            String rlrs = funcaoDados.getRlrs().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(7).setCellValue(rlrs);
            row.getCell(8).setCellValue(funcaoDados.getQuantidade() != null ? funcaoDados.getQuantidade() : Integer.valueOf(0));
            row.getCell(17).setCellValue(Jsoup.parse(funcaoDados.getSustantation() != null ? funcaoDados.getSustantation() : "").text());
        }
        for (int i = 0; i < funcaoTransacaoList.size(); i++) {
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            String nome = funcaoTransacao.getFuncionalidade().getNome() + " - " + funcaoTransacao.getName();
            XSSFRow row = excelSheet.getRow(rowNum++);
            row.getCell(1).setCellValue(nome);
            row.getCell(2).setCellValue(funcaoTransacao.getTipo().toString());
            row.getCell(3).setCellValue(funcaoTransacao.getFatorAjuste().getSigla().isEmpty() ? "" : funcaoTransacao.getFatorAjuste().getSigla());
            row.getCell(4).setCellValue(funcaoTransacao.getDers().size());
            String ders = funcaoTransacao.getDers().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(5).setCellValue(ders);
            row.getCell(6).setCellValue(funcaoTransacao.getAlrs().size());
            String alrs = funcaoTransacao.getAlrs().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(7).setCellValue(alrs);
            row.getCell(8).setCellValue(funcaoTransacao.getQuantidade() != null ? funcaoTransacao.getQuantidade() : Integer.valueOf(0));
            row.getCell(17).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation()  != null ? funcaoTransacao.getSustantation() : "").text());
        }
    }

    private void setarDeflatoresExcelPadraoANAC(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet deflatorSheet = excelFile.getSheet("Lista");
        int rowNum = 2;
        List<FatorAjuste> fatorAjusteList = analise.getManual().getFatoresAjuste().stream().collect(Collectors.toList());
        for(int i = 0; i < fatorAjusteList.size(); i++) {
            FatorAjuste fatorAjuste = fatorAjusteList.get(i);
            XSSFRow row = deflatorSheet.getRow(rowNum++);
            row.getCell(0).setCellValue(fatorAjuste.getSigla().isEmpty() ? "" : fatorAjuste.getSigla());
            row.getCell(1).setCellValue(fatorAjuste.getDescricao());
            row.getCell(2)
                .setCellValue(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.PERCENTUAL) ? fatorAjuste.getFator().doubleValue()/100 : fatorAjuste.getFator().doubleValue());
            row.getCell(3).setCellValue(fatorAjuste.getNome());
            row.getCell(4)
                .setCellValue(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.PERCENTUAL) ? "PC" : "PF");
        }
    }

    private void setarResumoExcelPadraoANAC(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet excelSheet = excelFile.getSheet(RESUMO);
        if(analise.getSistema() != null){
            excelSheet.getRow(8).getCell(3).setCellValue(analise.getSistema().getNome());
        }
        excelSheet.getRow(11).getCell(3)
            .setCellValue(analise.getMetodoContagem().equals(MetodoContagem.ESTIMADA) ? "Contagem Estimada" : "Contagem Detalhada");
        excelSheet.getRow(41).getCell(1).setCellValue(analise.getPropositoContagem());
        excelSheet.getRow(43).getCell(1).setCellValue(analise.getEscopo());
        excelSheet.getRow(45).getCell(1).setCellValue(analise.getFronteiras());
    }

    //BNDES

    private ByteArrayOutputStream modeloPadraoBNDES(Analise analise, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) throws IOException {
        InputStream stream = getClass().getClassLoader().getResourceAsStream("reports/planilhas/modelo2-bndes.xlsx");
        XSSFWorkbook excelFile = new XSSFWorkbook(stream);
        this.setarResumoExcelPadraoBNDES(excelFile, analise);
        this.setarFuncoesPadraoBNDES(excelFile, funcaoDadosList, funcaoTransacaoList);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        excelFile.write(outputStream);
        return outputStream;
    }

    private void setarFuncoesPadraoBNDES(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet("Planilha");
        int rowNum = 6;
        if(!funcaoDadosList.isEmpty()){
            for(int i = 0; i < funcaoDadosList.size(); i++){
                FuncaoDados funcaoDados = funcaoDadosList.get(i);
                String nome = funcaoDados.getFuncionalidade().getNome() + " - " + funcaoDados.getName();
                XSSFRow row = excelSheet.getRow(rowNum++);
                row.getCell(0).setCellValue(nome);
                row.getCell(8).setCellValue(funcaoDados.getTipo().toString());
                row.getCell(9).setCellValue(this.getImpactoFromFatorAjuste(funcaoDados.getFatorAjuste()));
                row.getCell(23).setCellValue(Jsoup.parse(funcaoDados.getSustantation() != null ? funcaoDados.getSustantation() : "").text());
            }
        }
        rowNum++;
        if(!funcaoTransacaoList.isEmpty()){
            for(int i = 0; i < funcaoTransacaoList.size(); i++){
                FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
                String nome = funcaoTransacao.getFuncionalidade().getNome() + " - " + funcaoTransacao.getName();
                XSSFRow row = excelSheet.getRow(rowNum++);
                row.getCell(0).setCellValue(nome);
                row.getCell(9).setCellValue(this.getImpactoFromFatorAjuste(funcaoTransacao.getFatorAjuste()));
                row.getCell(8).setCellValue(funcaoTransacao.getTipo().toString());
                row.getCell(23).setCellValue(Jsoup.parse(funcaoTransacao.getSustantation() != null ? funcaoTransacao.getSustantation() : "").text());
            }
        }
    }

    private String getImpactoFromFatorAjuste(FatorAjuste fatorAjuste){
        switch(fatorAjuste.getFator().intValue()){
            case 100:
                return "I";
            case 50:
                return "A";
            case 40:
                return "E";
            case 15:
                return "T";
            default:
                return "C";
        }
    }

    private void setarResumoExcelPadraoBNDES(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet excelSheet = excelFile.getSheet("Identificação");
        if(analise.getSistema() != null){
            excelSheet.getRow(3).getCell(5).setCellValue(analise.getSistema().getNome());
        }
        excelSheet.getRow(22).getCell(0).setCellValue(analise.getEscopo());
        excelSheet.getRow(11).getCell(0).setCellValue(analise.getPropositoContagem());
    }

    //Padrão BASIS

    private ByteArrayOutputStream modeloPadraoBasis(Analise analise, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) throws IOException {
        InputStream stream = getClass().getClassLoader().getResourceAsStream("reports/planilhas/modelo1-basis.xlsx");
        XSSFWorkbook excelFile = new XSSFWorkbook(stream);
        this.setarDeflatoresExcelPadraoBasis(excelFile, analise);
        this.setarResumoExcelPadraoBasis(excelFile, analise);
        if(analise.getMetodoContagem().equals(MetodoContagem.INDICATIVA)){
            this.setarFuncoesIndicativaExcelPadraoBasis(excelFile, funcaoDadosList);
        }
        else{
            this.setarFuncoesINMExcelPadraoBasis(excelFile, funcaoTransacaoList);
            if(analise.getMetodoContagem().equals(MetodoContagem.DETALHADA)){
                this.setarFuncoesDetalhadaExcelPadraoBasis(excelFile, funcaoDadosList, funcaoTransacaoList);
            }
            else if(analise.getMetodoContagem().equals(MetodoContagem.ESTIMADA)){
                this.setarFuncoesEstimadaExcelPadraoBasis(excelFile, funcaoDadosList, funcaoTransacaoList);
            }
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        excelFile.write(outputStream);
        return outputStream;
    }

    private void setarDeflatoresExcelPadraoBasis(XSSFWorkbook excelFile, Analise analise) {
        XSSFSheet deflatorSheet = excelFile.getSheet("Tipo Projeto");
        int rownum = 2;
        int rowNumUnitario = 2;
        List<FatorAjuste> fatorAjusteList = analise.getManual().getFatoresAjuste().stream().collect(Collectors.toList());

        for(int i = 0; i < fatorAjusteList.size(); i++){
            FatorAjuste fatorAjuste = fatorAjusteList.get(i);
            if(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.PERCENTUAL)){
                XSSFRow row = deflatorSheet.getRow(rownum++);

                row.getCell(0).setCellValue(fatorAjuste.getNome());
                row.getCell(1).setCellValue(fatorAjuste.getFator().doubleValue()/100);
            }else if(fatorAjuste.getTipoAjuste().equals(TipoFatorAjuste.UNITARIO)){
                XSSFRow row = deflatorSheet.getRow(rowNumUnitario++);

                if (row.getCell(9) != null) {
                    row.getCell(9).setCellValue(fatorAjuste.getNome());
                }
                if (row.getCell(10) != null) {
                    row.getCell(10).setCellValue(fatorAjuste.getFator().doubleValue());
                }
                if (row.getCell(13) != null) {
                    row.getCell(13).setCellValue(fatorAjuste.getDescricao());
                }
            }
        }
    }

    private void setarResumoExcelPadraoBasis(XSSFWorkbook excelFile, Analise analise){
        XSSFSheet excelSheet = excelFile.getSheet(RESUMO);
        FormulaEvaluator evaluator = excelFile.getCreationHelper().createFormulaEvaluator();

        if(analise.getNumeroOs() != null){
            excelSheet.getRow(3).getCell(1).setCellValue(analise.getNumeroOs());
        }
        switch(analise.getMetodoContagem()){
            case ESTIMADA:
                excelSheet.getRow(4).getCell(1).setCellValue(METODO_ESTIMATIVA);
                break;
            case DETALHADA:
                excelSheet.getRow(4).getCell(1).setCellValue(METODO_DETALHADO);
                break;
            case INDICATIVA:
                excelSheet.getRow(4).getCell(1).setCellValue(METODO_INDICATIVA);
                break;
        }
        evaluator.evaluateFormulaCell(excelSheet.getRow(4).getCell(1));
        for(int i = 15; i < 23; i++){
            evaluator.evaluate(excelSheet.getRow(i).getCell(2));
        }
    }

    private void setarFuncoesDetalhadaExcelPadraoBasis(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet(DETALHADA);

        FormulaEvaluator evaluator = excelFile.getCreationHelper().createFormulaEvaluator();

        int rowNumero = 9;
        int idRow = 1;

        for (int i = 0; i < funcaoDadosList.size(); i++){
            FuncaoDados funcaoDados = funcaoDadosList.get(i);
            XSSFRow row = excelSheet.getRow(rowNumero++);

            row.getCell(5).setCellValue(funcaoDados.getName());
            row.getCell(6).setCellValue(funcaoDados.getTipo().toString());
            row.getCell(7).setCellValue(funcaoDados.getDers().size());row.getCell(0).setCellValue(idRow++);
            row.getCell(1).setCellValue(funcaoDados.getFatorAjuste().getNome());
            evaluator.evaluateFormulaCell(row.getCell(2));row.getCell(3).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(4).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(9).setCellValue(funcaoDados.getRlrs().size());
            String rlrs = funcaoDados.getRlrs().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(10).setCellValue(rlrs);
            String ders = funcaoDados.getDers().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
            row.getCell(8).setCellValue(ders);
            evaluator.evaluateFormulaCell(row.getCell(16));
        }

        for (int i = 0; i < funcaoTransacaoList.size(); i++){
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            if(!funcaoTransacao.getTipo().equals(TipoFuncaoTransacao.INM)){
                XSSFRow row = excelSheet.getRow(rowNumero++);
                row.getCell(6).setCellValue(funcaoTransacao.getTipo().toString());
                row.getCell(7).setCellValue(funcaoTransacao.getDers().size());
                row.getCell(3).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
                row.getCell(4).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
                row.getCell(5).setCellValue(funcaoTransacao.getName());
                String ders = funcaoTransacao.getDers().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
                row.getCell(8).setCellValue(ders);
                String rlrs = funcaoTransacao.getAlrs().stream().map(item -> item.getNome()).collect(Collectors.joining(", "));
                row.getCell(10).setCellValue(rlrs);
                row.getCell(9).setCellValue(funcaoTransacao.getAlrs().size());
                evaluator.evaluateFormulaCell(row.getCell(16));
                row.getCell(0).setCellValue(idRow++);
                row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
                evaluator.evaluateFormulaCell(row.getCell(2));
            }
        }
        evaluator.evaluateFormulaCell(excelSheet.getRow(4).getCell(3));
    }

    private void setarFuncoesEstimadaExcelPadraoBasis(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheetEstimada = excelFile.getSheet(ESTIMATIVA);

        FormulaEvaluator evaluator = excelFile.getCreationHelper().createFormulaEvaluator();

        int rownum = 10;
        int idRow = 1;

        for (int i = 0; i < funcaoDadosList.size(); i++) {
            FuncaoDados funcaoDados = funcaoDadosList.get(i);
            XSSFRow row = excelSheetEstimada.getRow(rownum++);
            row.getCell(0).setCellValue(idRow++);
            row.getCell(1).setCellValue(funcaoDados.getFatorAjuste().getNome());
            evaluator.evaluateFormulaCell(row.getCell(2));
            row.getCell(4).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(5).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(6).setCellValue(funcaoDados.getName());
            row.getCell(7).setCellValue(funcaoDados.getTipo().toString());
            evaluator.evaluateFormulaCell(row.getCell(8));
        }

        for (int i = 0; i < funcaoTransacaoList.size(); i++) {
            FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
            if(!funcaoTransacao.getTipo().equals(TipoFuncaoTransacao.INM)){
                XSSFRow row = excelSheetEstimada.getRow(rownum++);
                row.getCell(0).setCellValue(idRow++);
                row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
                evaluator.evaluateFormulaCell(row.getCell(2));
                row.getCell(4).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
                row.getCell(5).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
                row.getCell(6).setCellValue(funcaoTransacao.getName());
                row.getCell(7).setCellValue(funcaoTransacao.getTipo().toString());
                evaluator.evaluateFormulaCell(row.getCell(8));
            }
        }
        evaluator.evaluateFormulaCell(excelSheetEstimada.getRow(4).getCell(2));
    }


    private void setarFuncoesIndicativaExcelPadraoBasis(XSSFWorkbook excelFile, List<FuncaoDados> funcaoDadosList) {
        XSSFSheet excelSheet = excelFile.getSheet("AFP - Indicativa");
        FormulaEvaluator evaluator = excelFile.getCreationHelper().createFormulaEvaluator();

        int rownum = 9;
        int idRow = 1;
        for (int i = 0; i < funcaoDadosList.size(); i++) {
            FuncaoDados funcaoDados = funcaoDadosList.get(i);
            XSSFRow row = excelSheet.getRow(rownum++);
            row.getCell(0).setCellValue(idRow++);
            row.getCell(2).setCellValue(funcaoDados.getFuncionalidade().getModulo().getNome());
            row.getCell(3).setCellValue(funcaoDados.getFuncionalidade().getNome());
            row.getCell(5).setCellValue(funcaoDados.getName());
            row.getCell(6).setCellValue(funcaoDados.getTipo().toString());
            evaluator.evaluateFormulaCell(row.getCell(7));
        }
        evaluator.evaluateFormulaCell(excelSheet.getRow(4).getCell(3));
    }

    private void setarFuncoesINMExcelPadraoBasis(XSSFWorkbook excelFile, List<FuncaoTransacao> funcaoTransacaoList) {
        XSSFSheet excelSheet = excelFile.getSheet("AFP - INM");
        if(excelSheet != null){
            FormulaEvaluator evaluator = excelFile.getCreationHelper().createFormulaEvaluator();
            int rownum = 10;
            int idRow = 1;

            for (int i = 0; i < funcaoTransacaoList.size(); i++) {
                FuncaoTransacao funcaoTransacao = funcaoTransacaoList.get(i);
                if(funcaoTransacao.getTipo().equals(TipoFuncaoTransacao.INM)){
                    XSSFRow row = excelSheet.getRow(rownum++);
                    row.getCell(0).setCellValue(idRow++);
                    row.getCell(1).setCellValue(funcaoTransacao.getFatorAjuste().getNome());
                    evaluator.evaluateFormulaCell(row.getCell(2));
                    row.getCell(5).setCellValue(funcaoTransacao.getFuncionalidade().getModulo().getNome());
                    row.getCell(6).setCellValue(funcaoTransacao.getFuncionalidade().getNome());
                    row.getCell(7).setCellValue(funcaoTransacao.getName());
                    row.getCell(9).setCellValue(funcaoTransacao.getQuantidade() != null ? funcaoTransacao.getQuantidade() : Integer.valueOf(0));
                    row.getCell(10).setCellValue(funcaoTransacao.getDers().size());
                    row.getCell(11).setCellValue(funcaoTransacao.getAlrs().size());
                    row.getCell(12).setCellValue("-------");
                    evaluator.evaluateFormulaCell(row.getCell(18));
                }
            }
            evaluator.evaluateFormulaCell(excelSheet.getRow(4).getCell(3));
        }
    }
}
