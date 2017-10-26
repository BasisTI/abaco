package br.com.basis.abaco.utils;

/**
 * Created by roman on 10/25/17.
 */
public class StringUtils {

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

}
