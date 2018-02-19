package br.com.basis.abaco.utils;

import org.springframework.data.domain.Sort;

public abstract class PageUtils {
    
    public static  Sort.Direction getSortDirection(String order) {
        Sort.Direction sortOrder = null;
        
        switch(order) {
            case "asc": {
                sortOrder = Sort.Direction.ASC;
            } break;
            case "desc": {
                sortOrder = Sort.Direction.DESC;
            }break;
            default: {
                // Do nothing
            }
        }
        
        return sortOrder;
    }
}
