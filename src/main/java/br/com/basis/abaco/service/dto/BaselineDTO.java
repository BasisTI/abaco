package br.com.basis.abaco.service.dto;

/**
 * @author eduardo.andrade
 * @since 04/07/2018
 */
public class BaselineDTO {

    private String sistema;
    
    private String pfTotal;
    
    private String pfAPagar;
    
    private String garantia;

    public String getSistema() {
        return sistema;
    }

    public void setSistema(String sistema) {
        this.sistema = sistema;
    }

    public String getPfTotal() {
        return pfTotal;
    }

    public void setPfTotal(String pfTotal) {
        this.pfTotal = pfTotal;
    }

    public String getPfAPagar() {
        return pfAPagar;
    }

    public void setPfAPagar(String pfAPagar) {
        this.pfAPagar = pfAPagar;
    }

    public String getGarantia() {
        return garantia;
    }

    public void setGarantia(String garantia) {
        this.garantia = garantia;
    }

}
