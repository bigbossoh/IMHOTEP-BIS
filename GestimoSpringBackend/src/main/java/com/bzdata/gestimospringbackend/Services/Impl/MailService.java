package com.bzdata.gestimospringbackend.Services.Impl;


import com.bzdata.gestimospringbackend.Models.NotificationEmail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    @Async
    public void sendMail(NotificationEmail notificationEmail) {
        if (mailHost == null || mailHost.isBlank()) {
            log.warn("[MAIL] Serveur SMTP non configuré (spring.mail.host vide). " +
                     "Email NON envoyé à {} — sujet : {}", notificationEmail.getRecipient(), notificationEmail.getSubject());
            return;
        }

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            messageHelper.setFrom(mailFrom);
            messageHelper.setTo(notificationEmail.getRecipient());
            messageHelper.setSubject(notificationEmail.getSubject());
            messageHelper.setText(notificationEmail.getBody(), true);
        };

        try {
            mailSender.send(messagePreparator);
            log.info("[MAIL] Email envoyé à {}", notificationEmail.getRecipient());
        } catch (MailException e) {
            log.error("[MAIL] Échec de l'envoi à {} : {}", notificationEmail.getRecipient(), e.getMessage());
            throw new RuntimeException(
                "Échec de l'envoi du mail à " + notificationEmail.getRecipient() +
                ". Vérifiez la configuration SMTP (host, port, username, password).", e);
        }
    }
}
