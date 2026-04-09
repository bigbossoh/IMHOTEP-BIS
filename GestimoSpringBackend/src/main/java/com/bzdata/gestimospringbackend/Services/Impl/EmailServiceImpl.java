package com.bzdata.gestimospringbackend.Services.Impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.util.StringUtils;

import jakarta.mail.internet.MimeMessage;

import com.bzdata.gestimospringbackend.DTOs.AppelLoyersFactureDto;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Services.EmailService;
import com.bzdata.gestimospringbackend.Services.PrintService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailServiceImpl implements EmailService {
    final JavaMailSender mailSender;
    final AppelLoyerService appelLoyerService;
    final PrintService printService;

    @Value("${spring.mail.username}")
    private String mailFrom;

    @Override
    public boolean sendMailWithAttachment(String periode, String to, String subject, String body,
            String fileToAttache) {
        if (!StringUtils.hasText(fileToAttache)) {
            return sendMail(periode, to, subject, body, null, null);
        }

        try {
            File file = new File(fileToAttache);
            if (!file.exists() || !file.isFile()) {
                log.warn("Piece jointe introuvable pour l'envoi mail: {}", fileToAttache);
                return false;
            }

            return sendMail(
                    periode,
                    to,
                    subject,
                    body,
                    Files.readAllBytes(file.toPath()),
                    "Quittance du mois de " + periode + ".pdf"
            );
        } catch (Exception exception) {
            log.error("Erreur lors de la lecture de la piece jointe {}", fileToAttache, exception);
            return false;
        }
    }

    @Override
    public boolean sendMailGrouperWithAttachment(String periode,Long idAgence)
            throws FileNotFoundException, JRException, SQLException {
        List<AppelLoyersFactureDto> listDesLocataireAppel = this.appelLoyerService.findAllAppelLoyerByPeriode(periode,idAgence);

        try {
            for (int i = 0; i < listDesLocataireAppel.size(); i++) {
                this.printService.quittancePeriodeById(periode, listDesLocataireAppel.get(i).getIdLocataire(),
                        listDesLocataireAppel.get(i).getNomPropietaire() + " "
                                + listDesLocataireAppel.get(i).getPrenomPropietaire());
                System.out.println(" Les quittance par ID sont : " + periode + "** Locatire ID **"
                        + listDesLocataireAppel.get(i).getIdLocataire() + " *** Nom ***"
                        + listDesLocataireAppel.get(i).getNomLocataire());
                this.sendMailWithAttachment(periode, listDesLocataireAppel.get(i).getEmailLocatire(),
                        "Avis d'échéance de loyer.",
                        "Bonjour Monsieur/Madame " + listDesLocataireAppel.get(i).getNomLocataire().toUpperCase() + " "
                                + listDesLocataireAppel.get(i).getPrenomLocataire().toUpperCase()+","+"\n"+"Vous trouverez ci-joint votre avis d'échéance de loyer du "+listDesLocataireAppel.get(i).getPeriodeLettre()+".",
                        "src/main/resources/templates/depot_etat/appel_loyer_du_" + periode + "_"
                                + listDesLocataireAppel.get(i).getIdLocataire() + ".pdf");
                System.out.println(i);
            }
            return true;
        } catch (Exception e) {
            System.err.println("**** Erreur : " + e.getMessage());
        }

        return false;
    }

    @Override
    public boolean sendMailQuittanceWithAttachment(Long id) {
        AppelLoyersFactureDto factureLocataire = this.appelLoyerService.findById(id);
        try {
            log.info("facture du du client {} ", factureLocataire);
            this.printService.quittancePeriodeById(factureLocataire.getPeriodeAppelLoyer(),
                    factureLocataire.getIdLocataire(),
                    factureLocataire.getNomPropietaire() + " " + factureLocataire.getPrenomPropietaire());
            this.sendMailWithAttachment(factureLocataire.getPeriodeAppelLoyer(), "astairenazaire@gmail.com",
                    "Envoi de Quittance groupé",
                    "Bonjour,  " + factureLocataire.getNomLocataire() + " " + factureLocataire.getPrenomLocataire(),
                    "src/main/resources/templates/depot_etat/appel_loyer_du_" + factureLocataire.getPeriodeAppelLoyer()
                            + "_"
                            + factureLocataire.getIdLocataire() + ".pdf");
            System.out.println(factureLocataire.getIdLocataire() + "-" + factureLocataire.getNomLocataire() + " "
                    + factureLocataire.getPrenomLocataire());
            return true;
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return false;
    }

    @Override
    public boolean sendMailRelanceLoyer(Long id) {
        AppelLoyersFactureDto appelLoyer = this.appelLoyerService.findById(id);
        if (appelLoyer == null || !StringUtils.hasText(appelLoyer.getEmailLocatire())) {
            return false;
        }

        try {
            String civilite = resolveCivilite(appelLoyer.getGenreLocataire());
            String fullName = buildDisplayName(
                    appelLoyer.getNomLocataire(),
                    appelLoyer.getPrenomLocataire()
            );
            String agenceName = StringUtils.hasText(appelLoyer.getNomAgence())
                    ? appelLoyer.getNomAgence().trim()
                    : "votre agence";
            String dueDate = appelLoyer.getDatePaiementPrevuAppelLoyer() != null
                    ? appelLoyer.getDatePaiementPrevuAppelLoyer().toString()
                    : "la date prevue";
            String body = String.format(
                    "Bonjour %s %s,%n%n" +
                    "Nous vous rappelons qu'un loyer de %s F CFA relatif a la periode de %s reste impaye.%n" +
                    "Bien concerne : %s.%n" +
                    "Merci de regulariser votre situation aupres de %s.%n" +
                    "Date de paiement prevue : %s.%n%n" +
                    "Cordialement,%n%s",
                    civilite,
                    fullName,
                    formatAmount(appelLoyer.getSoldeAppelLoyer()),
                    defaultText(appelLoyer.getPeriodeLettre(), appelLoyer.getPeriodeAppelLoyer()),
                    defaultText(appelLoyer.getBienImmobilierFullName(), appelLoyer.getAbrvBienimmobilier()),
                    agenceName,
                    dueDate,
                    agenceName
            );

            return this.sendMailWithAttachment(
                    appelLoyer.getPeriodeAppelLoyer(),
                    appelLoyer.getEmailLocatire(),
                    "Relance de loyer impaye - " + defaultText(appelLoyer.getPeriodeLettre(), appelLoyer.getPeriodeAppelLoyer()),
                    body,
                    null
            );
        } catch (Exception exception) {
            log.error("Erreur lors de l'envoi du mail de relance pour l'appel {}", id, exception);
            return false;
        }
    }

    @Override
    public boolean sendMailRelanceGlobaleLoyer(Long id) {
        AppelLoyersFactureDto appelLoyer = this.appelLoyerService.findById(id);
        if (
                appelLoyer == null ||
                appelLoyer.getIdAgence() == null ||
                appelLoyer.getIdLocataire() == null ||
                !StringUtils.hasText(appelLoyer.getEmailLocatire())
        ) {
            return false;
        }

        try {
            List<AppelLoyersFactureDto> relancesLocataire = this.appelLoyerService
                    .findAllForRelance(appelLoyer.getIdAgence())
                    .stream()
                    .filter(relance -> Objects.equals(relance.getIdLocataire(), appelLoyer.getIdLocataire()))
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

            if (relancesLocataire.isEmpty()) {
                return false;
            }

            double totalDu = relancesLocataire
                    .stream()
                    .mapToDouble(AppelLoyersFactureDto::getSoldeAppelLoyer)
                    .sum();
            AppelLoyersFactureDto firstRelance = relancesLocataire.get(0);
            AppelLoyersFactureDto lastRelance = relancesLocataire.get(relancesLocataire.size() - 1);
            String civilite = resolveCivilite(firstRelance.getGenreLocataire());
            String fullName = buildDisplayName(
                    firstRelance.getNomLocataire(),
                    firstRelance.getPrenomLocataire()
            );
            String agenceName = StringUtils.hasText(firstRelance.getNomAgence())
                    ? firstRelance.getNomAgence().trim()
                    : "votre agence";
            String firstPeriod = defaultText(firstRelance.getPeriodeLettre(), firstRelance.getPeriodeAppelLoyer());
            String lastPeriod = defaultText(lastRelance.getPeriodeLettre(), lastRelance.getPeriodeAppelLoyer());
            byte[] relevePdf = this.printService.releveCompteLocataireImpaye(
                    appelLoyer.getIdAgence(),
                    appelLoyer.getIdLocataire()
            );

            String body = String.format(
                    "Bonjour %s %s,%n%n" +
                    "Vous trouverez en piece jointe votre releve de compte locataire.%n" +
                    "Votre solde impaye total s'eleve a %s F CFA pour %d periode(s) impayee(s), de %s a %s.%n" +
                    "Merci de regulariser votre situation aupres de %s.%n" +
                    "Document arrete au %s.%n%n" +
                    "Cordialement,%n%s",
                    civilite,
                    fullName,
                    formatAmount(totalDu),
                    relancesLocataire.size(),
                    firstPeriod,
                    lastPeriod,
                    agenceName,
                    LocalDate.now(),
                    agenceName
            );

            return sendMail(
                    lastRelance.getPeriodeAppelLoyer(),
                    firstRelance.getEmailLocatire(),
                    "Relance globale - releve de compte impaye",
                    body,
                    relevePdf,
                    "releve-compte-impaye-" + appelLoyer.getIdLocataire() + "-" + LocalDate.now() + ".pdf"
            );
        } catch (Exception exception) {
            log.error("Erreur lors de l'envoi du mail de relance globale pour l'appel {}", id, exception);
            return false;
        }
    }

    private boolean sendMail(
            String periode,
            String to,
            String subject,
            String body,
            byte[] attachment,
            String attachmentName
    ) {
        if (!StringUtils.hasText(to)) {
            log.warn("Tentative d'envoi d'email sans destinataire pour la periode {}", periode);
            return false;
        }

        final String recipient = to.trim();
        final boolean multipart = attachment != null && attachment.length > 0;
        final String effectiveAttachmentName = StringUtils.hasText(attachmentName)
                ? attachmentName.trim()
                : "piece-jointe.pdf";

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, multipart, "UTF-8");
                helper.setTo(recipient);
                if (StringUtils.hasText(mailFrom)) {
                    helper.setFrom(mailFrom.trim());
                }
                helper.setSubject(subject);
                helper.setText(body, false);

                if (multipart) {
                    helper.addAttachment(effectiveAttachmentName, new ByteArrayResource(attachment));
                }

                mailSender.send(mimeMessage);
                log.info(
                        "Email envoye a {} avec succes (tentative {}/{})",
                        recipient,
                        attempt,
                        3
                );
                return true;
            } catch (Exception exception) {
                log.error(
                        "Echec d'envoi d'email a {} (tentative {}/{})",
                        recipient,
                        attempt,
                        3,
                        exception
                );

                if (attempt < 3) {
                    try {
                        Thread.sleep(400L);
                    } catch (InterruptedException interruptedException) {
                        Thread.currentThread().interrupt();
                        return false;
                    }
                }
            }
        }

        return false;
    }

    private String resolveCivilite(String genre) {
        if (!StringUtils.hasText(genre)) {
            return "Madame, Monsieur";
        }

        String normalizedGenre = genre.trim().toLowerCase();
        if (
                normalizedGenre.equals("madame") ||
                normalizedGenre.equals("mademoiselle") ||
                normalizedGenre.startsWith("f")
        ) {
            return "Madame";
        }
        if (
                normalizedGenre.equals("monsieur") ||
                normalizedGenre.equals("masculin") ||
                normalizedGenre.equals("m")
        ) {
            return "Monsieur";
        }
        return "Madame, Monsieur";
    }

    private String buildDisplayName(String nom, String prenom) {
        String displayName = ((nom == null ? "" : nom.trim()) + " " + (prenom == null ? "" : prenom.trim())).trim();
        return StringUtils.hasText(displayName) ? displayName : "locataire";
    }

    private String defaultText(String value, String fallback) {
        if (StringUtils.hasText(value)) {
            return value.trim();
        }
        return StringUtils.hasText(fallback) ? fallback.trim() : "-";
    }

    private String formatAmount(Double amount) {
        double numericAmount = amount == null ? 0.0d : amount;
        return String.format(java.util.Locale.FRANCE, "%,.0f", numericAmount)
                .replace('\u00A0', ' ');
    }

}
