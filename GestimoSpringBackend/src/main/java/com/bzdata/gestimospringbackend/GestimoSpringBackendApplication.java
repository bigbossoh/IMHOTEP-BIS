package com.bzdata.gestimospringbackend;

import java.io.File;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bzdata.gestimospringbackend.Models.Commune;
import com.bzdata.gestimospringbackend.Models.Pays;
import com.bzdata.gestimospringbackend.Models.Quartier;
import com.bzdata.gestimospringbackend.Models.Role;
import com.bzdata.gestimospringbackend.Models.Site;
import com.bzdata.gestimospringbackend.Models.Ville;
import com.bzdata.gestimospringbackend.Services.AppelLoyerService;
import com.bzdata.gestimospringbackend.Utils.SmsOrangeConfig;
import com.bzdata.gestimospringbackend.company.entity.AgenceImmobiliere;
import com.bzdata.gestimospringbackend.company.repository.AgenceImmobiliereRepository;
import static com.bzdata.gestimospringbackend.constant.FileConstant.FOLDER_PATH;
import com.bzdata.gestimospringbackend.department.entity.Chapitre;
import com.bzdata.gestimospringbackend.department.repository.ChapitreRepository;
import static com.bzdata.gestimospringbackend.enumeration.Role.ROLE_SUPER_SUPERVISEUR;
import com.bzdata.gestimospringbackend.establishment.entity.Etablissement;
import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;
import com.bzdata.gestimospringbackend.establishment.repository.ChapitreUserRepository;
import com.bzdata.gestimospringbackend.establishment.repository.EtablissementRepository;
import com.bzdata.gestimospringbackend.repository.CommuneRepository;
import com.bzdata.gestimospringbackend.repository.MagasinRepository;
import com.bzdata.gestimospringbackend.repository.PaysRepository;
import com.bzdata.gestimospringbackend.repository.QuartierRepository;
import com.bzdata.gestimospringbackend.repository.RoleRepository;
import com.bzdata.gestimospringbackend.repository.SiteRepository;
import com.bzdata.gestimospringbackend.repository.VilleRepository;
import com.bzdata.gestimospringbackend.user.entity.Utilisateur;
import com.bzdata.gestimospringbackend.user.repository.UtilisateurRepository;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
@RequiredArgsConstructor
@Slf4j
@OpenAPIDefinition(
  info = @Info(
    title = "Gestimo API",
    version = "2.0",
    description = "Description de Gestimo"
  )
)
@SecurityScheme(
  name = "gestimoapi",
  scheme = "bearer",
  type = SecuritySchemeType.HTTP,
  in = SecuritySchemeIn.HEADER,
  bearerFormat = "JWT"
)
public class GestimoSpringBackendApplication {

  private static final String DEFAULT_AGENCY_NAME = "RESIDENCE SEVE";
  private static final String DEFAULT_AGENCY_SIGLE = "SEVE";
  private static final String SECONDARY_AGENCY_NAME = "MOLIBETY";
  private static final String SECONDARY_AGENCY_SIGLE = "MOLIBETY";

  @Value("${app.default-user-email:bossohpaulin@gmail.com}")
  private String defaultUserEmail;

  @Value("${app.default-agency-id:}")
  private String defaultAgencyIdOverride;

