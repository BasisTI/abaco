package br.com.basis.abaco.reports.util.itextutils;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.html2pdf.attach.ITagWorker;
import com.itextpdf.html2pdf.attach.ITagWorkerFactory;
import com.itextpdf.html2pdf.attach.ProcessorContext;
import com.itextpdf.html2pdf.attach.impl.DefaultTagWorkerFactory;
import com.itextpdf.html2pdf.html.TagConstants;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.BlockElement;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Div;
import com.itextpdf.layout.element.IBlockElement;
import com.itextpdf.layout.element.IElement;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.VerticalAlignment;
import com.itextpdf.styledxmlparser.node.IElementNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

/**
 *
 */
public class ReportFactory {
    private Float topMargin, rightMargin, bottomMargin, leftMargin;
    private PdfFont regular = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
    private PdfFont bold = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
    private FooterHandler footerHandler;
    private PageSizeModifier pageSizeModifier;
    private ITagWorkerFactory mapperTagCKEditor;
    private Div divHtmlConvert;
    private Logger log = LoggerFactory.getLogger(ReportFactory.class);
    private int subTitleNumber = 1;
    private Table table;

    public ReportFactory() throws IOException {
        topMargin = (float) 0.3 * 72;
        rightMargin = (float) 0.3 * 72;
        bottomMargin = (float) 0.3 * 72;
        leftMargin = (float) 0.3 * 72;
    }

    public Table makeCabecalho(File pathImg, String title, String versionText, Document document) {
        Table table = new Table(3);
        table.setWidth(document.getPdfDocument().getDefaultPageSize().getWidth() - rightMargin - rightMargin);
        try {
            Image logo = new Image(ImageDataFactory.create(pathImg.getAbsolutePath()));
            logo.setWidth(80).setHeight(40);
            Paragraph titleParagraph = makeTitulo(title, 18F, TextAlignment.CENTER,  false);
            Div leftContent = makeRightHeader(versionText);
            configureHeader(table, logo, titleParagraph, leftContent);
            return table;
        } catch (RuntimeException | MalformedURLException e) {
            log.info(e.getMessage(), e);
            return table;
        }
    }

    private void configureHeader(Table table, Image logo, Paragraph titleParagraph, Div leftContent) {
        table.addCell(new Cell().add(logo).setHorizontalAlignment(HorizontalAlignment.LEFT).setVerticalAlignment(VerticalAlignment.MIDDLE).setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(titleParagraph).setHorizontalAlignment(HorizontalAlignment.CENTER).setVerticalAlignment(VerticalAlignment.MIDDLE).setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(leftContent).setHorizontalAlignment(HorizontalAlignment.RIGHT).setVerticalAlignment(VerticalAlignment.MIDDLE).setMaxWidth(80).setBorder(Border.NO_BORDER));
    }

    /**
     * Constroi o cabeçalho esquedo contendo a versão do relatório e data atual<p>
     *     no formato MMMM, yyyy
     * </p>
     * @param versionText versão do relatório
     * @return Div contendo o cabeçalho formatado
     */
    private Div makeRightHeader(String versionText) {
        Div div = new Div();
        Paragraph version = new Paragraph(versionText);
        version.setTextAlignment(TextAlignment.RIGHT);
        version.setHorizontalAlignment(HorizontalAlignment.RIGHT);
        Paragraph dateParagraph = new Paragraph(getDateNow());
        dateParagraph.setTextAlignment(TextAlignment.RIGHT);
        dateParagraph.setHorizontalAlignment(HorizontalAlignment.RIGHT);
        div.add(dateParagraph);
        div.add(version);
        div.setMaxWidth(80);
        div.setHorizontalAlignment(HorizontalAlignment.RIGHT);
        div.setMarginRight(0);
        return div;
    }

    private String getDateNow() {
        TimeZone zone = TimeZone.getTimeZone("GMT-03:00");
        Calendar calendar = Calendar.getInstance(zone);
        Locale locale = new Locale("pt", "BR");
        SimpleDateFormat format = new SimpleDateFormat("MMMM, yyyy", locale);
        return format.format(calendar.getTime());
    }

    public void setBorder(BlockElement element, float lenght) {
        element.setBorder(new SolidBorder(lenght));
    }

    public Paragraph makeTitulo(String text, Float fontSize, TextAlignment alignment, Boolean isFirstLineIndent) {
        if (text != null) {
            Paragraph titulo = new Paragraph(text);
            titulo.setTextAlignment(alignment);
            titulo.setFont(bold);
            titulo.setFontSize(fontSize);
            titulo.setMargin(0);
            titulo.setHorizontalAlignment(HorizontalAlignment.CENTER);
            if (isFirstLineIndent) {
                titulo.setFirstLineIndent(rightMargin);
            }
            return titulo;
        } else {
            return new Paragraph("");
        }
    }

