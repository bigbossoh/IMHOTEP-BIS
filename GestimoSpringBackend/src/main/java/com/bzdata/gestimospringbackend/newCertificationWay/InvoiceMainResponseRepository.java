package com.bzdata.gestimospringbackend.newCertificationWay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceMainResponseRepository extends JpaRepository<InvoiceMainResponse, String> {

    InvoiceMainResponse findByInvoice(InvoiceFneCertify invoice);
}
