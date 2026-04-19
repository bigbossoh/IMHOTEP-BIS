import { PageReglementReservationIndividuelComponent } from './pages/residence/page-reglement-reservation-individuel/page-reglement-reservation-individuel.component';
import { PageAideComponent } from './pages/page-aide/page-aide.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageStatistiqueComponent } from './pages/page-statistique/page-statistique.component';
import { PageSiteComponent } from './pages/site/page-site/page-site.component';
import { PageAgenceComponent } from './pages/agence/page-agence/page-agence.component';
import { PageLocataireComponent } from './pages/utilisateurs/locataire/page-locataire/page-locataire.component';
import { PageGerantComponent } from './pages/utilisateurs/gérant/page-gerant/page-gerant.component';
import { PageSuperviseurComponent } from './pages/utilisateurs/superviseur/page-superviseur/page-superviseur.component';
import { PageProprietaireComponent } from './pages/utilisateurs/propriétaire/page-proprietaire/page-proprietaire.component';
import { PageVueEnsembleComponent } from './pages/vue-ensemple/page-vue-ensemble/page-vue-ensemble.component';
import { AppelsLoyersComponent } from './pages/appel-loyer/appels-loyers/appels-loyers.component';
import { RelanceAppelsComponent } from './pages/appel-loyer/relance-appels/relance-appels.component';
import { PageBienImmobilierComponent } from './pages/bien-immobilier/page-bien-immobilier/page-bien-immobilier.component';
import { PageBauxComponent } from './pages/baux/page-baux/page-baux.component';
import { PageBienSiteGeographiqueComponent } from './pages/bien-immobilier/page-bien-site-geographique/page-bien-site-geographique.component';
import { PageReglementIndividuelComponent } from './pages/reglement/page-reglement-individuel/page-reglement-individuel.component';
import { PageReglementGroupeComponent } from './pages/reglement/page-reglement-groupe/page-reglement-groupe.component';
import { PageJournalCaisseComponent } from './pages/comptabilite/page-journal-caisse/page-journal-caisse.component';
import { PageCompteClientComponent } from './pages/comptabilite/page-compte-client/page-compte-client.component';
import { PageCompteAgenceComponent } from './pages/comptabilite/page-compte-agence/page-compte-agence.component';
import { PageGrandCompteComponent } from './pages/comptabilite/page-grand-compte/page-grand-compte.component';
import { PageListeUtilisateursComponent } from './pages/utilisateurs/page-liste-utilisateurs/page-liste-utilisateurs.component';
import { PageBauxLoyersComponent } from './pages/baux/page-baux-loyers/page-baux-loyers.component';
import { ApplicationGuardService } from './services/guard/application-guard.service';
import { PagePaiementComponent } from './pages/reglement/page-paiement/page-paiement.component';
import { PageImmeubleComponent } from './pages/bien-immobilier/immeuble/page-immeuble/page-immeuble.component';
import { PageEtageComponent } from './pages/bien-immobilier/page-etage/page-etage/page-etage.component';
import { TachesPlanifieesComponent } from './pages/tachesPlanifiees/taches-planifiees/taches-planifiees.component';
import { PageGestionDroitComponent } from './pages/roles-droits/page-gestion-droit/page-gestion-droit.component';
import { PageReservationResidenceComponent } from './pages/residence/page-reservation/page-reservation-residence/page-reservation-residence.component';
import { PageDisponibiliteResidenceComponent } from './pages/residence/page-disponibilite-appartement/page-disponibilite-residence/page-disponibilite-residence.component';
import { PageClientResidenceComponent } from './pages/residence/page-client-residence/page-client-residence/page-client-residence.component';
import { PageChatIaComponent } from './pages/Chatgpt/page-chat-ia/page-chat-ia.component';
import { PageConsultationReglementLoyerPeriodeComponent } from './pages/comptabilite/page-consultation-reglement-loyer-periode/page-consultation-reglement-loyer-periode.component';
import { PageDashboardResidenceComponent } from './pages/residence/page-dashboard-residence/page-dashboard-residence.component';
import { PageAjoutReservationComponent } from './pages/residence/page-ajout-reservation/page-ajout-reservation.component';
import { PageConsultationDepenseComponent } from './pages/comptabilite/page-consultation-depense/page-consultation-depense.component';
import { PageParametrageDepensesComponent } from './pages/comptabilite/page-parametrage-depenses/page-parametrage-depenses.component';
import { ClotureCaisseComponent } from './pages/cloture-caisse/cloture-caisse.component';
import { CategorieAppartementComponent } from './pages/categorie-appartement/categorie-appartement.component';
import { NewCategorieChambreComponent } from './pages/categorie-appartement/new-categorie-chambre/new-categorie-chambre.component';
import { NewPrixCategorieChambreComponent } from './pages/bien-immobilier/new-prix-categorie-chambre/new-prix-categorie-chambre.component';
import { PageReglementResidenceComponent } from './pages/residence/page-reglement/page-reglement-residence/page-reglement-residence.component';
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PageResetPasswordComponent } from './pages/page-reset-password/page-reset-password.component';
import { PageAuditComponent } from './pages/audit/page-audit.component';
import { PageRapportBiensDisponiblesComponent } from './pages/bien-immobilier/page-rapport-biens-disponibles/page-rapport-biens-disponibles.component';
import { PageFonctionnalitesUtilisateursComponent } from './pages/utilisateurs/page-fonctionnalites-utilisateurs/page-fonctionnalites-utilisateurs.component';
import { PageGestionDepenseComponent } from './pages/depense/page-gestion-depense/page-gestion-depense.component';
import { PageParametreDepenseComponent } from './pages/depense/page-parametre-depense/page-parametre-depense.component';
import { PageCategoriesDepenseComponent } from './pages/depense/page-categories-depense/page-categories-depense.component';
import { PageParametreResidenceComponent } from './pages/residence/page-parametre-residence/page-parametre-residence/page-parametre-residence.component';
import { PageCreationResidenceComponent } from './pages/residence/page-creation-residence/page-creation-residence/page-creation-residence.component';
import { PagePrestationsResidenceComponent } from './pages/residence/page-prestations/page-prestations-residence/page-prestations-residence.component';
import { PageFacturesReservationComponent } from './pages/residence/page-factures-reservation/page-factures-reservation.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: PageLoginComponent,
  },
  {
    path: 'reset-password',
    component: PageResetPasswordComponent,
  },
  {
    path: '',
    component: PageDashboardComponent,
    canActivate: [ApplicationGuardService],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'statistiques',
        component: PageStatistiqueComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'dashboard',
        component: PageVueEnsembleComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'profil',
        component: PageProfileComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'sites',
        component: PageSiteComponent,
        canActivate: [ApplicationGuardService],
      },

      {
        path: 'new-prix-categorie-chambre',
        component: NewPrixCategorieChambreComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'paiement',
        component: PagePaiementComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'new-categorie-appartement',
        component: NewCategorieChambreComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'categorie-appartement',
        component: CategorieAppartementComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'agences',
        component: PageAgenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'locataires',
        component: PageLocataireComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'proprietaires',
        component: PageProprietaireComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'gerants',
        component: PageGerantComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'Superviseurs',
        component: PageSuperviseurComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'bail-loyers',
        component: PageBauxLoyersComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'appelloyers',
        component: AppelsLoyersComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'relance',
        component: RelanceAppelsComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'bien-immobilier',
        component: PageBienImmobilierComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'rapport-biens-disponibles',
        component: PageRapportBiensDisponiblesComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'baux',
        component: PageBauxComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'bien-par-site',
        component: PageBienSiteGeographiqueComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'reglement-individuel',
        component: PageReglementIndividuelComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'reglement-groupe',
        component: PageReglementGroupeComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'journal-caisse',
        component: PageJournalCaisseComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'compte-client',
        component: PageCompteClientComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'compte-agence',
        component: PageCompteAgenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'grand-compte',
        component: PageGrandCompteComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'liste-utilisateurs',
        component: PageListeUtilisateursComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'fonctionnalites-utilisateurs',
        component: PageFonctionnalitesUtilisateursComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'liste-immeubles',
        component: PageImmeubleComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'liste-etages',
        component: PageEtageComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'liste-taches-planifiees',
        component: TachesPlanifieesComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'liste-gestion-roles-droits',
        component: PageGestionDroitComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'reservation-residence',
        component: PageReservationResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'residences',
        component: PageParametreResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'nouvelle-residence',
        component: PageCreationResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'paiement-residence',
        component: PageReglementResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'prestations-residence',
        component: PagePrestationsResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'factures-reservation',
        component: PageFacturesReservationComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'paiement-residence-individuel',
        component: PageReglementReservationIndividuelComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'disponibilite-residence',
        component: PageDisponibiliteResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'client-residence',
        component: PageClientResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'chat-ia',
        component: PageChatIaComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'reglement-periode-loyer',
        component: PageConsultationReglementLoyerPeriodeComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'dashboard-residence',
        component: PageDashboardResidenceComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'ajout-reservation',
        component: PageAjoutReservationComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'page-consultation-depense',
        component: PageConsultationDepenseComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'parametrage-depenses',
        component: PageParametrageDepensesComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'gestion-depenses',
        component: PageGestionDepenseComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'config-depenses',
        component: PageParametreDepenseComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'categories-depenses',
        component: PageCategoriesDepenseComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'cloture-caisse',
        component: ClotureCaisseComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'audit',
        component: PageAuditComponent,
        canActivate: [ApplicationGuardService],
      },
      {
        path: 'aide',
        component: PageAideComponent,
        canActivate: [ApplicationGuardService],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
