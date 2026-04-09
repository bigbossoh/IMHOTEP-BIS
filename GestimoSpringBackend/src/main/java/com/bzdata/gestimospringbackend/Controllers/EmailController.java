package com.bzdata.gestimospringbackend.Controllers;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.io.FileNotFoundException;
import java.sql.SQLException;

import com.bzdata.gestimospringbackend.Services.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import net.sf.jasperreports.engine.JRException;

@RestController
@RequestMapping(APP_ROOT + "/envoimail")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SecurityRequirement(name = "gestimoapi")
public class EmailController {

    final EmailService emailService;
    @PostMapping("/sendquittancebymail/{id}")
    public ResponseEntity<Boolean> sendMailQuittanceWithAttachment(@PathVariable("id")  Long id) {
        return ResponseEntity.ok(emailService.sendMailQuittanceWithAttachment(id));
    }

    @PostMapping("/sendmailgrouper/{periode}/{idAgence}")
    public ResponseEntity<Boolean> sendMailGrouperWithAttachment(@PathVariable("periode") String periode,@PathVariable("idAgence") Long idAgence) throws FileNotFoundException, JRException, SQLException {
        return ResponseEntity.ok(emailService.sendMailGrouperWithAttachment(periode,idAgence));
    }

    @PostMapping("/sendmailrelance/{id}")
    public ResponseEntity<Boolean> sendMailRelance(@PathVariable("id") Long id) {
        return ResponseEntity.ok(emailService.sendMailRelanceLoyer(id));
    }

    @PostMapping("/sendmailrelanceglobale/{id}")
    public ResponseEntity<Boolean> sendMailRelanceGlobale(@PathVariable("id") Long id) {
        return ResponseEntity.ok(emailService.sendMailRelanceGlobaleLoyer(id));
    }
}
