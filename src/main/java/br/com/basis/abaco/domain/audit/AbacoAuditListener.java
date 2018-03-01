package br.com.basis.abaco.domain.audit;

import java.time.ZonedDateTime;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

public class AbacoAuditListener {

    @PrePersist
    public void setCreatedOn(AbacoAuditable auditable) {
        AbacoAudit audit = auditable.getAudit();

        if (audit == null) {
            audit = new AbacoAudit();
            auditable.setAudit(audit);
        }

        audit.setCreatedOn(ZonedDateTime.now());
    }

    @PreUpdate
    public void setUpdadtedOn(AbacoAuditable auditable) {
        AbacoAudit audit = auditable.getAudit();
        audit.setUpdatedOn(ZonedDateTime.now());
    }
}