  public static void main(String[] args) {
    SpringApplication.run(GestimoSpringBackendApplication.class, args);
    new File(FOLDER_PATH).mkdirs();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public CommandLineRunner chargerDonnees(
    SiteRepository siteRepository,
    QuartierRepository quartierRepository,
    RoleRepository roleRepository,
    SmsOrangeConfig envoiSmsOrange,
    AppelLoyerService appelLoyerService,
    UtilisateurRepository utilisateurRepository,
    PasswordEncoder passwordEncoder,
    PaysRepository paysRepository,
    VilleRepository villeRepository,
    CommuneRepository communeRepository,
    AgenceImmobiliereRepository agenceImmobiliereRepository,
    MagasinRepository magasinRepository,
    ChapitreRepository chapitreRepository,
    ChapitreUserRepository chapitreUserRepository,
    EtablissementRepository defaultChapitreRepository
  ) {
    String mdp = passwordEncoder.encode("superviseur");
    Utilisateur utilisateur = new Utilisateur();
    Pays pays = new Pays();
    return args -> {
      try {
      appelLoyerService.miseAjourDesUnlockDesBaux(1L);
      // Creation des Constants
      // CHARGEMENT DU PAYS COTE D'IVOIRE
      Optional<Pays> oPays = paysRepository.findByAbrvPays("CI");
      if (!oPays.isPresent()) {
        pays.setAbrvPays("CI");
        pays.setIdAgence(1L);
        pays.setNomPays("Côte d'Ivoire");
        paysRepository.save(pays);
      }

      // CREATION DES AGENCES PAR DEFAUT
      createDefaultAgencyIfMissing(
        agenceImmobiliereRepository,
        DEFAULT_AGENCY_NAME,
        DEFAULT_AGENCY_SIGLE,
        "0700000001",
        "residence.seve@gestimo.local",
        "CI-SEVE-001"
      );
      createDefaultAgencyIfMissing(
        agenceImmobiliereRepository,
        SECONDARY_AGENCY_NAME,
        SECONDARY_AGENCY_SIGLE,
        "0700000002",
        "molibety@gestimo.local",
        "CI-MOLIBETY-001"
      );
      Long defaultAgencyId = resolveDefaultAgencyId(agenceImmobiliereRepository);

      Long couchDefaultChapitre = defaultChapitreRepository.count();
      System.out.println(couchDefaultChapitre);
      if (couchDefaultChapitre == 0) {
        Chapitre chapitre1 = chapitreRepository
          .findById(1L)
          .orElseGet(() -> {
            Chapitre chapitre = new Chapitre();
            chapitre.setLibelleChapitre("Chapitre par defaut 1");
            return chapitreRepository.save(chapitre);
          });
        Etablissement def1 = new Etablissement();
        def1.setIdChapitre(chapitre1.getId());
        def1.setLibChapitre(chapitre1.getLibelleChapitre());
        defaultChapitreRepository.save(def1);

        Chapitre chapitre2 = chapitreRepository
          .findById(2L)
          .orElseGet(() -> {
            Chapitre chapitre = new Chapitre();
            chapitre.setLibelleChapitre("Chapitre par defaut 2");
            return chapitreRepository.save(chapitre);
          });
        Etablissement def2 = new Etablissement();
        def2.setIdChapitre(chapitre2.getId());
        def2.setLibChapitre(chapitre2.getLibelleChapitre());
        defaultChapitreRepository.save(def2);
      }
      EtablissementUtilisateur chapitreUser = chapitreUserRepository
        .findById(1L)
        .orElse(null);
      if (chapitreUser == null) {
        Utilisateur userFind = utilisateurRepository.findById(2L).orElse(null);
        if (userFind != null) {
          List<Etablissement> etablissements = defaultChapitreRepository.findAll();
          if (!etablissements.isEmpty()) {
            EtablissementUtilisateur chapitreUser1 = new EtablissementUtilisateur(
              true,
              etablissements.get(0),
              userFind
            );
            chapitreUser1.setIdAgence(1L);
            chapitreUser1.setIdCreateur(1L);
            chapitreUserRepository.save(chapitreUser1);
          }

          if (etablissements.size() > 1) {
            EtablissementUtilisateur chapitreUser2 = new EtablissementUtilisateur(
              false,
              etablissements.get(1),
              userFind
            );
            chapitreUser2.setIdAgence(1L);
            chapitreUser2.setIdCreateur(1L);
            chapitreUserRepository.save(chapitreUser2);
          }
        } else {
          log.warn(
            "Initialisation ignoree: aucun utilisateur trouve avec l'id 2 pour EtablissementUtilisateur"
          );
        }
      }
      // CREATION VILLES
      Optional<Pays> p = paysRepository.findById(1L);
      if (p.isPresent()) {
        Optional<Ville> v = villeRepository.findById(1L);
        if (!v.isPresent()) {
          Stream
            .of("ABIDJAN", "ABOISSO")
            .forEach(vil -> {
              Ville ville = new Ville();
              if ("ABIDJAN".equals(vil)) {
                ville.setAbrvVille("ABJ");
              } else {
                ville.setAbrvVille("ABOI");
              }
              ville.setPays(p.get());
              ville.setNomVille(vil);
              ville.setIdAgence(1L);
              villeRepository.save(ville);
            });
        }
      }

      // CREATION DES COMMUNES
      List<Ville> lesVilles = villeRepository.findAll();
      lesVilles.forEach(v -> {
        Optional<Commune> maCommune1 = communeRepository.findById(1L);
        if (!maCommune1.isPresent()) {
          if (v.getAbrvVille().contains("ABJ")) {
            Stream
              .of(
                "Abobo",
                "Adjamé",
                "Anyama",
                "Attécoubé",
                "Bingerville",
                "Cocody",
                "Koumassi",
                "Marcory",
                "Plateau",
                "Port bouët",
                "Treichville",
                "Songon",
                "Yopougon"
              )
              .forEach(com -> {
                Commune commune1 = new Commune();
                commune1.setAbrvCommune(com.substring(0, 4));
                commune1.setNomCommune(com);
                commune1.setIdAgence(1L);
                commune1.setVille(v);
                communeRepository.save(commune1);
              });
          }
        }
      });

      // CREATIONS DES QUARTIERS

      Optional<Quartier> monQuartierVerification = quartierRepository.findById(
        1L
      );
      if (!monQuartierVerification.isPresent()) {
        List<Commune> lesCommunes = communeRepository.findAll();
        lesCommunes.forEach(comm -> {
          if (comm.getNomCommune().contains("Cocody")) {
            Stream
              .of("Abatta", "Aghien", "Dokui")
              .forEach(com -> {
                Quartier quartier = new Quartier();
                quartier.setAbrvQuartier(com.substring(0, 4));
                quartier.setNomQuartier(com);
                quartier.setIdAgence(1L);
                quartier.setCommune(comm);
                quartierRepository.save(quartier);
              });
          }
          if (comm.getNomCommune().contains("Anyama")) {
            Stream
              .of("Ebimpé")
              .forEach(com -> {
                Quartier quartier = new Quartier();
                quartier.setIdAgence(1L);
                quartier.setAbrvQuartier(com.substring(0, 3));
                quartier.setNomQuartier(com);
                quartier.setCommune(comm);
                quartierRepository.save(quartier);
              });
          }
          if (comm.getNomCommune().contains("Yopougon")) {
            Stream
              .of("Assanvon", "Niangon", "Port Bouet II")
              .forEach(com -> {
                Quartier quartier = new Quartier();
                quartier.setAbrvQuartier(com.substring(0, 4));
                quartier.setIdAgence(1L);
                quartier.setNomQuartier(com);
                quartier.setCommune(comm);
                quartierRepository.save(quartier);
              });
          }
        });
      }

      // GESTION DES SITES
      Optional<Site> monSite = siteRepository.findById(1L);
      if (!monSite.isPresent()) {
        List<Quartier> lesQuartiers = quartierRepository.findAll();
        lesQuartiers.forEach(quart -> {
          if (quart.getNomQuartier().contains("Assanvon")) {
            Site site = new Site();
            site.setIdAgence(1L);
            site.setAbrSite(
              StringUtils.deleteWhitespace(
                quart.getCommune().getVille().getPays().getAbrvPays()
              ) +
              "-" +
              StringUtils.deleteWhitespace(
                quart.getCommune().getVille().getAbrvVille()
              ) +
              "-" +
              StringUtils.deleteWhitespace(
                quart.getCommune().getAbrvCommune()
              ) +
              "-" +
              StringUtils.deleteWhitespace(quart.getAbrvQuartier())
            );
            site.setNomSite(
              quart.getCommune().getVille().getPays().getNomPays() +
              "-" +
              quart.getCommune().getVille().getNomVille() +
              "-" +
              quart.getCommune().getNomCommune() +
              "-" +
              quart.getNomQuartier()
            );
            site.setQuartier(quart);
            siteRepository.save(site);
          }
          if (quart.getNomQuartier().contains("Aghien")) {
            Site site = new Site();
            site.setIdAgence(1L);
            site.setAbrSite(
              StringUtils.deleteWhitespace(
                quart.getCommune().getVille().getPays().getAbrvPays()
              ) +
              "-" +
              StringUtils.deleteWhitespace(
                quart.getCommune().getVille().getAbrvVille()
              ) +
              "-" +
              StringUtils.deleteWhitespace(
                quart.getCommune().getAbrvCommune()
              ) +
              "-" +
              StringUtils.deleteWhitespace(quart.getAbrvQuartier())
            );
            site.setNomSite(
              quart.getCommune().getVille().getPays().getNomPays() +
              "-" +
              quart.getCommune().getVille().getNomVille() +
              "-" +
              quart.getCommune().getNomCommune() +
              "-" +
              quart.getNomQuartier()
            );
            site.setQuartier(quart);
            siteRepository.save(site);
          }
        });
      }

      // ROLES
      Optional<Role> roles = null;
      roles = roleRepository.findRoleByRoleName("SUPERVISEUR");
      if (!roles.isPresent()) {
        roleRepository.save(
          new Role("SUPERVISEUR", "Role de superviseur", null)
        );
      }
      roles = null;
      roles = roleRepository.findRoleByRoleName("GERANT");
      if (!roles.isPresent()) {
        roleRepository.save(new Role("GERANT", "Role de GERANT", null));
      }
      roles = null;
      roles = roleRepository.findRoleByRoleName("PROPRIETAIRE");
      if (!roles.isPresent()) {
        roleRepository.save(
          new Role("PROPRIETAIRE", "Role de PROPRIETAIRE", null)
        );
      }
      roles = null;
      roles = roleRepository.findRoleByRoleName("LOCATAIRE");
      if (!roles.isPresent()) {
        roleRepository.save(new Role("LOCATAIRE", "Role de LOCATAIRE", null));
      }

      roles = null;
      roles = roleRepository.findRoleByRoleName("CLIENT HOTEL");
      if (!roles.isPresent()) {
        roleRepository.save(
          new Role("CLIENT HOTEL", "Role de CLIENT HOTEL", null)
        );
      }
      roles = null;
      roles = roleRepository.findRoleByRoleName("SUPERVISEUR");
      if (roles.isPresent()) {
        Utilisateur userPrincipalSuperviseur = utilisateurRepository.findUtilisateurByEmail(
          defaultUserEmail
        ).orElse(null);
        if (userPrincipalSuperviseur == null) {
          utilisateur.setUrole(roles.get());
          utilisateur.setUtilisateurIdApp(generateUserId());
          utilisateur.setNom("BOSSOH");
          utilisateur.setPrenom("SUPERVISEUR PRENOM");
          utilisateur.setEmail(defaultUserEmail);
          utilisateur.setMobile("0103833350");
          utilisateur.setDateDeNaissance(LocalDate.parse("1980-01-08"));
          utilisateur.setLieuNaissance("Abidjan");
          utilisateur.setTypePieceIdentite("CNI");
          utilisateur.setNumeroPieceIdentite("1236544");
          utilisateur.setDateFinPiece(LocalDate.parse("2022-01-08"));
          utilisateur.setDateDebutPiece(LocalDate.parse("2016-01-08"));
          utilisateur.setNationalite("Ivoirienne");
          utilisateur.setGenre("M");
          utilisateur.setActivated(true);
          utilisateur.setUsername(defaultUserEmail);
          utilisateur.setPassword(mdp);
          utilisateur.setIdAgence(defaultAgencyId);
          utilisateur.setJoinDate(new Date());
          utilisateur.setRoleUsed(ROLE_SUPER_SUPERVISEUR.name());
          utilisateur.setAuthorities(ROLE_SUPER_SUPERVISEUR.getAuthorities());
          utilisateur.setActive(true);
          utilisateur.setNonLocked(true);
          utilisateurRepository.save(utilisateur);
        } else if (
          userPrincipalSuperviseur.getIdAgence() == null ||
          !agenceImmobiliereRepository.existsById(userPrincipalSuperviseur.getIdAgence())
        ) {
          userPrincipalSuperviseur.setIdAgence(defaultAgencyId);
          userPrincipalSuperviseur.setUsername(userPrincipalSuperviseur.getEmail());
          utilisateurRepository.save(userPrincipalSuperviseur);
        } else if (
          !org.springframework.util.StringUtils.hasText(userPrincipalSuperviseur.getUsername()) ||
          !userPrincipalSuperviseur.getUsername().equals(userPrincipalSuperviseur.getEmail())
        ) {
          userPrincipalSuperviseur.setUsername(userPrincipalSuperviseur.getEmail());
          utilisateurRepository.save(userPrincipalSuperviseur);
        }
      } // CREATION DU SUPERUTILISATEUR
      } catch (Exception e) {
        log.error(
          "Erreur pendant l'initialisation de donnees. L'application continue de demarrer.",
          e
        );
      }
    };
  }

  private String generateUserId() {
    return "User-" + RandomStringUtils.randomAlphanumeric(5);
  }

  private void createDefaultAgencyIfMissing(
    AgenceImmobiliereRepository agenceImmobiliereRepository,
    String nomAgence,
    String sigleAgence,
    String mobileAgence,
    String emailAgence,
    String compteContribuable
  ) {
    boolean agenceExist = agenceImmobiliereRepository
      .findAll()
      .stream()
      .anyMatch(agence ->
        nomAgence.equalsIgnoreCase(agence.getNomAgence()) ||
        sigleAgence.equalsIgnoreCase(agence.getSigleAgence()) ||
        emailAgence.equalsIgnoreCase(agence.getEmailAgence())
      );
    if (agenceExist) {
      return;
    }

    AgenceImmobiliere agence = new AgenceImmobiliere();
    agence.setNomAgence(nomAgence);
    agence.setSigleAgence(sigleAgence);
    agence.setTelAgence(mobileAgence);
    agence.setMobileAgence(mobileAgence);
    agence.setEmailAgence(emailAgence);
    agence.setCompteContribuable(compteContribuable);
    agence.setRegimeFiscaleAgence("REGIME REEL");
    agence.setFaxAgence("00000000");
    agence.setAdresseAgence("ABIDJAN");
    agence.setCapital(1000000);
    agence.setIdCreateur(1L);

    AgenceImmobiliere agenceSaved = agenceImmobiliereRepository.save(agence);
    agenceSaved.setIdAgence(agenceSaved.getId());
    agenceImmobiliereRepository.save(agenceSaved);
    log.info("Agence par defaut creee au demarrage: {}", nomAgence);
  }

  private Long resolveDefaultAgencyId(
    AgenceImmobiliereRepository agenceImmobiliereRepository
  ) {
    if (StringUtils.isNotBlank(defaultAgencyIdOverride)) {
      try {
        Long override = Long.valueOf(defaultAgencyIdOverride.trim());
        if (agenceImmobiliereRepository.existsById(override)) {
          return override;
        }
        log.warn(
          "app.default-agency-id={} ignore (agence inexistante)",
          defaultAgencyIdOverride
        );
      } catch (NumberFormatException e) {
        log.warn(
          "app.default-agency-id={} ignore (valeur invalide)",
          defaultAgencyIdOverride
        );
      }
    }

    List<AgenceImmobiliere> agencies = agenceImmobiliereRepository.findAll();

    Optional<Long> byDefaultName = agencies
      .stream()
      .filter(agence ->
        DEFAULT_AGENCY_NAME.equalsIgnoreCase(agence.getNomAgence()) ||
        DEFAULT_AGENCY_SIGLE.equalsIgnoreCase(agence.getSigleAgence())
      )
      .findFirst()
      .map(agence -> agence.getIdAgence() != null ? agence.getIdAgence() : agence.getId());
    if (byDefaultName.isPresent()) {
      return byDefaultName.get();
    }

    return agencies
      .stream()
      .map(agence -> agence.getIdAgence() != null ? agence.getIdAgence() : agence.getId())
      .filter(id -> id != null)
      .min(Long::compareTo)
      .orElse(1L);
  }
}
