package br.com.basis.abaco.utils;

import org.apache.commons.io.FilenameUtils;

import java.text.Normalizer;

/**
 * Created by roman on 10/25/17.
 */
public final class StringUtils {

    public static final String IMG_FORMAT="IMAGE";

    public static final String VIDEO_FORMAT="VIDEO";

    public static final String DOC_FORMAT="DOC";

    public static final String UNKNOWN_FORMAT="OTHER";

    public static boolean isEmptyString(String string) {
        return string == null || string.isEmpty();
    }

    //Disable default constructor
    private StringUtils(){

    }

    public static int getDERRLRValue(String value){
        if (value.contains("\n")) {
            return value.split("\n").length;
        }

        if (value.matches("^-?\\d+$")){
            return Integer.parseInt(value);
        }

        return 1;
    }


    public static String getFormatFile(String filename){
        String ext = FilenameUtils.getExtension(filename).toLowerCase();
        if (validaFormatoImage(ext, "jpg", "png", "bmp", "gif")){ return IMG_FORMAT;}
        if (validaFormatoVideo(ext, "avi", "mpg", "mpeg", "mp4")) { return VIDEO_FORMAT;}
        if (validaFormatoDocumento(ext, "doc", "docx", "rtf", "txt")){ return DOC_FORMAT;}

        return StringUtils.UNKNOWN_FORMAT;
    }

    private static boolean validaFormatoDocumento(String ext, String doc, String docx, String rtf, String txt) {
        return ext.equals(doc) || ext.equals(docx) || ext.equals(rtf) || ext.equals(txt);
    }

    private static boolean validaFormatoVideo(String ext, String avi, String mpg, String mpeg, String mp4) {
        return ext.equals(avi) || ext.equals(mpg) || ext.equals(mpeg) || ext.equals(mp4);
    }

    private static boolean validaFormatoImage(String ext, String jpg, String png, String bmp, String gif) {
        return ext.equals(jpg) || ext.equals(png) || ext.equals(bmp) || ext.equals(gif);
    }

    public static String removerAcentos(String str) {
        return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
    }

}
