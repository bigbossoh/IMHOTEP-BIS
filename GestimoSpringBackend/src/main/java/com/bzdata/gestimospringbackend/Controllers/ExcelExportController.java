package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.io.FileNotFoundException;
import java.time.LocalDate;

import com.bzdata.gestimospringbackend.Services.ExcelExportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping(APP_ROOT + "/exports")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class ExcelExportController {

    static final MediaType XLSM_MEDIA_TYPE = MediaType.valueOf("application/vnd.ms-excel.sheet.macroEnabled.12");

    final ExcelExportService excelExportService;

    @GetMapping(path = "/registre-caisse/{siteId}/{debut}/{fin}")
    public ResponseEntity<byte[]> registreRecettesDepenses(
            @PathVariable("siteId") Long siteId,
            @PathVariable("debut") LocalDate debut,
            @PathVariable("fin") LocalDate fin) throws FileNotFoundException {

        byte[] donnees = excelExportService.genererRegistreRecettesDepenses(siteId, debut, fin);
        HttpHeaders headers = new HttpHeaders();
        headers.add(
            "Content-Disposition",
            "attachment; filename=registre-caisse-" + siteId + "-" + debut + "-" + fin + ".xlsm"
        );
        return ResponseEntity.ok()
            .headers(headers)
            .contentType(XLSM_MEDIA_TYPE)
            .body(donnees);
    }
}
