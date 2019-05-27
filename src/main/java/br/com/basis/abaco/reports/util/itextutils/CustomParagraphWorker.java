package br.com.basis.abaco.reports.util.itextutils;

import com.itextpdf.html2pdf.attach.ProcessorContext;
import com.itextpdf.html2pdf.attach.impl.tags.PTagWorker;
import com.itextpdf.layout.IPropertyContainer;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.styledxmlparser.node.IElementNode;

public class CustomParagraphWorker extends PTagWorker {
    private Boolean processed = false;
    private Boolean temAlinhamento = false;
    public CustomParagraphWorker(IElementNode element, ProcessorContext context, Boolean temAlinhamento) {
        super(element, context);
        this.temAlinhamento = temAlinhamento;
    }

    @Override
    public IPropertyContainer getElementResult() {
        Paragraph result = ((Paragraph)super.getElementResult());
        if (!processed) {
            if (!this.temAlinhamento) {
                Float recuoParagrafo = (float)0.6 * 72;
                result.setFirstLineIndent(recuoParagrafo);
                result.setTextAlignment(TextAlignment.JUSTIFIED);
            }
            processed = true;
        }
        return result;
    }
}
