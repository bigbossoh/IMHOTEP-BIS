package com.bzdata.gestimospringbackend.Services.Impl;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperReport;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class PrintTemplateCompilationTest {

  @Test
  void individualRentReceiptTemplateCompiles() throws Exception {
    ClassPathResource template = new ClassPathResource(
      "templates/print/quittance_appel_loyer_indiv_pour_mail.jrxml"
    );
    String jrxml = template.getContentAsString(StandardCharsets.UTF_8);

    assertFalse(jrxml.contains("markup=\"\""));

    try (InputStream jrxmlStream = template.getInputStream()) {
      JasperReport report = JasperCompileManager.compileReport(jrxmlStream);

      assertNotNull(report);
    }
  }
}
