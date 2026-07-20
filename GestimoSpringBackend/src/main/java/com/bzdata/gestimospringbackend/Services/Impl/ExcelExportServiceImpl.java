package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.EncaissementPrincipal;
import com.bzdata.gestimospringbackend.Models.Site;
import com.bzdata.gestimospringbackend.Models.SuivieDepense;
import com.bzdata.gestimospringbackend.Services.ExcelExportService;
import com.bzdata.gestimospringbackend.exceptions.EntityNotFoundException;
import com.bzdata.gestimospringbackend.repository.EncaissementPrincipalRepository;
import com.bzdata.gestimospringbackend.repository.SiteRepository;
import com.bzdata.gestimospringbackend.repository.SuivieDepenseRepository;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

/**
 * Génère le classeur "Registre Recettes et Dépenses" (.xlsm) d'un site pour une période donnée,
 * à partir des encaissements et dépenses déjà enregistrés dans Gestimo, en remplissant un modèle
 * conservant les feuilles, formules et macros du classeur de référence.
 */
@Service
@Transactional(readOnly = true)
@AllArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExcelExportServiceImpl implements ExcelExportService {

    static final String TEMPLATE_PATH = "classpath:templates/excel/registre-recettes-depenses-template.xlsm";
    static final DateTimeFormatter IDENTIFIANT_DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");
    static final ZoneId DEFAULT_ZONE = ZoneId.systemDefault();

    // Colonnes (0-indexées) de la feuille "Saisie Recettes"
    static final int REC_COL_ID = 1;
    static final int REC_COL_IDENTIFIANT = 2;
    static final int REC_COL_DATE_ENREGISTREMENT = 3;
    static final int REC_COL_DATE = 4;
    static final int REC_COL_DESIGNATION_LOT = 5;
    static final int REC_COL_TYPE_EXPLOITATION = 6;
    static final int REC_COL_TYPE_RECETTE = 7;
    static final int REC_COL_MONTANT = 8;
    static final int REC_COL_DEBUT_PERIODE = 9;
    static final int REC_COL_FIN_PERIODE = 10;
    static final int REC_COL_MODE_PAIEMENT = 11;
    static final int REC_COL_COMMENTAIRES = 13;

    // Colonnes (0-indexées) de la feuille "Saisie Depenses"
    static final int DEP_COL_ID = 1;
    static final int DEP_COL_IDENTIFIANT = 2;
    static final int DEP_COL_DATE_ENREGISTREMENT = 3;
    static final int DEP_COL_DATE = 4;
    static final int DEP_COL_SOCIETE_DEBITRICE = 5;
    static final int DEP_COL_SITE_CONCERNE = 6;
    static final int DEP_COL_MONTANT = 7;
    static final int DEP_COL_MODE_PAIEMENT = 8;
    static final int DEP_COL_CATEGORIE = 9;
    static final int DEP_COL_COMMENTAIRES = 11;

    ResourceLoader resourceLoader;
    final SiteRepository siteRepository;
    final EncaissementPrincipalRepository encaissementPrincipalRepository;
    final SuivieDepenseRepository suivieDepenseRepository;

    @Override
    public byte[] genererRegistreRecettesDepenses(Long siteId, LocalDate debut, LocalDate fin) throws FileNotFoundException {
        Site site = siteRepository.findById(siteId)
            .orElseThrow(() -> new EntityNotFoundException("Site introuvable avec l'id " + siteId));

        List<EncaissementPrincipal> recettes = encaissementPrincipalRepository.findBySiteAndPeriode(siteId, debut, fin);
        // Les dépenses (SuivieDepense) ne sont actuellement jamais rattachées à un bien/site dans
        // l'usage réel (bienImmobilierId et chapitreSuivis toujours nuls) : on remonte donc toutes
        // les dépenses de l'agence sur la période, sans filtrage par site, et "Site Concerné" reste
        // vide dans l'export tant que cette donnée n'existe pas.
        List<SuivieDepense> depenses = suivieDepenseRepository
            .findAllByIdAgenceAndDateEncaissementBetweenOrderByIdDesc(site.getIdAgence(), debut, fin);

        try (InputStream template = openClasspathResource(TEMPLATE_PATH);
             XSSFWorkbook workbook = new XSSFWorkbook(template)) {

            remplirSaisieRecettes(workbook, recettes, site);
            remplirSaisieDepenses(workbook, depenses, site);
            // Les colonnes formules (statistiques d'occupation, etc.) doivent se recalculer avec
            // les nouvelles données plutôt que de garder les valeurs mises en cache par le modèle.
            workbook.setForceFormulaRecalculation(true);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException exception) {
            throw new IllegalStateException("Impossible de générer le registre recettes/dépenses", exception);
        }
    }

    private void remplirSaisieRecettes(XSSFWorkbook workbook, List<EncaissementPrincipal> recettes, Site site) {
        Sheet sheet = requireSheet(workbook, "Saisie Recettes");
        int numero = 1;
        for (EncaissementPrincipal recette : recettes) {
            Row row = obtenirLigne(sheet, 4 + numero - 1);
            Bienimmobilier bien = resoudreBien(recette);
            LocalDate dateEnregistrement = toLocalDate(recette.getCreationDate());

            setCell(row, REC_COL_ID, numero);
            setCell(row, REC_COL_IDENTIFIANT, String.format(
                "%s_Rev_%s_%d",
                dateEnregistrement.format(IDENTIFIANT_DATE_FORMAT),
                site.getAbrSite(),
                numero
            ));
            setCell(row, REC_COL_DATE_ENREGISTREMENT, dateEnregistrement);
            setCell(row, REC_COL_DATE, recette.getDateEncaissement());
            setCell(row, REC_COL_DESIGNATION_LOT, bien != null ? bien.getNomCompletBienImmobilier() : "");
            setCell(row, REC_COL_TYPE_EXPLOITATION, bien != null && bien.isBienMeublerResidence() ? "Meublé" : "Location");
            // TODO: pas de champ "type de recette" (Loyer / Nuité, Caution, Autre) en base pour
            // l'instant ; valeur par défaut à affiner avec le métier.
            setCell(row, REC_COL_TYPE_RECETTE, "Loyer / Nuité");
            setCell(row, REC_COL_MONTANT, recette.getMontantEncaissement());
            AppelLoyer appelLoyer = recette.getAppelLoyerEncaissement();
            if (appelLoyer != null) {
                setCell(row, REC_COL_DEBUT_PERIODE, appelLoyer.getDateDebutMoisAppelLoyer());
                setCell(row, REC_COL_FIN_PERIODE, appelLoyer.getDateFinMoisAppelLoyer());
            }
            setCell(row, REC_COL_MODE_PAIEMENT, libelleModePaiement(
                recette.getModePaiement() != null ? recette.getModePaiement().name() : null,
                "Espèce - Caisse"
            ));
            setCell(row, REC_COL_COMMENTAIRES, recette.getIntituleDepense());

            numero++;
        }
    }

    private void remplirSaisieDepenses(XSSFWorkbook workbook, List<SuivieDepense> depenses, Site site) {
        Sheet sheet = requireSheet(workbook, "Saisie Depenses");
        int numero = 1;
        for (SuivieDepense depense : depenses) {
            Row row = obtenirLigne(sheet, 4 + numero - 1);
            LocalDate dateEnregistrement = toLocalDate(depense.getCreationDate());

            setCell(row, DEP_COL_ID, numero);
            setCell(row, DEP_COL_IDENTIFIANT, String.format(
                "%s_Dep_%s_%d",
                dateEnregistrement.format(IDENTIFIANT_DATE_FORMAT),
                site.getAbrSite(),
                numero
            ));
            setCell(row, DEP_COL_DATE_ENREGISTREMENT, dateEnregistrement);
            setCell(row, DEP_COL_DATE, depense.getDatePaiement() != null ? depense.getDatePaiement() : depense.getDateEncaissement());
            // TODO: pas de champ "société débitrice" (Magiser / SeveInvest) fiable sur
            // SuivieDepense pour l'instant ; à faire préciser par le métier.
            setCell(row, DEP_COL_SOCIETE_DEBITRICE, "");
            // "Site Concerné" laissé vide : les dépenses ne sont pas rattachées à un site dans
            // les données actuelles (voir commentaire sur genererRegistreRecettesDepenses).
            setCell(row, DEP_COL_SITE_CONCERNE, "");
            setCell(row, DEP_COL_MONTANT, depense.getMontantDepense() != null ? depense.getMontantDepense() : 0d);
            setCell(row, DEP_COL_MODE_PAIEMENT, libelleModePaiement(depense.getModePaiement(), "Espèce - Hors Caisse"));
            setCell(row, DEP_COL_CATEGORIE, depense.getCategorieDepense());
            // descriptionDepense est presque toujours vide dans les données réelles ; le libellé
            // saisi par l'utilisateur se trouve dans "designation".
            setCell(row, DEP_COL_COMMENTAIRES,
                depense.getDescriptionDepense() != null ? depense.getDescriptionDepense() : depense.getDesignation());

            numero++;
        }
    }

    private Bienimmobilier resoudreBien(EncaissementPrincipal recette) {
        AppelLoyer appelLoyer = recette.getAppelLoyerEncaissement();
        if (appelLoyer == null) {
            return null;
        }
        BailLocation bail = appelLoyer.getBailLocationAppelLoyer();
        return bail != null ? bail.getBienImmobilierOperation() : null;
    }

    /**
     * Le classeur ne connaît que 4 modes de paiement ("Espèce - Caisse", "Espèce - Hors Caisse",
     * "Chèque", "Virement", voir la feuille "Listes"), alors que ModePaiement (recettes) et le
     * champ libre modePaiement (dépenses, mêmes noms de constantes en pratique) distinguent en
     * plus la société (Magiser/SeveInvest). MOBILE_MONEY_* n'a pas d'équivalent dans le classeur ;
     * on le rattache à "Virement" par défaut. Une valeur non reconnue est recopiée telle quelle.
     */
    private String libelleModePaiement(String modePaiementBrut, String libelleEspece) {
        if (modePaiementBrut == null || modePaiementBrut.isBlank()) {
            return "";
        }
        String normalise = modePaiementBrut.trim().toUpperCase(Locale.ROOT);
        if (normalise.startsWith("ESPECE") || normalise.startsWith("ESPESE")) {
            return libelleEspece;
        }
        if (normalise.startsWith("CHEQUE")) {
            return "Chèque";
        }
        if (normalise.startsWith("VIREMENT")) {
            return "Virement";
        }
        if (normalise.startsWith("MOBILE_MONEY")) {
            return "Virement";
        }
        return modePaiementBrut;
    }

    private Sheet requireSheet(XSSFWorkbook workbook, String name) {
        Sheet sheet = workbook.getSheet(name);
        if (sheet == null) {
            throw new IllegalStateException("Feuille introuvable dans le modèle Excel : " + name);
        }
        return sheet;
    }

    private Row obtenirLigne(Sheet sheet, int rowIndex) {
        Row row = sheet.getRow(rowIndex);
        return row != null ? row : sheet.createRow(rowIndex);
    }

    private void setCell(Row row, int columnIndex, String value) {
        if (value == null) {
            return;
        }
        row.getCell(columnIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(value);
    }

    private void setCell(Row row, int columnIndex, double value) {
        row.getCell(columnIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(value);
    }

    private void setCell(Row row, int columnIndex, int value) {
        row.getCell(columnIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).setCellValue(value);
    }

    private void setCell(Row row, int columnIndex, LocalDate value) {
        if (value == null) {
            return;
        }
        Cell cell = row.getCell(columnIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
        cell.setCellValue(value);
    }

    private LocalDate toLocalDate(Instant instant) {
        return instant.atZone(DEFAULT_ZONE).toLocalDate();
    }

    private InputStream openClasspathResource(String classpathLocation) throws FileNotFoundException {
        try {
            return resourceLoader.getResource(classpathLocation).getInputStream();
        } catch (IOException exception) {
            FileNotFoundException wrapped = new FileNotFoundException(
                "Impossible de charger la ressource " + classpathLocation
            );
            wrapped.initCause(exception);
            throw wrapped;
        }
    }
}
