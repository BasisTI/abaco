package br.com.basis.abaco.reports.util.itextutils;

import com.itextpdf.html2pdf.attach.ProcessorContext;
import com.itextpdf.html2pdf.attach.impl.tags.TableTagWorker;
import com.itextpdf.layout.IPropertyContainer;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.styledxmlparser.node.IElementNode;

public class CustomTableWorker  extends TableTagWorker {
    private Boolean processed = false;
    public CustomTableWorker(IElementNode element, ProcessorContext context) {
        super(element, context);
    }

    @Override
    public IPropertyContainer getElementResult() {
        Table result = ((Table)super.getElementResult());
        if (!processed) {
            result.setHorizontalAlignment(HorizontalAlignment.CENTER);
            result.setBorder(new SolidBorder(1));
            for (Integer i = 0; i < result.getNumberOfRows(); i++) {
                for (Integer j = 0; j < result.getNumberOfColumns(); j++) {
                    result.getCell(i,j).setBorderBottom(new SolidBorder(1));
                    result.getCell(i,j).setBorderTop(new SolidBorder(1));
                    result.getCell(i,j).setBorderLeft(new SolidBorder(1));
                    result.getCell(i,j).setBorderRight(new SolidBorder(1));
                }
            }
            processed = true;
        }
        return result;
    }
}
