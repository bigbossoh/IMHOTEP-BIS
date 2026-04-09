package com.bzdata.gestimospringbackend.Utils;

import com.bzdata.gestimospringbackend.Models.BailLocation;
import com.bzdata.gestimospringbackend.Models.Bienimmobilier;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.util.StringUtils;

public final class BailDisplayUtils {

  private static final Pattern NULL_TOKEN_PATTERN = Pattern.compile("(?i)\\bnull\\b");
  private static final Set<String> PLACEHOLDER_CODES = Set.of(
    "BAIL-APPARTEMENT",
    "BAIL-MAGASIN",
    "BAIL-VILLA"
  );

  private BailDisplayUtils() {}

  public static String buildLocataireDisplayName(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return "";
    }

    String displayName = joinNonBlank(utilisateur.getNom(), utilisateur.getPrenom());
    if (StringUtils.hasText(displayName)) {
      return displayName;
    }

    return sanitizeDisplayValue(utilisateur.getUsername());
  }

  public static String buildTenantBienLabel(
    Utilisateur utilisateur,
    Bienimmobilier bienImmobilier
  ) {
    String locataire = buildLocataireDisplayName(utilisateur);
    String codeBien = sanitizeDisplayValue(
      bienImmobilier != null ? bienImmobilier.getCodeAbrvBienImmobilier() : null
    );

    if (StringUtils.hasText(locataire) && StringUtils.hasText(codeBien)) {
      return locataire + " / " + codeBien;
    }
    if (StringUtils.hasText(locataire)) {
      return locataire;
    }
    return codeBien;
  }

  public static String resolveCivilite(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return "";
    }

    String genre = sanitizeDisplayValue(utilisateur.getGenre());
    if (!StringUtils.hasText(genre)) {
      return "";
    }

    String normalizedGenre = genre.toLowerCase(Locale.ROOT);
    if (
      normalizedGenre.equals("m") ||
      normalizedGenre.equals("masculin") ||
      normalizedGenre.equals("homme") ||
      normalizedGenre.equals("monsieur")
    ) {
      return "Monsieur";
    }

    if (
      normalizedGenre.equals("f") ||
      normalizedGenre.equals("feminin") ||
      normalizedGenre.equals("féminin") ||
      normalizedGenre.equals("femme") ||
      normalizedGenre.equals("madame")
    ) {
      return "Madame";
    }

    if (normalizedGenre.equals("mademoiselle")) {
      return "Mademoiselle";
    }

    return genre;
  }

  public static String resolveBailCode(BailLocation bailLocation) {
    if (bailLocation == null) {
      return "";
    }

    return resolveBailCode(
      bailLocation.getAbrvCodeBail(),
      bailLocation.getUtilisateurOperation(),
      bailLocation.getBienImmobilierOperation(),
      bailLocation.getId()
    );
  }

  public static String resolveBailCode(
    String currentCode,
    Utilisateur utilisateur,
    Bienimmobilier bienImmobilier,
    Long bailId
  ) {
    String sanitizedCurrentCode = sanitizeDisplayValue(currentCode);
    if (hasMeaningfulBailCode(currentCode)) {
      return sanitizedCurrentCode;
    }

    String locataire = buildLocataireDisplayName(utilisateur);
    String codeBien = sanitizeDisplayValue(
      bienImmobilier != null ? bienImmobilier.getCodeAbrvBienImmobilier() : null
    );

    if (StringUtils.hasText(locataire) && StringUtils.hasText(codeBien)) {
      return locataire + "/" + codeBien;
    }
    if (StringUtils.hasText(codeBien)) {
      return codeBien;
    }
    if (StringUtils.hasText(locataire)) {
      return locataire;
    }
    if (StringUtils.hasText(sanitizedCurrentCode)) {
      return sanitizedCurrentCode;
    }

    return bailId != null ? "BAIL-" + bailId : "";
  }

  public static String sanitizeDisplayValue(String value) {
    if (!StringUtils.hasText(value)) {
      return "";
    }

    return NULL_TOKEN_PATTERN
      .matcher(value)
      .replaceAll(" ")
      .replaceAll("\\s*/\\s*", "/")
      .replaceAll("\\s{2,}", " ")
      .replaceAll("^/+", "")
      .replaceAll("/+$", "")
      .trim();
  }

  private static boolean hasMeaningfulBailCode(String value) {
    String sanitizedValue = sanitizeDisplayValue(value);
    if (!StringUtils.hasText(sanitizedValue)) {
      return false;
    }

    if (NULL_TOKEN_PATTERN.matcher(value == null ? "" : value).find()) {
      return false;
    }

    return !PLACEHOLDER_CODES.contains(sanitizedValue.toUpperCase());
  }

  private static String joinNonBlank(String... values) {
    StringBuilder builder = new StringBuilder();
    for (String value : values) {
      String sanitizedValue = sanitizeDisplayValue(value);
      if (!StringUtils.hasText(sanitizedValue)) {
        continue;
      }
      if (builder.length() > 0) {
        builder.append(' ');
      }
      builder.append(sanitizedValue);
    }
    return builder.toString();
  }
}
