package com.bzdata.gestimospringbackend.company.controller;

import static com.bzdata.gestimospringbackend.common.constant.SecurityConstant.APP_ROOT;

import java.util.List;

import com.bzdata.gestimospringbackend.company.dto.response.AgenceImmobilierDTO;
import com.bzdata.gestimospringbackend.company.dto.request.AgenceRequestDto;
import com.bzdata.gestimospringbackend.company.dto.response.AgenceResponseDto;
import com.bzdata.gestimospringbackend.company.dto.request.ImageLogoDto;
import com.bzdata.gestimospringbackend.company.service.AgenceImmobilierService;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(APP_ROOT + "/agences")
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "gestimoapi")
@CrossOrigin(origins = "*")
public class AgenceController {
    private final AgenceImmobilierService agenceImmobilierService;
    // private final ImagesService imagesService;

    @PostMapping("/signup")
    public ResponseEntity<AgenceImmobilierDTO> authenticateAgence(@RequestBody AgenceRequestDto request) {
        log.info("We are going to save a new agence {}", request);
        return ResponseEntity.ok(agenceImmobilierService.saveUneAgence(request));
    }

    @PostMapping(value = "/{idAgence}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AgenceImmobilierDTO> uploadAgenceLogo(
            @PathVariable("idAgence") Long idAgence,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "idImage", required = false) Long idImage) throws IOException {
        ImageLogoDto request = new ImageLogoDto();
        request.setAgenceImmobiliere(idAgence);
        request.setIdImage(idImage);
        request.setFile(file);
        request.setNameImage(file.getOriginalFilename());
        request.setTypeImage(file.getContentType());
        return ResponseEntity.ok(agenceImmobilierService.uploadLogoAgence(request));
    }

    @GetMapping("/getagencebyid/{id}")
    public ResponseEntity<AgenceResponseDto> getAgenceByIDAgence(@PathVariable("id") Long id) {
        log.info("We are going to get back one agence by ID {}", id);
        return ResponseEntity.ok(agenceImmobilierService.findAgenceById(id));
    }

    @GetMapping("/getagencebyemail/{email}")
    public ResponseEntity<AgenceImmobilierDTO> getAgenceByEmailAgence(@PathVariable("email") String email) {
        return ResponseEntity.ok(agenceImmobilierService.findAgenceByEmail(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AgenceImmobilierDTO>> getAllAgences() {
        log.info("get all agences");
        return ResponseEntity.ok(agenceImmobilierService.listAllAgences());
    }

    @GetMapping("/all/{idAgence}")
    public ResponseEntity<List<AgenceImmobilierDTO>> getAllAgenceByOrderAgence(
            @PathVariable("idAgence") Long idAgence) {
        log.info("get all agence by Order");
        return ResponseEntity.ok(agenceImmobilierService.listOfAgenceOrderByNomAgenceAsc(idAgence));
    }

    @DeleteMapping("/deleteagence/{id}")
    public String deleteAgenceByIdAgence(@PathVariable("id") Long id) {
        agenceImmobilierService.deleteAgence(id);
        return "procedure of deleting is executing....";
    }
}
