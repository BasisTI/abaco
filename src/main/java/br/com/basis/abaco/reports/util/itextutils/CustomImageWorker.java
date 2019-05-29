package br.com.basis.abaco.reports.util.itextutils;

import com.itextpdf.html2pdf.attach.ProcessorContext;
import com.itextpdf.html2pdf.attach.impl.tags.ImgTagWorker;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.layout.IPropertyContainer;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.styledxmlparser.node.IElementNode;

public class CustomImageWorker extends ImgTagWorker {
    private Boolean processed = false;
    public CustomImageWorker(IElementNode element, ProcessorContext context) {
        super(element, context);
    }

    @Override
    public IPropertyContainer getElementResult() {
        Image result = ((Image)super.getElementResult());
        if (!processed) {
            float imageWidth = result.getImageScaledWidth();
            Float topMargin, rightMargin, bottomMargin, leftMargin;
            topMargin = (float)37.8;
            rightMargin = (float)56.7;
            bottomMargin = (float)75.6;
            leftMargin = (float)113.38;
            float pageMarginHor = leftMargin + rightMargin;
            float pageMarginVer = topMargin + bottomMargin;
            float maxWidth = PageSize.A4.getWidth() - pageMarginHor;
            float maxHeight = PageSize.A4.getHeight() - pageMarginVer;
            if (imageWidth * 0.75 > maxWidth) { result.scaleToFit(maxWidth / 0.75f, maxHeight / 0.75f);}
            result.setHorizontalAlignment(HorizontalAlignment.CENTER);
            processed = true;
        }
        return result;
    }
}
