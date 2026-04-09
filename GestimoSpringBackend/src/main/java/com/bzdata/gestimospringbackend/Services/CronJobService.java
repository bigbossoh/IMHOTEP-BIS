package com.bzdata.gestimospringbackend.Services;

import com.bzdata.gestimospringbackend.user.service.UtilisateurService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CronJobService {

  final CronMailService cronMailService;
  final UtilisateurService utilisateurService;

  @Scheduled(fixedDelay = 60000, initialDelay = 60000)
  public void processMonthlyAppelLoyerSchedules() {
    int processedCount = cronMailService.processDueConfigurations();
    if (processedCount > 0) {
      log.info(
        "Traitement planifie des appels de loyer termine: {} configuration(s) executee(s).",
        processedCount
      );
    }
  }

  @Scheduled(cron = "${app.user-security.inactivity-check-cron:0 0 2 * * *}")
  public void processInactiveUsersSecurity() {
    int disabledCount = utilisateurService.desactiverUtilisateursInactifs();
    if (disabledCount > 0) {
      log.info(
        "Securite utilisateurs: {} compte(s) desactive(s) pour inactivite.",
        disabledCount
      );
    }
  }
}