    public Paragraph makeParagrafo(String text, Float fontSize, TextAlignment alignment, Boolean isFirstLineIndent) {
        if (text != null) {
            Paragraph paragrafo = new Paragraph(text);
            paragrafo.setTextAlignment(alignment);
            paragrafo.setFont(regular);
            paragrafo.setFontSize(fontSize);
            if (isFirstLineIndent) {
                paragrafo.setFirstLineIndent(rightMargin);
            }
            return paragrafo;
        } else {
            return new Paragraph("");
        }
    }

    public Div makeLinhaAssinaturaDelegacao(String nome, String funcao, Float fontSizeNome, Float fontSizeFuncao, Boolean isFirstLineIndent) {
        Div div = new Div();
        if (nome != null) {
            Paragraph linha = makeLinhaAssinatura(nome, TextAlignment.LEFT);
            div.add(linha);
            Paragraph pNome = new Paragraph(nome);
            pNome.setTextAlignment(TextAlignment.CENTER).setFont(bold).setFontSize(fontSizeNome);
            if (isFirstLineIndent) {
                pNome.setFirstLineIndent(rightMargin);
            }
            Paragraph pFuncao = new Paragraph(funcao == null ? "" : funcao);
            pFuncao.setTextAlignment(TextAlignment.CENTER).setFont(regular).setFontSize(fontSizeFuncao);
            if (isFirstLineIndent) {
                pFuncao.setFirstLineIndent(rightMargin);
            }
            Table tb = makeLinhaAssinaturaDelegacao2(pNome, pFuncao);
            div.add(tb).setTextAlignment(TextAlignment.LEFT).setMargin(0);
        }
        return div;
    }

    private Table makeLinhaAssinaturaDelegacao2(Paragraph pNome, Paragraph pFuncao) {
        Table tb = new Table(1);
        tb.setBorder(Border.NO_BORDER).setMargin(0);
        Cell cNome = new Cell();
        cNome.add(pNome).setHorizontalAlignment(HorizontalAlignment.CENTER).setBorder(Border.NO_BORDER).setMargin(0);
        Cell cFuncao = new Cell();
        cFuncao.add(pFuncao).setHorizontalAlignment(HorizontalAlignment.CENTER).setBorder(Border.NO_BORDER).setMargin(0);
        tb.addCell(cNome).addCell(cFuncao);
        return tb;
    }

    public Div htmltoPDF(String html) throws IOException {
        mapperTagCKEditor = new DefaultTagWorkerFactory() {
            @Override
            public ITagWorker getCustomTagWorker(IElementNode tag, ProcessorContext context) {
                if (TagConstants.IMG.equals(tag.name())) {
                    return new CustomImageWorker(tag, context);
                } else if (TagConstants.P.equals(tag.name())) {
                    Map<String, String> styles = tag.getStyles();
                    Boolean temAlinhamento = styles.containsKey("text-align");
                    return new CustomParagraphWorker(tag, context, temAlinhamento);
                } else if (TagConstants.TABLE.equals(tag.name())) {
                    return new CustomTableWorker(tag, context);
                } else {
                    return null;
                }
            }
        };
        convertHtml(html);
        return divHtmlConvert;
    }

    private void convertHtml(String html) throws IOException {
        ConverterProperties props = new ConverterProperties().setTagWorkerFactory(mapperTagCKEditor);
        divHtmlConvert = new Div();
        if (html != null) {
            List<IElement> elements = HtmlConverter.convertToElements(html, props);
            lerTags(elements);
        }
    }

    private void lerTags(List<IElement> elements) {
        for (IElement element : elements) {
            IBlockElement block = (IBlockElement) element;
            Class classe = block.getClass();
            String tipo = classe.getCanonicalName();
            Integer index = tipo.lastIndexOf('.');
            tipo = tipo.substring(index + 1);
            configuraElemento(element, tipo);
        }
    }

    private void configuraElemento(IElement element, String tipo) {
        switch (tipo) {
            case "Div":
                Div div = (Div) element;
                div.setMarginTop(0).setMarginBottom(4);
                divHtmlConvert.add(div);
                break;
            case "Paragraph":
                Paragraph p = (Paragraph) element;
                p.setMarginTop(0).setMarginBottom(4);
                divHtmlConvert.add(p);
                break;
            case "List":
                com.itextpdf.layout.element.List list = (com.itextpdf.layout.element.List) element;
                divHtmlConvert.add(list.setMarginTop(0).setMarginBottom(4).setMarginLeft(((rightMargin / 2) + 3)));
                break;
            default:
                break;
        }
    }

    public Paragraph makeLinhaAssinatura(String nome, TextAlignment alinhamento) {
        if (nome != null) {
            String linha;
            StringBuilder builder = new StringBuilder();
            builder.append("____");
            for (Integer i = 0; i < nome.length(); i++) {
                builder.append("_");
            }
            linha = builder.toString();
            Paragraph linhaAssinatura = new Paragraph(linha);
            linhaAssinatura.setTextAlignment(alinhamento);
            linhaAssinatura.setMarginBottom(0);
            return linhaAssinatura;
        } else {
            return new Paragraph("");
        }
    }

