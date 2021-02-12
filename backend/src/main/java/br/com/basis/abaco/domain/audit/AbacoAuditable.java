package br.com.basis.abaco.domain.audit;

public interface AbacoAuditable {

    AbacoAudit getAudit();
    
    void setAudit(AbacoAudit audit);
    
}
