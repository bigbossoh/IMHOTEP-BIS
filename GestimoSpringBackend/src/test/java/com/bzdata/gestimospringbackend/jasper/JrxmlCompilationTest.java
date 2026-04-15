package com.bzdata.gestimospringbackend.jasper;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.InputStream;
import net.sf.jasperreports.engine.JasperCompileManager;
import org.junit.jupiter.api.Test;

class JrxmlCompilationTest {

  @Test
  void templatesJasperCompilent() throws Exception {
    String[] templates = {
      "templates/print/Recu_paiement.jrxml",
      "templates/print/quittanceappelloyer.jrxml",
      "templates/print/quittance_appel_loyer_indiv_pour_mail.jrxml",
      "templates/print/recupaiementappelloyer.jrxml",
      "templates/print/quittancereservation.jrxml"
    };

    for (String template : templates) {
      try (InputStream jrxmlStream =
        Thread.currentThread().getContextClassLoader().getResourceAsStream(template)) {
        assertNotNull(jrxmlStream, "JRXML introuvable sur le classpath: " + template);
        JasperCompileManager.compileReport(jrxmlStream);
      }
    }
  }
}
