package br.com.basis.abaco.utils;

import org.apache.commons.io.FilenameUtils;

/**
 * Created by roman on 10/25/17.
 */
public class StringUtils {

    public static final String IMG_FORMAT="IMAGE";

    public static final String VIDEO_FORMAT="VIDEO";

    public static final String DOC_FORMAT="DOC";

    public static final String UNKNOWN_FORMAT="UNKNOWN";

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
        if (ext.equals("jpg") || ext.equals("png") || ext.equals("bmp")|| ext.equals("gif")) return IMG_FORMAT;
        if (ext.equals("avi") || ext.equals("mpg") || ext.equals("mpeg")|| ext.equals("mp4")) return VIDEO_FORMAT;
        if (ext.equals("doc") || ext.equals("docx") || ext.equals("rtf")|| ext.equals("txt")) return DOC_FORMAT;

        return StringUtils.UNKNOWN_FORMAT;
    }


}
