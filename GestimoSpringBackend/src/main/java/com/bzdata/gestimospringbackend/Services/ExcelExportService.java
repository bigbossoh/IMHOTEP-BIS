package com.bzdata.gestimospringbackend.Services;

import java.io.FileNotFoundException;
import java.time.LocalDate;

public interface ExcelExportService {

    byte[] genererRegistreRecettesDepenses(Long siteId, LocalDate debut, LocalDate fin) throws FileNotFoundException;
}
