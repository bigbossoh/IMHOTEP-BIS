package com.bzdata.gestimospringbackend.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.bzdata.gestimospringbackend.Utils.BailDisplayUtils;
import com.bzdata.gestimospringbackend.Models.Villa;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import org.junit.jupiter.api.Test;

class BailDisplayUtilsTest {

  @Test
  void buildLocataireDisplayName_ignoresNullTokens() {
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setNom("EURO BAR");
    utilisateur.setPrenom(null);

    assertEquals("EURO BAR", BailDisplayUtils.buildLocataireDisplayName(utilisateur));
  }

  @Test
  void resolveBailCode_rebuildsLegacyCodeContainingNull() {
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setNom("EURO BAR");
    utilisateur.setPrenom(null);

    Villa bien = new Villa();
    bien.setCodeAbrvBienImmobilier("CI-ABJ-YOPO-NIAN-VILLA-2");

    assertEquals(
      "EURO BAR/CI-ABJ-YOPO-NIAN-VILLA-2",
      BailDisplayUtils.resolveBailCode(
        "EURO BAR null/CI-ABJ-YOPO-NIAN-VILLA-2",
        utilisateur,
        bien,
        12L
      )
    );
  }

  @Test
  void resolveBailCode_replacesFrontendPlaceholderCodes() {
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setNom("EURO BAR");
    utilisateur.setPrenom("SARL");

    Villa bien = new Villa();
    bien.setCodeAbrvBienImmobilier("CI-ABJ-COCO-MAG-4");

    assertEquals(
      "EURO BAR SARL/CI-ABJ-COCO-MAG-4",
      BailDisplayUtils.resolveBailCode("BAIL-MAGASIN", utilisateur, bien, 18L)
    );
  }

  @Test
  void buildLocataireDisplayName_fallsBackToUsernameWhenNameIsMissing() {
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setUsername("tenant.legacy");

    assertEquals(
      "tenant.legacy",
      BailDisplayUtils.buildLocataireDisplayName(utilisateur)
    );
  }

  @Test
  void resolveCivilite_normalizesKnownGenreValues() {
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setGenre("FEMININ");

    assertEquals("Madame", BailDisplayUtils.resolveCivilite(utilisateur));
  }
}