    /**
     * Cria um sibtítulo de nível 1, possui auto contagem de lista
     * @param text Texto que será exibido
     * @param alignment Alinhamento do texto
     * @param fontSize tamanho da Fonte
     * @return
     */
    public Paragraph makeSubTitle(String text, TextAlignment alignment, float fontSize) {
        Paragraph subTitle = new Paragraph(subTitleNumber + ". " + text);
        subTitleNumber++;
        subTitle.setTextAlignment(alignment);
        subTitle.setFont(bold);
        subTitle.setFontSize(fontSize);
        subTitle.setMargin(rightMargin);
        return subTitle;
    }

    public void makeTable(int columns) {
        table = new Table(columns);
        table
    }


    protected static class FooterHandler implements IEventHandler {
        private String footerText;
        private Float marginLeft;
        private PdfFont font;
        private Float y;

        FooterHandler(String footerText, Float leftMargin, PdfFont font, Float y) {
            this.footerText = footerText;
            this.marginLeft = leftMargin;
            this.font = font;
            this.y = y;
        }

        @Override
        public void handleEvent(Event event) {
            if (event instanceof PdfDocumentEvent) {
                PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
                PdfPage page = docEvent.getPage();
                Rectangle pageSize = page.getPageSize();
                PdfDocument pdfDoc = ((PdfDocumentEvent) event).getDocument();
                PdfCanvas pdfCanvas = new PdfCanvas(page.newContentStreamBefore(), page.getResources(), pdfDoc);
                Canvas canvas = new Canvas(pdfCanvas, pdfDoc, pageSize);
                canvas.setFont(this.font);
                canvas.setFontSize(10);
                canvas.showTextAligned(footerText, marginLeft, pageSize.getBottom() + y, TextAlignment.LEFT, VerticalAlignment.BOTTOM, 0);
            }
        }
    }

    protected static class PageSizeModifier implements IEventHandler {

        private Document doc;
        private int interval;
        private int counter;
        private PageSize pageSize;

        PageSizeModifier(Document doc, int interval, PageSize pageSize) {
            this.doc = doc;
            this.interval = interval;
            this.counter = 1;
            this.pageSize = pageSize;
        }

        @Override
        public void handleEvent(Event event) {
            if (counter == interval) {
                doc.getPdfDocument().setDefaultPageSize(pageSize);
                if (event instanceof PdfDocumentEvent) {
                    ((PdfDocumentEvent) event).getPage().setMediaBox(pageSize);
                    ((PdfDocumentEvent) event).getPage().setTrimBox(pageSize);
                }
                counter = 1;
            } else {
                counter++;
            }
        }
    }

    public Paragraph makeEspaco() {
        return new Paragraph("\n");
    }

    /**
     * @return Retorna o atributo footerHandler
     */
    public FooterHandler getFooterHandler() {
        return footerHandler;
    }

    /**
     * @param versaoFooter Atribui o valor do parâmetro no atributo footerHandler
     */
    public void setFooterHandler(String versaoFooter, Float y) {
        this.footerHandler = new FooterHandler(versaoFooter, leftMargin, regular, y);
    }

    /**
     * @return Retorna o atributo pageSizeModifier
     */
    public PageSizeModifier getPageSizeModifier() {
        return pageSizeModifier;
    }

    /**
     * @param document Atribui o valor do parâmetro no atributo document
     * @param pageSize Atribui o valor do parâmetro no atributo pageSize
     */
    public void setPageSizeModifier(Document document, PageSize pageSize) {
        this.pageSizeModifier = new PageSizeModifier(document, 1, pageSize);
    }

    /**
     * @return Retorna o atributo topMargin
     */
    public Float getTopMargin() {
        return topMargin;
    }

    /**
     * @param topMargin Atribui o valor do parâmetro no atributo topMargin
     */
    public void setTopMargin(Float topMargin) {
        this.topMargin = topMargin;
    }

    /**
     * @return Retorna o atributo rightMargin
     */
    public Float getRightMargin() {
        return rightMargin;
    }

    /**
     * @param rightMargin Atribui o valor do parâmetro no atributo rightMargin
     */
    public void setRightMargin(Float rightMargin) {
        this.rightMargin = rightMargin;
    }

    /**
     * @return Retorna o atributo bottomMargin
     */
    public Float getBottomMargin() {
        return bottomMargin;
    }

    /**
     * @param bottomMargin Atribui o valor do parâmetro no atributo bottomMargin
     */
    public void setBottomMargin(Float bottomMargin) {
        this.bottomMargin = bottomMargin;
    }

    /**
     * @return Retorna o atributo leftMargin
     */
    public Float getLeftMargin() {
        return leftMargin;
    }

    /**
     * @param leftMargin Atribui o valor do parâmetro no atributo leftMargin
     */
    public void setLeftMargin(Float leftMargin) {
        this.leftMargin = leftMargin;
    }
}
