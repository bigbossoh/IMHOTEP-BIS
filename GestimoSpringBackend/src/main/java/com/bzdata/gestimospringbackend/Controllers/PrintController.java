package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;

import com.bzdata.gestimospringbackend.Services.PrintService;

import java.io.ByteArrayInputStream;
import org.springframework.core.io.InputStreamResource;
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
import net.sf.jasperreports.engine.JRException;

@RestController
@RequestMapping(APP_ROOT + "/print")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")

@CrossOrigin(origins = "*")
public class PrintController {
        final PrintService printService;

        @GetMapping("/quittance/{id}")
        public ResponseEntity<byte[]> sampleQuitance(@PathVariable("id") Long id)
                        throws FileNotFoundException, JRException, SQLException {

                byte[] donnees = printService.quittanceLoyer(id);
                System.out.println(donnees);
                return ResponseEntity.ok(donnees);
        }

        @GetMapping(path = "/bail/{idBail}", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<InputStreamResource> printBail(@PathVariable("idBail") Long idBail) {
                ByteArrayInputStream bis = new ByteArrayInputStream(
                                this.printService.printBailProfessionnel(idBail));
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=bail-professionnel-" + idBail + ".pdf");
                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(new InputStreamResource(bis));
        }

        @GetMapping(path = "/quittancegrouper/{periode}/{idAgence}", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<InputStreamResource> quittancePeriode(
                        @PathVariable("periode") String periode, @PathVariable("idAgence") Long idAgence)
                        throws FileNotFoundException, JRException, SQLException, IOException {
                ByteArrayInputStream bis = new ByteArrayInputStream(
                                this.printService.quittancePeriodeString(periode, idAgence));
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=Quittance-de-" + periode + ".pdf");
                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(new InputStreamResource(bis));
        }
             
   
        @GetMapping(path = "/recureservation/{idEncaissement}/{idAgence}/{proprio}", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<InputStreamResource> recuReservation(
                        @PathVariable("idEncaissement") Long idEncaissement, @PathVariable("idAgence") Long idAgence,
                        @PathVariable("proprio") String proprio)
                        throws FileNotFoundException, JRException, SQLException, IOException {
              
                ByteArrayInputStream bis = new ByteArrayInputStream(
                                this.printService.recuReservation(idEncaissement, proprio,idAgence));
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=recu_de_" + idEncaissement + ".pdf");
                return ResponseEntity.ok()
                                // CONTENT-DISPOSITION
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(new InputStreamResource(bis));
        }
           @GetMapping(path = "/recuReservationParIdReservation/{idReservation}/{idAgence}/{proprio}", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<InputStreamResource> recuReservationParIdReservation(
                        @PathVariable("idReservation") Long idReservation, @PathVariable("idAgence") Long idAgence,
                        @PathVariable("proprio") String proprio)
                        throws FileNotFoundException, JRException, SQLException, IOException {
              
                ByteArrayInputStream bis = new ByteArrayInputStream(
                                this.printService.recuReservationParIdReservation(idReservation, proprio,idAgence));
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=recu_de_" + idReservation + ".pdf");
                return ResponseEntity.ok()
                                // CONTENT-DISPOSITION
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(new InputStreamResource(bis));
        }      
              
        @GetMapping(path = "/recupaiment/{idEncaissement}", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<InputStreamResource> recuPaiment(@PathVariable("idEncaissement") Long idEncaissement)
                        throws FileNotFoundException, JRException, SQLException, IOException {
                // byte[] bytes = this.printService.quittancePeriodeString(periode, idAgence,
                // proprio);
                ByteArrayInputStream bis = new ByteArrayInputStream(
                                this.printService.printRecuPaiement(idEncaissement));
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=Recu-" + idEncaissement + ".pdf");
                return ResponseEntity.ok()
                                // CONTENT-DISPOSITION
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(new InputStreamResource(bis));
        }
}
