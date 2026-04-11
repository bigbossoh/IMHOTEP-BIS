package com.bzdata.gestimospringbackend.Services.Impl;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyerPeriodPrintView;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyerPrintLine;
import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.DTOs.BailPrintView;
import com.bzdata.gestimospringbackend.DTOs.RelanceComptePrintLine;
import com.bzdata.gestimospringbackend.DTOs.RelanceComptePrintView;
import com.bzdata.gestimospringbackend.Models.AppelLoyer;
import com.bzdata.gestimospringbackend.Models.Appartement;
import com.bzdata.gestimospringbackend.Models.ImageModel;
import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.Models.Commune;
import com.bzdata.gestimospringbackend.Models.Etage;
import com.bzdata.gestimospringbackend.Models.Immeuble;
import com.bzdata.gestimospringbackend.Models.Magasin;
import com.bzdata.gestimospringbackend.Models.MontantLoyerBail;
import com.bzdata.gestimospringbackend.Models.Quartier;
import com.bzdata.gestimospringbackend.Models.Site;
import com.bzdata.gestimospringbackend.Models.Villa;
import com.bzdata.gestimospringbackend.Models.Ville;
import com.bzdata.gestimospringbackend.Models.hotel.EncaissementReservation;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.PrintService;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import com.bzdata.gestimospringbackend.Utils.BailDisplayUtils;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.bzdata.gestimospringbackend.repository.AppelLoyerRepository;
import com.bzdata.gestimospringbackend.repository.BailLocationRepository;
import com.bzdata.gestimospringbackend.repository.EncaissementReservationRepository;
import com.bzdata.gestimospringbackend.repository.ImageRepository;
import com.bzdata.gestimospringbackend.repository.MontantLoyerBailRepository;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.html2pdf.resolver.font.DefaultFontProvider;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.Instant;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import javax.sql.DataSource;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrintServiceImpl implements PrintService {

  static final Locale FRENCH_LOCALE = Locale.FRANCE;
  static final ZoneId DEFAULT_ZONE = ZoneId.systemDefault();

  /** Injecte le locale français dans les paramètres Jasper pour avoir les séparateurs de milliers corrects (espace). */
  private static Map<String, Object> withFrenchLocale(Map<String, Object> parameters) {
    parameters.put(JRParameter.REPORT_LOCALE, FRENCH_LOCALE);
    return parameters;
  }

  ResourceLoader resourceLoader;
  final DataSource dataSourceSQL;
  final EncaissementReservationRepository encaissementReservationRepository;
  final AppelLoyerRepository appelLoyerRepository;
  final AppelLoyerService appelLoyerService;
  final BailLocationRepository bailLocationRepository;
  final AgenceImmobiliereRepository agenceImmobiliereRepository;
  final ImageRepository imageRepository;
  final MontantLoyerBailRepository montantLoyerBailRepository;
  final TemplateEngine templateEngine;

  @Override
  public byte[] printBailProfessionnel(Long idBail) {
    try {
      BailLocation bail = bailLocationRepository
        .findById(idBail)
        .orElseThrow(() ->
          new IllegalArgumentException("Aucun bail trouve avec l'id " + idBail)
        );

      BailPrintView view = buildBailPrintView(bail);
      Context context = new Context(FRENCH_LOCALE);
      context.setVariable("view", view);

      String html = templateEngine.process("print/bail-professionnel", context);
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      ConverterProperties properties = new ConverterProperties();
      properties.setCharset(StandardCharsets.UTF_8.name());
      properties.setFontProvider(new DefaultFontProvider(true, true, true));

      HtmlConverter.convertToPdf(html, outputStream, properties);
      return outputStream.toByteArray();
    } catch (Exception exception) {
      log.error(
        "Erreur lors de la generation du bail professionnel {}",
        idBail,
        exception
      );
      throw new IllegalStateException(
        "Impossible de generer le document du bail " + idBail,
        exception
      );
    }
  }

  @Override
  public byte[] quittanceLoyer(Long id)
    throws FileNotFoundException, JRException, SQLException {
    String path = "src/main/resources/templates";

    File file = ResourceUtils.getFile(path + "/print/Recu_paiement.jrxml");
    Map<String, Object> parameters = new HashMap<>();
    parameters.put("idQuit", id);
    JasperReport jasperReport = JasperCompileManager.compileReport(
      file.getAbsolutePath()
    );

    JasperPrint print = JasperFillManager.fillReport(
      jasperReport,
      withFrenchLocale(parameters),
      dataSourceSQL.getConnection()
    );
    JasperExportManager.exportReportToPdfFile(
      print,
      path + "/quittance" + id + ".pdf"
    );

    return JasperExportManager.exportReportToPdf(print);
  }

  @Override
  public byte[] quittancePeriode(String periode, String proprio, Long idAgence)
    throws FileNotFoundException, JRException, SQLException {
    String path = "src/main/resources/templates";
    File file = ResourceUtils.getFile(
      path + "/print/quittance_appel_loyer.jrxml"
    );
    Map<String, Object> parameters = new HashMap<>();
    parameters.put("PARAMETER_PERIODE", periode);
    JasperReport jasperReport = JasperCompileManager.compileReport(
      file.getAbsolutePath()
    );

    JasperPrint print = JasperFillManager.fillReport(
      jasperReport,
      parameters,
      dataSourceSQL.getConnection()
    );
    JasperExportManager.exportReportToPdfFile(
      print,
      path + "/depot_etat/appel_loyer_du_" + periode + ".pdf"
    );
    return JasperExportManager.exportReportToPdf(print);
  }

  @Override
  public byte[] quittancePeriodeString(
    String periode,
    Long idAgence
  ) throws FileNotFoundException, JRException, SQLException {
    try {
      AgenceImmobiliere agence = resolveAgenceById(idAgence);
      String nomAgence = agence != null ? fallback(agence.getNomAgence(), "GESTIMO") : "GESTIMO";

      InputStream jrxmlStream = resourceLoader
        .getResource("classpath:templates/print/quittanceappelloyer.jrxml")
        .getInputStream();
      InputStream logoStream = resolveAgenceLogoStream(
        agence,
        "classpath:templates/print/seve.jpeg"
      );

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("PARAMETER_PERIODE", periode);
      parameters.put("PARAMETER_AGENCE", idAgence);
      parameters.put("NOM_PROPRIO", nomAgence);
      parameters.put("LOGO", logoStream);

      JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlStream);
      JasperPrint print = JasperFillManager.fillReport(
        jasperReport,
        withFrenchLocale(parameters),
        dataSourceSQL.getConnection()
      );
      log.info("Rapport genere pour periode={} agence={} : {} page(s)", periode, idAgence, print.getPages().size());
      return JasperExportManager.exportReportToPdf(print);
    } catch (Exception e) {
      log.error(
        "Erreur lors de la generation de la quittance groupee pour la periode {} et l'agence {}",
        periode,
        idAgence,
        e
      );
      throw new IllegalStateException(
        "Impossible de generer la quittance du mois " + periode,
        e
      );
    }
  }

  @Override
  public byte[] quittancePeriodeById(String periode, Long id, String proprio)
    throws FileNotFoundException, JRException, SQLException {
    try {
      String path = "src/main/resources/templates";
      AgenceImmobiliere agence = resolveAgenceForLocataireAndPeriode(periode, id);
      InputStream logoMagiser = resolveAgenceLogoStream(
        agence,
        "classpath:templates/print/magiser.jpeg"
      );
      File file = ResourceUtils.getFile(
        path + "/print/quittance_appel_loyer_indiv_pour_mail.jrxml"
      );

      Map<String, Object> parameters = new HashMap<>();

      parameters.put("PARAMETER_PERIODE", periode);
      parameters.put("ID_UTILISATEUR", id.toString());
      parameters.put("NOM_PROPRIO", proprio);
      parameters.put("LOGO", logoMagiser);
      JasperReport jasperReport = JasperCompileManager.compileReport(
        file.getAbsolutePath()
      );
      File di = new File(path + "/depot_etat");
      boolean di1 = di.mkdirs();
      if (di1) {
        System.out.println("Folder is created successfully");
      }
      JasperPrint print = JasperFillManager.fillReport(
        jasperReport,
        withFrenchLocale(parameters),
        dataSourceSQL.getConnection()
      );
      JasperExportManager.exportReportToPdfFile(
        print,
        path + "/depot_etat/appel_loyer_du_" + periode + "_" + id + ".pdf"
      );
      log.info(
        "Le fichier {}",
        path + "/appel_loyer_du_" + periode + "_" + id + ".pdf"
      );
      return JasperExportManager.exportReportToPdf(print);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }

  @Override
  public byte[] printQuittancePeriodeString(
    String periode,
    Long idAgence
  ) throws FileNotFoundException, JRException, SQLException {
    return quittancePeriodeString(periode, idAgence);
  }

  @Override
  public byte[] releveCompteLocataireImpaye(Long idAgence, Long idLocataire) {
    try {
      List<AppelLoyersFactureDto> relances = findRelancesForLocataire(
        idAgence,
        idLocataire
      );

      if (relances.isEmpty()) {
        throw new IllegalArgumentException(
          "Aucun impaye a relancer pour le locataire " + idLocataire
        );
      }

      RelanceComptePrintView view = buildRelanceCompteView(idAgence, relances);
      Context context = new Context(FRENCH_LOCALE);
      context.setVariable("view", view);

      String html = templateEngine.process("print/releve-compte-relance", context);
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      ConverterProperties properties = new ConverterProperties();
      properties.setCharset(StandardCharsets.UTF_8.name());
      properties.setFontProvider(new DefaultFontProvider(true, true, true));

      HtmlConverter.convertToPdf(html, outputStream, properties);
      return outputStream.toByteArray();
    } catch (Exception exception) {
      log.error(
        "Erreur lors de la generation du releve de compte impaye pour le locataire {} de l'agence {}",
        idLocataire,
        idAgence,
        exception
      );
      throw new IllegalStateException(
        "Impossible de generer le releve de compte du locataire " + idLocataire,
        exception
      );
    }
  }

  @Override
  public byte[] printRecuPaiement(Long idEncaissemnt)
    throws FileNotFoundException, JRException, SQLException {
    try {
      String path = "src/main/resources/templates";
      File file = ResourceUtils.getFile(
        path + "/print/recupaiementappelloyer.jrxml"
      );
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("PARAMETER_ENCAISSEMENT", idEncaissemnt);

      JasperReport jasperReport = JasperCompileManager.compileReport(
        file.getAbsolutePath()
      );
      File di = new File(path + "/depot_etat");
      boolean di1 = di.mkdirs();
      if (di1) {
        System.out.println("Folder is created successfully");
      }
      JasperPrint print = JasperFillManager.fillReport(
        jasperReport,
        withFrenchLocale(parameters),
        dataSourceSQL.getConnection()
      );
      JasperExportManager.exportReportToPdfFile(
        print,
        path + "/depot_etat/recu_paiement_du" + idEncaissemnt + ".pdf"
      );

      return JasperExportManager.exportReportToPdf(print);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }

  @Override
  public byte[] recuReservation(Long idEncaisse, String proprio, Long idAgence)
    throws FileNotFoundException, JRException, SQLException {
    try {
      String path = "src/main/resources/templates";
      File file = ResourceUtils.getFile(
        path + "/print/quittancereservation.jrxml"
      );
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("id_encaissement", idEncaisse);
      parameters.put("PARAMETER_AGENCE", idAgence);
      parameters.put("NOM_PROPRIO", proprio);

      JasperReport jasperReport = JasperCompileManager.compileReport(
        file.getAbsolutePath()
      );
      File di = new File(path + "/depot_etat");
      boolean di1 = di.mkdirs();
      if (di1) {
        System.out.println("Folder is created successfully");
      }
      JasperPrint print = JasperFillManager.fillReport(
        jasperReport,
        withFrenchLocale(parameters),
        dataSourceSQL.getConnection()
      );
      JasperExportManager.exportReportToPdfFile(
        print,
        path + "/depot_etat/recu_de_" + idEncaisse + ".pdf"
      );
    log.info(
      "Le fichier {}",
      path + "/depot_etat/recu_de_" + idEncaisse + ".pdf"
    );
    return JasperExportManager.exportReportToPdf(print);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }

  private byte[] renderMergedQuittancePdf(
    String periode,
    Long idAgence,
    String proprio
  ) throws FileNotFoundException, JRException, SQLException {
    List<Long> locataireIds = findLocataireIdsForPeriod(periode, idAgence);

    if (locataireIds.isEmpty()) {
      return renderGroupedQuittancePdf(periode, idAgence, proprio);
    }

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    try (PdfDocument mergedDocument = new PdfDocument(new PdfWriter(outputStream))) {
      for (Long locataireId : locataireIds) {
        byte[] quittanceBytes = quittancePeriodeById(periode, locataireId, proprio);

        if (quittanceBytes == null || quittanceBytes.length == 0) {
          continue;
        }

        try (
          PdfReader pdfReader = new PdfReader(new ByteArrayInputStream(quittanceBytes));
          PdfDocument sourceDocument = new PdfDocument(pdfReader)
        ) {
          sourceDocument.copyPagesTo(
            1,
            sourceDocument.getNumberOfPages(),
            mergedDocument
          );
        }
      }
    } catch (Exception exception) {
      throw new IllegalStateException(
        "Impossible d'assembler les quittances de la periode " + periode,
        exception
      );
    }

    byte[] mergedBytes = outputStream.toByteArray();
    if (mergedBytes.length == 0) {
      return renderGroupedQuittancePdf(periode, idAgence, proprio);
    }

    return mergedBytes;
  }

  @Override
  public byte[] recuReservationParIdReservation(
    Long idReservation,
    String proprio,
    Long idAgence
  ) throws FileNotFoundException, JRException, SQLException {
    Long idEncaisse = 0L;
    try {
      EncaissementReservation encaissementReservation = encaissementReservationRepository
        .findAll(Sort.by(Sort.Direction.DESC, "id"))
        .stream()
        .filter(enc -> enc.getReservation().getId() == idReservation)
        .findFirst()
        .orElse(null);
      log.info(" id is {}", encaissementReservation.getId());
      if (encaissementReservation != null) {
        idEncaisse = encaissementReservation.getId();
      }
      String path = "src/main/resources/templates";
      File file = ResourceUtils.getFile(
        path + "/print/quittancereservation.jrxml"
      );
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("id_encaissement", idEncaisse);
      parameters.put("PARAMETER_AGENCE", idAgence);
      parameters.put("NOM_PROPRIO", proprio);

      JasperReport jasperReport = JasperCompileManager.compileReport(
        file.getAbsolutePath()
      );
      File di = new File(path + "/depot_etat");
      boolean di1 = di.mkdirs();
      if (di1) {
        System.out.println("Folder is created successfully");
      }
      JasperPrint print = JasperFillManager.fillReport(
        jasperReport,
        withFrenchLocale(parameters),
        dataSourceSQL.getConnection()
      );
      JasperExportManager.exportReportToPdfFile(
        print,
        path + "/depot_etat/recu_de_" + idEncaisse + ".pdf"
      );
      log.info(
        "Le fichier {}",
        path + "/depot_etat/recu_de_" + idEncaisse + ".pdf"
      );
      return JasperExportManager.exportReportToPdf(print);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }

  private BailPrintView buildBailPrintView(BailLocation bail) {
    Bienimmobilier bien = bail.getBienImmobilierOperation();
    Utilisateur locataire = bail.getUtilisateurOperation();
    Utilisateur bailleur = bien != null ? bien.getUtilisateurProprietaire() : null;
    AgenceImmobiliere agence = bail.getIdAgence() == null
      ? null
      : agenceImmobiliereRepository.findById(bail.getIdAgence()).orElse(null);

    double loyerMensuelValue = resolveCurrentRent(bail);
    Site site = resolveSite(bien);
    String signatureVille = resolveSignatureCity(site, agence);

    return BailPrintView
      .builder()
      .bailId(bail.getId())
      .agenceNom(fallback(agence != null ? agence.getNomAgence() : null))
      .agenceSigle(fallback(agence != null ? agence.getSigleAgence() : null))
      .agenceAdresse(fallback(agence != null ? agence.getAdresseAgence() : null))
      .agenceTelephone(
        fallback(agence != null ? agence.getMobileAgence() : null, agence != null ? agence.getTelAgence() : null)
      )
      .agenceEmail(fallback(agence != null ? agence.getEmailAgence() : null))
      .bailCode(fallback(BailDisplayUtils.resolveBailCode(bail), "BAIL-" + bail.getId()))
      .designationBail(fallback(bail.getDesignationBail()))
      .typeBien(resolveAssetTypeLabel(bien))
      .bienCode(fallback(bien != null ? bien.getCodeAbrvBienImmobilier() : null))
      .bienNom(fallback(bien != null ? bien.getNomCompletBienImmobilier() : null))
      .bienAdresse(buildAddress(site))
      .bienDescription(buildAssetDescription(bien))
      .dateSignature(formatInstantDate(bail.getCreationDate()))
      .dateDebut(formatDate(bail.getDateDebut()))
      .dateFin(formatDate(bail.getDateFin()))
      .dureeLabel(buildDurationLabel(bail.getDateDebut(), bail.getDateFin()))
      .periodicitePaiement("mensuelle")
      .loyerMensuel(formatAmount(loyerMensuelValue))
      .loyerAnnuel(formatAmount(loyerMensuelValue * 12))
      .cautionAmount(formatAmount(bail.getMontantCautionBail()))
      .cautionMonths(bail.getNbreMoisCautionBail())
      .locataireNom(formatFullName(locataire))
      .locataireEmail(fallback(locataire != null ? locataire.getEmail() : null))
      .locataireMobile(fallback(locataire != null ? locataire.getMobile() : null))
      .bailleurNom(formatFullName(bailleur))
      .bailleurEmail(fallback(bailleur != null ? bailleur.getEmail() : null))
      .bailleurMobile(fallback(bailleur != null ? bailleur.getMobile() : null))
      .signatureVille(signatureVille)
      .build();
  }

  private byte[] renderGroupedQuittancePdf(
    String periode,
    Long idAgence,
    String proprio
  ) {
    AppelLoyerPeriodPrintView view = buildGroupedQuittanceView(
      periode,
      idAgence,
      proprio
    );
    Context context = new Context(FRENCH_LOCALE);
    context.setVariable("view", view);

    String html = templateEngine.process("print/quittance-groupee", context);
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    ConverterProperties properties = new ConverterProperties();
    properties.setCharset(StandardCharsets.UTF_8.name());
    properties.setFontProvider(new DefaultFontProvider(true, true, true));

    HtmlConverter.convertToPdf(html, outputStream, properties);
    return outputStream.toByteArray();
  }

  private List<Long> findLocataireIdsForPeriod(String periode, Long idAgence) {
    return appelLoyerRepository
      .findAll()
      .stream()
      .filter(appel -> Objects.equals(appel.getIdAgence(), idAgence))
      .filter(appel -> Objects.equals(appel.getPeriodeAppelLoyer(), periode))
      .filter(appel -> !appel.isCloturer())
      .sorted(
        Comparator
          .comparing(
            (AppelLoyer appel) -> safeSortValue(
              formatFullName(appel.getBailLocationAppelLoyer() != null
                  ? appel.getBailLocationAppelLoyer().getUtilisateurOperation()
                  : null)
            )
          )
          .thenComparing(
            appel -> safeSortValue(
              appel.getBailLocationAppelLoyer() != null &&
              appel.getBailLocationAppelLoyer().getBienImmobilierOperation() != null
                ? appel
                  .getBailLocationAppelLoyer()
                  .getBienImmobilierOperation()
                  .getCodeAbrvBienImmobilier()
                : null
            )
          )
      )
      .map(AppelLoyer::getBailLocationAppelLoyer)
      .filter(Objects::nonNull)
      .map(BailLocation::getUtilisateurOperation)
      .filter(Objects::nonNull)
      .map(Utilisateur::getId)
      .filter(Objects::nonNull)
      .distinct()
      .toList();
  }

  private AppelLoyerPeriodPrintView buildGroupedQuittanceView(
    String periode,
    Long idAgence,
    String proprio
  ) {
    List<AppelLoyer> appels = appelLoyerRepository
      .findAll()
      .stream()
      .filter(appel -> Objects.equals(appel.getIdAgence(), idAgence))
      .filter(appel -> Objects.equals(appel.getPeriodeAppelLoyer(), periode))
      .filter(appel -> !appel.isCloturer())
      .sorted(
        Comparator
          .comparing(
            (AppelLoyer appel) -> safeSortValue(
              formatFullName(appel.getBailLocationAppelLoyer() != null
                  ? appel.getBailLocationAppelLoyer().getUtilisateurOperation()
                  : null)
            )
          )
          .thenComparing(
            appel -> safeSortValue(
              appel.getBailLocationAppelLoyer() != null &&
              appel.getBailLocationAppelLoyer().getBienImmobilierOperation() != null
                ? appel
                  .getBailLocationAppelLoyer()
                  .getBienImmobilierOperation()
                  .getCodeAbrvBienImmobilier()
                : null
            )
          )
      )
      .toList();

    AgenceImmobiliere agence = agenceImmobiliereRepository
      .findById(idAgence)
      .orElse(null);

    List<AppelLoyerPrintLine> lignes = appels
      .stream()
      .map(this::buildGroupedLine)
      .toList();

    double totalLoyer = appels
      .stream()
      .mapToDouble(AppelLoyer::getMontantLoyerBailLPeriode)
      .sum();
    double totalRestant = appels
      .stream()
      .mapToDouble(AppelLoyer::getSoldeAppelLoyer)
      .sum();

    String periodeLettre = appels.isEmpty()
      ? periode
      : fallback(appels.get(0).getPeriodeLettre(), periode);

    return AppelLoyerPeriodPrintView
      .builder()
      .periodeCode(fallback(periode))
      .periodeLabel(fallback(periodeLettre, periode))
      .agenceNom(fallback(agence != null ? agence.getNomAgence() : null))
      .agenceSigle(fallback(agence != null ? agence.getSigleAgence() : null, "GESTIMO"))
      .agenceLogoDataUrl(resolveAgenceLogoDataUrl(agence))
      .agenceAdresse(fallback(agence != null ? agence.getAdresseAgence() : null))
      .agenceTelephone(
        fallback(
          agence != null ? agence.getMobileAgence() : null,
          agence != null ? agence.getTelAgence() : null
        )
      )
      .agenceTelephoneFixe(fallback(agence != null ? agence.getTelAgence() : null))
      .agencePortable(fallback(agence != null ? agence.getMobileAgence() : null))
      .agenceEmail(fallback(agence != null ? agence.getEmailAgence() : null))
      .agenceBoitePostale(fallback(agence != null ? agence.getBoitePostaleAgence() : null))
      .agenceNcc(fallback(agence != null ? agence.getCompteContribuable() : null))
      .proprietaireNom(fallback(proprio, "Tous les proprietaires"))
      .generationDate(formatDate(LocalDate.now()))
      .nombreLignes(lignes.size())
      .totalLoyer(formatAmount(totalLoyer))
      .totalEncaisse(formatAmount(Math.max(totalLoyer - totalRestant, 0d)))
      .totalRestant(formatAmount(totalRestant))
      .lignes(lignes)
      .build();
  }

  private List<AppelLoyersFactureDto> findRelancesForLocataire(
    Long idAgence,
    Long idLocataire
  ) {
    return appelLoyerService
      .findAllForRelance(idAgence)
      .stream()
      .filter(relance -> Objects.equals(relance.getIdLocataire(), idLocataire))
      .sorted(
        Comparator
          .comparing(
            AppelLoyersFactureDto::getPeriodeAppelLoyer,
            Comparator.nullsLast(Comparator.naturalOrder())
          )
          .thenComparing(
            AppelLoyersFactureDto::getDateDebutMoisAppelLoyer,
            Comparator.nullsLast(Comparator.naturalOrder())
          )
          .thenComparing(
            AppelLoyersFactureDto::getId,
            Comparator.nullsLast(Comparator.naturalOrder())
          )
      )
      .toList();
  }

  private RelanceComptePrintView buildRelanceCompteView(
    Long idAgence,
    List<AppelLoyersFactureDto> relances
  ) {
    AgenceImmobiliere agence = resolveAgenceById(idAgence);
    AppelLoyersFactureDto firstRelance = relances.get(0);
    AppelLoyersFactureDto lastRelance = relances.get(relances.size() - 1);
    double totalDu = relances
      .stream()
      .mapToDouble(AppelLoyersFactureDto::getSoldeAppelLoyer)
      .sum();

    List<RelanceComptePrintLine> lignes = relances
      .stream()
      .map(this::buildRelanceCompteLine)
      .toList();

    return RelanceComptePrintView
      .builder()
      .agenceNom(fallback(agence != null ? agence.getNomAgence() : null))
      .agenceSigle(fallback(agence != null ? agence.getSigleAgence() : null, "GESTIMO"))
      .agenceLogoDataUrl(resolveAgenceLogoDataUrl(agence))
      .agenceAdresse(fallback(agence != null ? agence.getAdresseAgence() : null))
      .agenceTelephoneFixe(fallback(agence != null ? agence.getTelAgence() : null))
      .agencePortable(fallback(agence != null ? agence.getMobileAgence() : null))
      .agenceEmail(fallback(agence != null ? agence.getEmailAgence() : null))
      .agenceBoitePostale(fallback(agence != null ? agence.getBoitePostaleAgence() : null))
      .agenceNcc(fallback(agence != null ? agence.getCompteContribuable() : null))
      .generationDate(formatDate(LocalDate.now()))
      .locataireCivilite(fallback(firstRelance.getGenreLocataire(), "Madame, Monsieur"))
      .locataireNom(
        fallback(
          buildDisplayName(
            firstRelance.getNomLocataire(),
            firstRelance.getPrenomLocataire()
          )
        )
      )
      .locataireEmail(fallback(firstRelance.getEmailLocatire(), "-"))
      .premierePeriode(
        fallback(
          firstRelance.getPeriodeLettre(),
          firstRelance.getPeriodeAppelLoyer()
        )
      )
      .dernierePeriode(
        fallback(
          lastRelance.getPeriodeLettre(),
          lastRelance.getPeriodeAppelLoyer()
        )
      )
      .nombrePeriodes(relances.size())
      .totalDu(formatAmount(totalDu))
      .lignes(lignes)
      .build();
  }

  private AppelLoyerPrintLine buildGroupedLine(AppelLoyer appel) {
    BailLocation bail = appel.getBailLocationAppelLoyer();
    Bienimmobilier bien = bail != null ? bail.getBienImmobilierOperation() : null;
    Utilisateur locataire = bail != null ? bail.getUtilisateurOperation() : null;

    return AppelLoyerPrintLine
      .builder()
      .locataireCivilite(fallback(BailDisplayUtils.resolveCivilite(locataire), "-"))
      .locataireNom(fallback(BailDisplayUtils.buildLocataireDisplayName(locataire)))
      .bienCode(fallback(bien != null ? bien.getCodeAbrvBienImmobilier() : null))
      .bienNom(fallback(bien != null ? bien.getNomCompletBienImmobilier() : null))
      .typeBien(resolveAssetTypeLabel(bien))
      .bailCode(fallback(bail != null ? BailDisplayUtils.resolveBailCode(bail) : null))
      .datePaiementPrevue(formatDate(appel.getDatePaiementPrevuAppelLoyer()))
      .dateDebut(formatDate(appel.getDateDebutMoisAppelLoyer()))
      .dateFin(formatDate(appel.getDateFinMoisAppelLoyer()))
      .statut(
        appel.isSolderAppelLoyer() || appel.getSoldeAppelLoyer() <= 0
          ? "Solde"
          : appel.getSoldeAppelLoyer() < appel.getMontantLoyerBailLPeriode()
            ? "Partiel"
            : "Impaye"
      )
      .montantLoyer(formatAmount(appel.getMontantLoyerBailLPeriode()))
      .montantPaye(
        formatAmount(
          Math.max(
            appel.getMontantLoyerBailLPeriode() - appel.getSoldeAppelLoyer(),
            0d
          )
        )
      )
      .montantRestant(formatAmount(appel.getSoldeAppelLoyer()))
      .build();
  }

  private RelanceComptePrintLine buildRelanceCompteLine(
    AppelLoyersFactureDto relance
  ) {
    boolean partiel = relance.getSoldeAppelLoyer() > 0 &&
      relance.getSoldeAppelLoyer() < relance.getMontantLoyerBailLPeriode();

    return RelanceComptePrintLine
      .builder()
      .periodeCode(fallback(relance.getPeriodeAppelLoyer(), "-"))
      .periodeLabel(
        fallback(relance.getPeriodeLettre(), relance.getPeriodeAppelLoyer())
      )
      .datePaiementPrevue(formatDate(relance.getDatePaiementPrevuAppelLoyer()))
      .bienCode(fallback(relance.getAbrvBienimmobilier(), "-"))
      .bienNom(
        fallback(
          relance.getBienImmobilierFullName(),
          relance.getAbrvBienimmobilier()
        )
      )
      .bailCode(fallback(relance.getAbrvCodeBail(), "-"))
      .statut(partiel ? "Partiel" : "Impaye")
      .montantLoyer(formatAmount(relance.getMontantLoyerBailLPeriode()))
      .montantRestant(formatAmount(relance.getSoldeAppelLoyer()))
      .build();
  }

  private double resolveCurrentRent(BailLocation bail) {
    return montantLoyerBailRepository
      .findMontantLoyerBailbyStatusAndBailId(bail)
      .stream()
      .mapToDouble(MontantLoyerBail::getNouveauMontantLoyer)
      .findFirst()
      .orElse(0d);
  }

  private String buildAssetDescription(Bienimmobilier bien) {
    if (bien == null) {
      return "Bien non renseigne.";
    }

    List<String> details = new ArrayList<>();
    details.add(
      resolveAssetTypeLabel(bien) + " reference " + fallback(bien.getCodeAbrvBienImmobilier())
    );

    if (StringUtils.hasText(bien.getNomCompletBienImmobilier())) {
      details.add(bien.getNomCompletBienImmobilier());
    }

    if (bien instanceof Appartement appartement) {
      details.add(
        appartement.getNbrPieceApp() +
        " piece(s), " +
        appartement.getNbreChambreApp() +
        " chambre(s), " +
        appartement.getNbreSalonApp() +
        " salon(s)"
      );
      details.add(
        appartement.getNbreSalleEauApp() + " salle(s) d'eau"
      );
      Etage etage = appartement.getEtageAppartement();
      if (etage != null) {
        details.add("Etage: " + fallback(etage.getNomCompletEtage()));
      }
    } else if (bien instanceof Villa villa) {
      details.add(
        villa.getNbrePieceVilla() +
        " piece(s), " +
        villa.getNbrChambreVilla() +
        " chambre(s), " +
        villa.getNbrSalonVilla() +
        " salon(s)"
      );
      details.add(villa.getNbrSalleEauVilla() + " salle(s) d'eau");
    } else if (bien instanceof Magasin magasin) {
      details.add(magasin.getNombrePieceMagasin() + " piece(s)");
      if (magasin.getEtageMagasin() != null) {
        details.add(
          "Etage: " + fallback(magasin.getEtageMagasin().getNomCompletEtage())
        );
      }
    }

    if (bien.getSuperficieBien() > 0) {
      details.add(
        "Superficie approx.: " + stripTrailingZeros(bien.getSuperficieBien()) + " m2"
      );
    }

    if (StringUtils.hasText(bien.getDescription())) {
      details.add(bien.getDescription());
    }

    return String.join(" - ", details);
  }

  private String resolveAssetTypeLabel(Bienimmobilier bien) {
    if (bien instanceof Appartement) {
      return "Appartement";
    }
    if (bien instanceof Magasin) {
      return "Magasin";
    }
    if (bien instanceof Villa) {
      return "Villa";
    }
    return "Bien immobilier";
  }

  private Site resolveSite(Bienimmobilier bien) {
    if (bien == null) {
      return null;
    }

    if (bien instanceof Appartement appartement) {
      return appartement.getEtageAppartement() != null &&
      appartement.getEtageAppartement().getImmeuble() != null
        ? appartement.getEtageAppartement().getImmeuble().getSite()
        : null;
    }

    if (bien instanceof Magasin magasin) {
      if (magasin.getSite() != null) {
        return magasin.getSite();
      }
      return magasin.getEtageMagasin() != null &&
      magasin.getEtageMagasin().getImmeuble() != null
        ? magasin.getEtageMagasin().getImmeuble().getSite()
        : null;
    }

    if (bien instanceof Villa villa) {
      return villa.getSite();
    }

    return bien.getSite();
  }

  private String buildAddress(Site site) {
    if (site == null) {
      return "Adresse non renseignee";
    }

    List<String> parts = new ArrayList<>();
    Ville ville = null;
    Commune commune = null;
    Quartier quartier = site.getQuartier();

    if (quartier != null) {
      commune = quartier.getCommune();
      parts.add(fallback(quartier.getNomQuartier(), quartier.getAbrvQuartier()));
    }

    if (commune != null) {
      ville = commune.getVille();
      parts.add(fallback(commune.getNomCommune(), commune.getAbrvCommune()));
    }

    if (ville != null) {
      parts.add(fallback(ville.getNomVille(), ville.getAbrvVille()));
    }

    parts.add(fallback(site.getNomSite(), site.getAbrSite()));
    return String.join(", ", parts);
  }

  private String resolveSignatureCity(Site site, AgenceImmobiliere agence) {
    if (site != null && site.getQuartier() != null && site.getQuartier().getCommune() != null) {
      Commune commune = site.getQuartier().getCommune();
      if (commune.getVille() != null && StringUtils.hasText(commune.getVille().getNomVille())) {
        return commune.getVille().getNomVille();
      }
      if (StringUtils.hasText(commune.getNomCommune())) {
        return commune.getNomCommune();
      }
    }

    if (agence != null && StringUtils.hasText(agence.getAdresseAgence())) {
      return agence.getAdresseAgence();
    }

    return "Abidjan";
  }

  private String buildDurationLabel(LocalDate dateDebut, LocalDate dateFin) {
    if (dateDebut == null || dateFin == null || dateFin.isBefore(dateDebut)) {
      return "Duree non renseignee";
    }

    Period period = Period.between(dateDebut, dateFin);
    List<String> tokens = new ArrayList<>();

    if (period.getYears() > 0) {
      tokens.add(period.getYears() + " an(s)");
    }
    if (period.getMonths() > 0) {
      tokens.add(period.getMonths() + " mois");
    }
    if (period.getDays() > 0 || tokens.isEmpty()) {
      tokens.add(period.getDays() + " jour(s)");
    }

    return String.join(" ", tokens);
  }

  private String formatAmount(double amount) {
    NumberFormat formatter = NumberFormat.getNumberInstance(FRENCH_LOCALE);
    formatter.setMinimumFractionDigits(0);
    formatter.setMaximumFractionDigits(0);
    return formatter.format(amount) + " FCFA";
  }

  private String formatDate(LocalDate date) {
    if (date == null) {
      return "Non renseignee";
    }
    return date.format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy", FRENCH_LOCALE));
  }

  private String formatInstantDate(Instant instant) {
    if (instant == null) {
      return formatDate(LocalDate.now());
    }
    return formatDate(instant.atZone(DEFAULT_ZONE).toLocalDate());
  }

  private String formatFullName(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return "Non renseigne";
    }
    return fallback(BailDisplayUtils.buildLocataireDisplayName(utilisateur));
  }

  private String buildDisplayName(String nom, String prenom) {
    String displayName = ((nom == null ? "" : nom.trim()) + " " + (prenom == null ? "" : prenom.trim())).trim();
    return StringUtils.hasText(displayName) ? displayName : "";
  }

  private String fallback(String value) {
    return fallback(value, "Non renseigne");
  }

  private String fallback(String first, String second) {
    if (StringUtils.hasText(first)) {
      return first.trim();
    }
    if (StringUtils.hasText(second)) {
      return second.trim();
    }
    return "Non renseigne";
  }

  private String stripTrailingZeros(double value) {
    if (value == Math.rint(value)) {
      return String.valueOf((long) value);
    }
    return String.valueOf(value);
  }

  private String safeSortValue(String value) {
    return value == null ? "" : value.toLowerCase(FRENCH_LOCALE);
  }

  private AgenceImmobiliere resolveAgenceById(Long idAgence) {
    if (idAgence == null) {
      return null;
    }
    return agenceImmobiliereRepository.findById(idAgence).orElse(null);
  }

  private AgenceImmobiliere resolveAgenceForLocataireAndPeriode(
    String periode,
    Long idLocataire
  ) {
    if (!StringUtils.hasText(periode) || idLocataire == null) {
      return null;
    }

    Long idAgence = appelLoyerRepository
      .findAll()
      .stream()
      .filter(appel -> Objects.equals(appel.getPeriodeAppelLoyer(), periode))
      .filter(appel -> !appel.isCloturer())
      .filter(appel -> appel.getBailLocationAppelLoyer() != null)
      .filter(appel -> appel.getBailLocationAppelLoyer().getUtilisateurOperation() != null)
      .filter(appel ->
        Objects.equals(
          appel.getBailLocationAppelLoyer().getUtilisateurOperation().getId(),
          idLocataire
        )
      )
      .map(AppelLoyer::getIdAgence)
      .filter(Objects::nonNull)
      .findFirst()
      .orElse(null);

    return resolveAgenceById(idAgence);
  }

  private InputStream resolveAgenceLogoStream(
    AgenceImmobiliere agence,
    String fallbackClasspathLocation
  ) {
    if (agence != null) {
      ImageModel imageModel = imageRepository.findByLogoAgence(agence).orElse(null);
      if (imageModel != null && imageModel.getPicByte() != null && imageModel.getPicByte().length > 0) {
        return new ByteArrayInputStream(imageModel.getPicByte());
      }
    }

    try {
      return resourceLoader.getResource(fallbackClasspathLocation).getInputStream();
    } catch (Exception exception) {
      throw new IllegalStateException(
        "Impossible de charger le logo de l'agence ou le logo par defaut",
        exception
      );
    }
  }

  private String resolveAgenceLogoDataUrl(AgenceImmobiliere agence) {
    if (agence == null) {
      return null;
    }

    ImageModel imageModel = imageRepository.findByLogoAgence(agence).orElse(null);
    if (imageModel == null || imageModel.getPicByte() == null || imageModel.getPicByte().length == 0) {
      return null;
    }

    String contentType = StringUtils.hasText(imageModel.getType())
      ? imageModel.getType()
      : "image/png";
    return "data:" +
    contentType +
    ";base64," +
    Base64.getEncoder().encodeToString(imageModel.getPicByte());
  }
}
