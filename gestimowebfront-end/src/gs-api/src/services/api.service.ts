/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { AgenceImmobilierDTO } from '../models/agence-immobilier-dto';
import { AgenceResponseDto } from '../models/agence-response-dto';
import { AgenceRequestDto } from '../models/agence-request-dto';
import { AppartementDto } from '../models/appartement-dto';
import { AppelLoyersFactureDto } from '../models/appel-loyers-facture-dto';
import { PeriodeDto } from '../models/periode-dto';
import { AnneeAppelLoyersDto } from '../models/annee-appel-loyers-dto';
import { AppelLoyerDto } from '../models/appel-loyer-dto';
import { MessageEnvoyerDto } from '../models/message-envoyer-dto';
import { PourcentageAppelDto } from '../models/pourcentage-appel-dto';
import { AppelLoyerRequestDto } from '../models/appel-loyer-request-dto';
import { StatistiquePeriodeDto } from '../models/statistique-periode-dto';
import { Utilisateur } from '../models/utilisateur';
import { AuthRequestDto } from '../models/auth-request-dto';
import { LocataireEncaisDTO } from '../models/locataire-encais-dto';
import { OperationDto } from '../models/operation-dto';
import { BailModifDto } from '../models/bail-modif-dto';
import { BailAppartementDto } from '../models/bail-appartement-dto';
import { BailMagasinDto } from '../models/bail-magasin-dto';
import { BailVillaDto } from '../models/bail-villa-dto';
import { BienImmobilierAffiheDto } from '../models/bien-immobilier-affihe-dto';
import { CategoryChambreSaveOrUpdateDto } from '../models/category-chambre-save-or-update-dto';
import { ClotureCaisseDto } from '../models/cloture-caisse-dto';
import { CommuneRequestDto } from '../models/commune-request-dto';
import { CommuneResponseDto } from '../models/commune-response-dto';
import { DroitAccesDTO } from '../models/droit-acces-dto';
import { DroitAccesPayloadDTO } from '../models/droit-acces-payload-dto';
import { EncaissementPrincipalDTO } from '../models/encaissement-principal-dto';
import { AppelLoyerEncaissDto } from '../models/appel-loyer-encaiss-dto';
import { EncaissementPayloadDto } from '../models/encaissement-payload-dto';
import { EspeceEncaissementDto } from '../models/espece-encaissement-dto';
import { EtablissementUtilisateurDto } from '../models/etablissement-utilisateur-dto';
import { EtageDto } from '../models/etage-dto';
import { EtageAfficheDto } from '../models/etage-affiche-dto';
import { GroupeDroitDto } from '../models/groupe-droit-dto';
import { ImageDataDto } from '../models/image-data-dto';
import { ImmeubleEtageDto } from '../models/immeuble-etage-dto';
import { ImmeubleDto } from '../models/immeuble-dto';
import { MagasinResponseDto } from '../models/magasin-response-dto';
import { MagasinDto } from '../models/magasin-dto';
import { MontantLoyerBailDto } from '../models/montant-loyer-bail-dto';
import { PaysDto } from '../models/pays-dto';
import { PrestationSaveOrUpdateDto } from '../models/prestation-save-or-update-dto';
import { InputStreamResource } from '../models/input-stream-resource';
import { PrixParCategorieChambreDto } from '../models/prix-par-categorie-chambre-dto';
import { QuartierRequestDto } from '../models/quartier-request-dto';
import { ReservationAfficheDto } from '../models/reservation-affiche-dto';
import { EncaissementReservationDto } from '../models/encaissement-reservation-dto';
import { EncaissementReservationRequestDto } from '../models/encaissement-reservation-request-dto';
import { ReservationSaveOrUpdateDto } from '../models/reservation-save-or-update-dto';
import { ReservationRequestDto } from '../models/reservation-request-dto';
import { PrestationAdditionnelReservationSaveOrrUpdate } from '../models/prestation-additionnel-reservation-save-orr-update';
import { SiteResponseDto } from '../models/site-response-dto';
import { SiteRequestDto } from '../models/site-request-dto';
import { SuivieDepenseDto } from '../models/suivie-depense-dto';
import { SuivieDepenseEncaisPeriodeDto } from '../models/suivie-depense-encais-periode-dto';
import { UtilisateurAfficheDto } from '../models/utilisateur-affiche-dto';
import { UtilisateurRequestDto } from '../models/utilisateur-request-dto';
import { VillaDto } from '../models/villa-dto';
import { VilleDto } from '../models/ville-dto';
@Injectable({
  providedIn: 'root',
})
class ApiService extends __BaseService {
  static readonly getAllAgenceByOrderAgencePath = 'api/v1/agences/all/{idAgence}';
  static readonly deleteAgenceByIdAgencePath = 'api/v1/agences/deleteagence/{id}';
  static readonly getAgenceByEmailAgencePath = 'api/v1/agences/getagencebyemail/{email}';
  static readonly getAgenceByIDAgencePath = 'api/v1/agences/getagencebyid/{id}';
  static readonly authenticateAgencePath = 'api/v1/agences/signup';
  static readonly findAllAppartementPath = 'api/v1/appartement/all/{id}';
  static readonly findAllAppartementLibrePath = 'api/v1/appartement/alllmeublelibre/{idAgence}';
  static readonly findAllAppartementMeublePath = 'api/v1/appartement/allmeuble/{id}';
  static readonly deleteAppartementPath = 'api/v1/appartement/delete/{id}';
  static readonly findByIDAppartementPath = 'api/v1/appartement/findById/{id}';
  static readonly findByIdEtageAppartementPath = 'api/v1/appartement/findByIdEtage/{id}';
  static readonly findByNameAppartementPath = 'api/v1/appartement/findByName/{name}';
  static readonly findAllAppartementByIdCategoriePath = 'api/v1/appartement/findallappartementbyidcategorie/{id}';
  static readonly saveAppartementPath = 'api/v1/appartement/save';
  static readonly saveForCategoriePath = 'api/v1/appartement/saveForCategorie';
  static readonly deleteAppelDtoPath = 'api/v1/appelloyer/clotureOfAppelDtoByID/{id}';
  static readonly AppelLoyersParPeriodePath = 'api/v1/appelloyer/findAllAppelloyerByPeriode/{periode}/{idAgence}';
  static readonly listTousAppelsLoyersPath = 'api/v1/appelloyer/findAllAppelsLoyer/{idAgence}';
  static readonly findAllPeriodePath = 'api/v1/appelloyer/findAllPeriodeAppel/{idAgence}';
  static readonly findAllPeriodeByAnneePath = 'api/v1/appelloyer/findAllPeriodeByAnnee/{annee}/{idAgence}';
  static readonly findAllPeriodeChiffreEtLettreByAnneePath = 'api/v1/appelloyer/findAllPeriodeChiffreEtLettreByAnnee/{annee}/{idAgence}';
  static readonly AppelLoyersParIdPath = 'api/v1/appelloyer/findAppelloyer/{id}';
  static readonly listDesLoyersParBailPath = 'api/v1/appelloyer/findAppelsByIdBail/{idBail}';
  static readonly listDesLoyersImpayerParBailPath = 'api/v1/appelloyer/findAppelsImpayerByIdBail/{id}';
  static readonly findByIdAndBailPath = 'api/v1/appelloyer/findByIdAndBail/{idBien}/{periode}';
  static readonly getFirstLoyerImpayerByBienPath = 'api/v1/appelloyer/getFirstLoyerImpayerByBien/{id}';
  static readonly impayeLoyerParAnneePath = 'api/v1/appelloyer/impayeParAnnee/{annee}/{idAgence}/{chapitre}';
  static readonly impayeLoyerParMoisAppelLoyerPath = 'api/v1/appelloyer/impayeParMois/{periode}/{idAgence}/{chapitre}';
  static readonly listMessageEnvoyerAUnLocatairePath = 'api/v1/appelloyer/listMessageEnvoyerAUnLocataire/{login}';
  static readonly listOfDistinctAnneeAppelPath = 'api/v1/appelloyer/listOfDistinctAnneeAppel/{idAgence}';
  static readonly listeDesloyerSuperieurAUnePeriodePath = 'api/v1/appelloyer/listeDesloyerSuperieurAUnePeriode/{idBien}/{periode}';
  static readonly miseAjourDesUnlockDesBauxPath = 'api/v1/appelloyer/miseAjourDesUnlockDesBaux/{idAgence}';
  static readonly nombreImpayerLoyerParMoisPath = 'api/v1/appelloyer/nombreImpayerLoyerParMois/{periode}/{idAgence}/{chapitre}';
  static readonly nombrePayerLoyerParMoisPath = 'api/v1/appelloyer/nombrePayerLoyerParMois/{periode}/{idAgence}/{chapitre}';
  static readonly payeLoyerParAnneePath = 'api/v1/appelloyer/payeParAnnee/{annee}/{idAgence}/{chapitre}';
  static readonly payeLoyerParMoisPath = 'api/v1/appelloyer/payeParMois/{periode}/{idAgence}/{chapitre}';
  static readonly ReductionLoyerByPeriodePath = 'api/v1/appelloyer/reductionLoyerByPeriode';
  static readonly saveAppelLoyersPath = 'api/v1/appelloyer/save';
  static readonly staisiqueLoyerParMoisPath = 'api/v1/appelloyer/staisiqueLoyerParMois/{periode}/{idAgence}/{chapitre}';
  static readonly statistiqueLoyerParAnneePath = 'api/v1/appelloyer/statistiqueLoyerParAnnee/{annee}/{idAgence}/{chapitre}';
  static readonly supprimerPaiementAppelPath = 'api/v1/appelloyer/supprimerPaiementAppel/{idPeriode}/{idBail}';
  static readonly verifyAccountPath = 'api/v1/auth/accountVerification/{token}';
  static readonly loginPath = 'api/v1/auth/login';
  static readonly bailByLocataireEtBienPath = 'api/v1/bail/bailLocataireetbien/{locataire}/{bien}';
  static readonly clotureBailPath = 'api/v1/bail/clotureBail/{id}';
  static readonly findOperationByIdPath = 'api/v1/bail/findoperationbyid/{id}';
  static readonly listDesBauxPourUnBienImmobilierPath = 'api/v1/bail/getallbailbybien/{id}';
  static readonly listDesBauxPourUnLocatairePath = 'api/v1/bail/getallbailbylocataire/{id}';
  static readonly nombrebailactifPath = 'api/v1/bail/nombrebailactif/{idAgence}';
  static readonly nombrebailnonactifPath = 'api/v1/bail/nombrebailnonactif/{idAgence}';
  static readonly modifierUnBailPath = 'api/v1/bail/save';
  static readonly supprimerBailPath = 'api/v1/bail/supprimerBail/{id}';
  static readonly findAllBailAppartementPath = 'api/v1/bailappartement/all/{idAgence}';
  static readonly findAllOperationsPath = 'api/v1/bailappartement/alloperation/{idAgence}';
  static readonly deleteBailAppartementPath = 'api/v1/bailappartement/delete/{id}';
  static readonly findByIDBailAppartementPath = 'api/v1/bailappartement/findById/{id}';
  static readonly findByNameBailAppartementPath = 'api/v1/bailappartement/findByName/{name}';
  static readonly saveBailAppartementPath = 'api/v1/bailappartement/save';
  static readonly findAllBailMagasinPath = 'api/v1/bailmagasin/all/{idAgence}';
  static readonly deleteBailMagasinPath = 'api/v1/bailmagasin/delete/{id}';
  static readonly findByIDBailMagasinPath = 'api/v1/bailmagasin/findById/{id}';
  static readonly findByNameBailMagasinPath = 'api/v1/bailmagasin/findByName/{name}';
  static readonly saveBailMagasinPath = 'api/v1/bailmagasin/save';
  static readonly findAllBailVillaPath = 'api/v1/bailvilla/all/{idAgence}';
  static readonly deleteBailVillaPath = 'api/v1/bailvilla/delete/{id}';
  static readonly findBailVillaByIDPath = 'api/v1/bailvilla/findById/{id}';
  static readonly findBailVillaByNamePath = 'api/v1/bailvilla/findByName/{name}';
  static readonly saveBailVillaPath = 'api/v1/bailvilla/save';
  static readonly findAllBienPath = 'api/v1/bienImmobilier/all/{idAgence}/{chapitre}';
  static readonly findAllBienOqpPath = 'api/v1/bienImmobilier/allBienOccuper/{idAgence}/{chapitre}';
  static readonly rattacherUnBienAUnChapitrePath = 'api/v1/bienImmobilier/rattacherUnBienAUnChapitre/{idBien}/{chapitre}';
  static readonly findAllCategorieChambrePath = 'api/v1/categoriechambre/all/{idAgence}';
  static readonly deleteCategoryChambrePath = 'api/v1/categoriechambre/delete/{id}';
  static readonly findCategorieChambreByIDPath = 'api/v1/categoriechambre/findById/{id}';
  static readonly findCategorieByIdAppartementPath = 'api/v1/categoriechambre/findCategorieByIdAppartement/{idAppart}';
  static readonly saveOrUpdateCategoryChambrePath = 'api/v1/categoriechambre/saveOrUpdateCategoryChambre';
  static readonly saveorupdateCategoryChambrePath = 'api/v1/categoriechambre/saveorupdate';
  static readonly countInitClotureByCaissiaireAndChampitrePath = 'api/v1/cloturecaisse/countInitClotureByCaissiaireAndChampitre/{idCaisse}/{chapitre}';
  static readonly findAllByCaissierAndChapitrePath = 'api/v1/cloturecaisse/countInitClotureByCaissiaireAndChampitre/{idCaisse}/{chapitre}';
  static readonly findAllCloturerCaisseAgencePath = 'api/v1/cloturecaisse/findAllCloturerCaisseAgence';
  static readonly findAllCloturerCaisseByDateAndChapitrePath = 'api/v1/cloturecaisse/findAllCloturerCaisseByDateAndChapitre/{idCaisse}/{chapitre}/{dateDuJoure}';
  static readonly findNonCloturerByDateAndCaisseAndChapitrePath = 'api/v1/cloturecaisse/findNonCloturerByDateAndCaisseAndChapitre/{idCaisse}/{chapitre}/{dateDuJoure}';
  static readonly saveClotureCaissePath = 'api/v1/cloturecaisse/savecloturecaisse';
  static readonly findAllCommunePath = 'api/v1/commune/all';
  static readonly deleteCommunePath = 'api/v1/commune/delete/{id}';
  static readonly findCommuneByIDPath = 'api/v1/commune/findById/{id}';
  static readonly findCommuneByIdPaysPath = 'api/v1/commune/findByIdVille/{id}';
  static readonly findCommuneByNamePath = 'api/v1/commune/findByName/{name}';
  static readonly saveCommunePath = 'api/v1/commune/save';
  static readonly findAllDroitAccessPath = 'api/v1/droitAccess/';
  static readonly saveDroitAccessPath = 'api/v1/droitAccess/save';
  static readonly findByIdDroitAccessPath = 'api/v1/droitAccess/{droitAccessid}';
  static readonly deleteDroitAccessPath = 'api/v1/droitAccess/{droitAccessid}';
  static readonly findAllEncaissementByIdLocatirePath = 'api/v1/encaissement/allEncaissementByIdLocatire/{idLocatire}';
  static readonly findAllEncaissementByIdBienImmobilierPath = 'api/v1/encaissement/allencaissementByIdBien/{id}';
  static readonly listTousEncaissementsPrincipalPath = 'api/v1/encaissement/findAllEncaissementPrincipal/{idAgence}';
  static readonly findByIdEncaissementPath = 'api/v1/encaissement/findByIdEncaissement/{id}';
  static readonly getTotalEncaissementparPeriodePath = 'api/v1/encaissement/getTotalEncaissementparPeriode/{idAgence}/{datedebut}/{datefin}';
  static readonly getTotalEncaissementsEtMontantsDeLoyerParMoisPath = 'api/v1/encaissement/getTotalEncaissementsEtMontantsDeLoyerParMois/{idAgence}/{datedebut}/{datefin}';
  static readonly getTotalEncaissementsParMoisPath = 'api/v1/encaissement/getTotalEncaissementsParMois/{idAgence}/{datedebut}/{datefin}';
  static readonly listeEncaisseLoyerEntreDeuxDatePath = 'api/v1/encaissement/listeEncaisseLoyerEntreDeuxDate/{idAgence}/{datedebut}/{datefin}';
  static readonly listeEncaissementEntreDeuxDateParChapitreEtCaissePath = 'api/v1/encaissement/listeEncaissementEntreDeuxDateParChapitreEtCaisse/{idEncaiss}/{idChapitre}/{debut}/{fin}';
  static readonly listeLocataireImpayerParAgenceEtPeriodePath = 'api/v1/encaissement/listeLocataireImpayerParAgenceEtPeriode/{agence}/{periode}';
  static readonly miseAJourEncaissementCloturerPath = 'api/v1/encaissement/miseAJourEncaissementCloturer/{idEncaiss}';
  static readonly saveEncaissementPath = 'api/v1/encaissement/saveencaissement';
  static readonly saveEncaissementAvecretourDeListePath = 'api/v1/encaissement/saveencaissementavecretour';
  static readonly saveEncaissementMassePath = 'api/v1/encaissement/saveencaissementmasse';
  static readonly saveEncaissementMasseAvecretourDeListePath = 'api/v1/encaissement/saveencaissementmasseavecretour';
  static readonly sommeEncaissementParAgenceEtParPeriodePath = 'api/v1/encaissement/sommeEncaissementParAgenceEtParPeriode/{idAgence}/{datedebut}/{datefin}';
  static readonly sommeLoyerParAgenceEtParPeriodePath = 'api/v1/encaissement/sommeLoyerParAgenceEtParPeriode/{idAgence}/{datedebut}/{datefin}';
  static readonly totalencaissementParIdAppelLoyerPath = 'api/v1/encaissement/totalencaissement/{id}';
  static readonly totalEncaissementParJourPath = 'api/v1/encaissement/totalencaissementjournalier/{jour}/{idAgence}/{chapitre}';
  static readonly sendMailGrouperWithAttachmentPath = 'api/v1/envoimail/sendmailgrouper/{periode}/{idAgence}';
  static readonly sendMailQuittanceWithAttachmentPath = 'api/v1/envoimail/sendquittancebymail/{id}';
  static readonly saveEspeceEncaissementPath = 'api/v1/especeencaissement/save';
  static readonly getDefaultEtablePath = 'api/v1/etablissement/getDefaultEtable/{id}';
  static readonly findAllEtagePath = 'api/v1/etage/all/{idAgence}';
  static readonly deleteEtagePath = 'api/v1/etage/delete/{id}';
  static readonly findEtageByIDPath = 'api/v1/etage/findById/{id}';
  static readonly affichageDesEtageParImmeublePath = 'api/v1/etage/findByIdImmeuble/{id}';
  static readonly findEtageByNamePath = 'api/v1/etage/findByName/{name}';
  static readonly saveEtagePath = 'api/v1/etage/save';
  static readonly findAllGroupeDroitPath = 'api/v1/groupeDroit/';
  static readonly saveGroupeDroitPath = 'api/v1/groupeDroit/save';
  static readonly findByIdGroupeDroitPath = 'api/v1/groupeDroit/{groupedroitid}';
  static readonly deleteGroupeDroitPath = 'api/v1/groupeDroit/{groupedroitid}';
  static readonly telechagerImagePath = 'api/v1/image/imagesbybien/{id}';
  static readonly uploadImagePath = 'api/v1/image/upload/{id}/{name}';
  static readonly affichageDesImmeublesPath = 'api/v1/immeuble/affichetoutlesimmeubles/{idAgence}';
  static readonly findAllImmeublePath = 'api/v1/immeuble/all/{idAgence}';
  static readonly deleteImmeublePath = 'api/v1/immeuble/deleteImmeuble/{id}';
  static readonly findImmeubleByIDPath = 'api/v1/immeuble/findById/{id}';
  static readonly findImmeubleByIdSitePath = 'api/v1/immeuble/findByIdSite/{id}';
  static readonly findImmeubleByNamePath = 'api/v1/immeuble/findByName/{name}';
  static readonly saveImmeubleEtagePath = 'api/v1/immeuble/saveImeubleEtage';
  static readonly findAllMagasinPath = 'api/v1/magasin/all/{idAgence}';
  static readonly findAllMagasinLibrePath = 'api/v1/magasin/alllibre/{idAgence}';
  static readonly findAllMagasinByEtagePath = 'api/v1/magasin/findAllMagasinByIdEtage/{id}';
  static readonly findAllMagasinByIdSitePath = 'api/v1/magasin/findAllMagasinByIdSite/{idSite}';
  static readonly findByNameMagasinDtoPath = 'api/v1/magasin/findByName/{name}';
  static readonly findByIDMagasinPath = 'api/v1/magasin/findmagasinById/{id}';
  static readonly saveMagasinReturnDtoPath = 'api/v1/magasin/savemagasin';
  static readonly findByIDMontantLoyerBailPath = 'api/v1/montantloyerbail/findMontantByBail/{id}';
  static readonly findAllPaysPath = 'api/v1/pays/all';
  static readonly deletePaysPath = 'api/v1/pays/delete/{id}';
  static readonly findPaysByIDPath = 'api/v1/pays/findById/{id}';
  static readonly findPaysByNamePath = 'api/v1/pays/findByName/{name}';
  static readonly savePaysPath = 'api/v1/pays/save';
  static readonly findAllServiceAdditionnelPrestationPath = 'api/v1/prestation/all';
  static readonly deleteServiceAdditionnelPrestationPath = 'api/v1/prestation/delete/{id}';
  static readonly findServiceAdditionnelByIDPrestationPath = 'api/v1/prestation/findById/{id}';
  static readonly saveorupdatePrestationPath = 'api/v1/prestation/saveorupdate';
  static readonly sampleQuitancePath = 'api/v1/print/quittance/{id}';
  static readonly quittancePeriodePath = 'api/v1/print/quittancegrouper/{periode}/{idAgence}/{proprio}';
  static readonly recuReservationParIdReservationPath = 'api/v1/print/recuReservationParIdReservation/{idReservation}/{idAgence}/{proprio}';
  static readonly recuPaimentPath = 'api/v1/print/recupaiment/{idEncaissement}';
  static readonly recuReservationPath = 'api/v1/print/recureservation/{idEncaissement}/{idAgence}/{proprio}';
  static readonly listDesPrixParCategoriPath = 'api/v1/prixparcategorie/listDesPrixParCategori/{idCategorie}';
  static readonly saveOrUpDatePrixParCategoriePath = 'api/v1/prixparcategorie/saveOrUpDatePrixParCategorie';
  static readonly findAllQuartiersPath = 'api/v1/quartier/all/{idAgence}';
  static readonly deleteQuartierPath = 'api/v1/quartier/delete/{id}';
  static readonly findByIDQuartiersPath = 'api/v1/quartier/findById/{id}';
  static readonly findAllQuartierByIdCommunePath = 'api/v1/quartier/findByIdCommune/{id}';
  static readonly findByNameQuartierPath = 'api/v1/quartier/findByName/{name}';
  static readonly saveQuartierPath = 'api/v1/quartier/save';
  static readonly allreservationPath = 'api/v1/reservation/allreservation';
  static readonly allreservationparagencePath = 'api/v1/reservation/allreservationparagence/{idAgence}';
  static readonly deleteReservationPath = 'api/v1/reservation/delete/{id}';
  static readonly findAllEncaissementReservationByIdBienPath = 'api/v1/reservation/findAllEncaissementReservationByIdBien/{idReser}';
  static readonly findPeriodeReservationByIdBienPath = 'api/v1/reservation/findPeriodeReservationByIdBien/{idBien}';
  static readonly findCategorieChambreByIDReservationPath = 'api/v1/reservation/findReservationById/{id}';
  static readonly listeDesReservationOuvertParAgencePath = 'api/v1/reservation/listeDesReservationOuvertParAgence/{idAgence}';
  static readonly saveencaissementreservationPath = 'api/v1/reservation/saveencaissementreservation';
  static readonly saveorupdateResPath = 'api/v1/reservation/saveorupdate';
  static readonly saveorupdategoodPath = 'api/v1/reservation/saveorupdategood';
  static readonly saveorupdatereservationPath = 'api/v1/reservation/saveorupdatereservation';
  static readonly findAllServiceAdditionnelPrestationAdditionnelPath = 'api/v1/serviceadditionnel/all';
  static readonly deleteServiceAdditionnelPrestationAdditionnelPath = 'api/v1/serviceadditionnel/delete/{id}';
  static readonly findServiceAdditionnelByIDPrestationAdditionnelPath = 'api/v1/serviceadditionnel/findById/{id}';
  static readonly saveorupdatePrestationAdditionnelPath = 'api/v1/serviceadditionnel/saveorupdate';
  static readonly findAllSitesPath = 'api/v1/sites/all/{idAgence}';
  static readonly deleteSitePath = 'api/v1/sites/delete/{id}';
  static readonly findSiteByIDPath = 'api/v1/sites/findById/{id}';
  static readonly findSiteByNamePath = 'api/v1/sites/findByName/{name}';
  static readonly saveSitesPath = 'api/v1/sites/save';
  static readonly saveSitePath = 'api/v1/sites/savesite';
  static readonly getAllEncaissementSuivieDepenseParAgencePath = 'api/v1/suiviedepense/allSuivieDepense/{idAgence}';
  static readonly countSuiviNonCloturerParCaisseEtChapitreAvantDatePath = 'api/v1/suiviedepense/countSuiviNonCloturerParCaisseEtChapitreAvantDate/{datePriseEnCompteEncaii}/{idCaiss}/{idChapitre}';
  static readonly getSuivieDepenseByCodeTransactionPath = 'api/v1/suiviedepense/getSuivieDepenseByCodeTransaction/{codeTransaction}';
  static readonly getSuivieDepenseByIdPath = 'api/v1/suiviedepense/getSuivieDepenseById/{id}';
  static readonly listSortieDeuxDatePath = 'api/v1/suiviedepense/listSortieDeuxDate/{idAgence}/{debut}/{fin}';
  static readonly listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDatePath = 'api/v1/suiviedepense/listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate/{idcaisse}/{dateDepriseEnCompte}/{idChapitre}';
  static readonly listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDatePath = 'api/v1/suiviedepense/listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate/{idcaisse}/{dateDebut}/{dateFin}/{idChapitre}';
  static readonly saveSuivieDepensePath = 'api/v1/suiviedepense/saveSuivieDepense';
  static readonly suprimerSuiviParIdPath = 'api/v1/suiviedepense/suprimerSuiviParId/{id}/{idAgence}';
  static readonly totalSortieDeuxDatePath = 'api/v1/suiviedepense/totalSortieDeuxDate/{idAgence}/{debut}/{fin}';
  static readonly getAllUtilisateursByOrderPath = 'api/v1/utilisateur/all/{idAgence}';
  static readonly listOfAllUtilisateurClientHotelOrderbyNameByAgencePath = 'api/v1/utilisateur/clienthotel/all/{idAgence}';
  static readonly getAllGerantsByOrderPath = 'api/v1/utilisateur/gerants/all/{idAgence}';
  static readonly getUtilisateurByAgencePath = 'api/v1/utilisateur/getAllutilisateurbyAgence/{idAgence}';
  static readonly getUtilisateurByEmailPath = 'api/v1/utilisateur/getutilisateurbyemail/{email}';
  static readonly getUtilisateurByIDPath = 'api/v1/utilisateur/getutilisateurbyid/{id}';
  static readonly getUtilisateurByUsernamePath = 'api/v1/utilisateur/getutilisateurbyusername/{username}';
  static readonly getAllLocatairesByOrderPath = 'api/v1/utilisateur/locataires/all/{idAgence}';
  static readonly getAllLocatairesAvecBailPath = 'api/v1/utilisateur/locataires/ayanbail/{idAgence}';
  static readonly getAllProprietaireByOrderPath = 'api/v1/utilisateur/proprietaires/all/{idAgence}';
  static readonly saveUtilisateurPath = 'api/v1/utilisateur/save';
  static readonly getAllSuperviseursByOrderPath = 'api/v1/utilisateur/superviseurs/all';
  static readonly findAllVillaPath = 'api/v1/villa/all/{idAgence}';
  static readonly findAllVillaLibrePath = 'api/v1/villa/alllibre/{idAgence}';
  static readonly findVillaByIdPath = 'api/v1/villa/findVillaById/{id}';
  static readonly saveVillaPath = 'api/v1/villa/save';
  static readonly findAllVillesPath = 'api/v1/ville/all';
  static readonly deleteVillePath = 'api/v1/ville/delete/{id}';
  static readonly findByIdVillePath = 'api/v1/ville/findById/{id}';
  static readonly findAllVilleByIdPaysPath = 'api/v1/ville/findByIdPays/{id}';
  static readonly findVilleByNameVillePath = 'api/v1/ville/findByName/{name}';
  static readonly findAllVilleByPaysObjectPath = 'api/v1/ville/findByPays';
  static readonly saveVillePath = 'api/v1/ville/save';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllAgenceByOrderAgenceResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<AgenceImmobilierDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/agences/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AgenceImmobilierDTO>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllAgenceByOrderAgence(idAgence: number): __Observable<Array<AgenceImmobilierDTO>> {
    return this.getAllAgenceByOrderAgenceResponse(idAgence).pipe(
      __map(_r => _r.body as Array<AgenceImmobilierDTO>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteAgenceByIdAgenceResponse(id: number): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/agences/deleteagence/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteAgenceByIdAgence(id: number): __Observable<string> {
    return this.deleteAgenceByIdAgenceResponse(id).pipe(
      __map(_r => _r.body as string)
    );
  }

  /**
   * @param email undefined
   * @return successful operation
   */
  getAgenceByEmailAgenceResponse(email: string): __Observable<__StrictHttpResponse<AgenceImmobilierDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/agences/getagencebyemail/${email}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AgenceImmobilierDTO>;
      })
    );
  }
  /**
   * @param email undefined
   * @return successful operation
   */
  getAgenceByEmailAgence(email: string): __Observable<AgenceImmobilierDTO> {
    return this.getAgenceByEmailAgenceResponse(email).pipe(
      __map(_r => _r.body as AgenceImmobilierDTO)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  getAgenceByIDAgenceResponse(id: number): __Observable<__StrictHttpResponse<AgenceResponseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/agences/getagencebyid/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AgenceResponseDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  getAgenceByIDAgence(id: number): __Observable<AgenceResponseDto> {
    return this.getAgenceByIDAgenceResponse(id).pipe(
      __map(_r => _r.body as AgenceResponseDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  authenticateAgenceResponse(body?: AgenceRequestDto): __Observable<__StrictHttpResponse<AgenceImmobilierDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/agences/signup`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AgenceImmobilierDTO>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  authenticateAgence(body?: AgenceRequestDto): __Observable<AgenceImmobilierDTO> {
    return this.authenticateAgenceResponse(body).pipe(
      __map(_r => _r.body as AgenceImmobilierDTO)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllAppartementResponse(id: number): __Observable<__StrictHttpResponse<Array<AppartementDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/all/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppartementDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllAppartement(id: number): __Observable<Array<AppartementDto>> {
    return this.findAllAppartementResponse(id).pipe(
      __map(_r => _r.body as Array<AppartementDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllAppartementLibreResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<AppartementDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/alllmeublelibre/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppartementDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllAppartementLibre(idAgence: number): __Observable<Array<AppartementDto>> {
    return this.findAllAppartementLibreResponse(idAgence).pipe(
      __map(_r => _r.body as Array<AppartementDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllAppartementMeubleResponse(id: number): __Observable<__StrictHttpResponse<Array<AppartementDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/allmeuble/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppartementDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllAppartementMeuble(id: number): __Observable<Array<AppartementDto>> {
    return this.findAllAppartementMeubleResponse(id).pipe(
      __map(_r => _r.body as Array<AppartementDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteAppartementResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/appartement/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteAppartement(id: number): __Observable<boolean> {
    return this.deleteAppartementResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDAppartementResponse(id: number): __Observable<__StrictHttpResponse<AppartementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppartementDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDAppartement(id: number): __Observable<AppartementDto> {
    return this.findByIDAppartementResponse(id).pipe(
      __map(_r => _r.body as AppartementDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIdEtageAppartementResponse(id: number): __Observable<__StrictHttpResponse<Array<AppartementDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/findByIdEtage/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppartementDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIdEtageAppartement(id: number): __Observable<Array<AppartementDto>> {
    return this.findByIdEtageAppartementResponse(id).pipe(
      __map(_r => _r.body as Array<AppartementDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameAppartementResponse(name: string): __Observable<__StrictHttpResponse<AppartementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppartementDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameAppartement(name: string): __Observable<AppartementDto> {
    return this.findByNameAppartementResponse(name).pipe(
      __map(_r => _r.body as AppartementDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllAppartementByIdCategorieResponse(id: number): __Observable<__StrictHttpResponse<Array<AppartementDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appartement/findallappartementbyidcategorie/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppartementDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllAppartementByIdCategorie(id: number): __Observable<Array<AppartementDto>> {
    return this.findAllAppartementByIdCategorieResponse(id).pipe(
      __map(_r => _r.body as Array<AppartementDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveAppartementResponse(body?: AppartementDto): __Observable<__StrictHttpResponse<AppartementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/appartement/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppartementDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveAppartement(body?: AppartementDto): __Observable<AppartementDto> {
    return this.saveAppartementResponse(body).pipe(
      __map(_r => _r.body as AppartementDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveForCategorieResponse(body?: AppartementDto): __Observable<__StrictHttpResponse<AppartementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/appartement/saveForCategorie`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppartementDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveForCategorie(body?: AppartementDto): __Observable<AppartementDto> {
    return this.saveForCategorieResponse(body).pipe(
      __map(_r => _r.body as AppartementDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteAppelDtoResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/clotureOfAppelDtoByID/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteAppelDto(id: number): __Observable<boolean> {
    return this.deleteAppelDtoResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param params The `ApiService.AppelLoyersParPeriodeParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  AppelLoyersParPeriodeResponse(params: ApiService.AppelLoyersParPeriodeParams): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAllAppelloyerByPeriode/${params.periode}/${params.idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.AppelLoyersParPeriodeParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  AppelLoyersParPeriode(params: ApiService.AppelLoyersParPeriodeParams): __Observable<Array<AppelLoyersFactureDto>> {
    return this.AppelLoyersParPeriodeResponse(params).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listTousAppelsLoyersResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAllAppelsLoyer/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listTousAppelsLoyers(idAgence: number): __Observable<Array<AppelLoyersFactureDto>> {
    return this.listTousAppelsLoyersResponse(idAgence).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllPeriodeResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<PeriodeDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAllPeriodeAppel/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PeriodeDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllPeriode(idAgence: number): __Observable<Array<PeriodeDto>> {
    return this.findAllPeriodeResponse(idAgence).pipe(
      __map(_r => _r.body as Array<PeriodeDto>)
    );
  }

  /**
   * @param params The `ApiService.FindAllPeriodeByAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  findAllPeriodeByAnneeResponse(params: ApiService.FindAllPeriodeByAnneeParams): __Observable<__StrictHttpResponse<Array<PeriodeDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAllPeriodeByAnnee/${params.annee}/${params.idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PeriodeDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindAllPeriodeByAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  findAllPeriodeByAnnee(params: ApiService.FindAllPeriodeByAnneeParams): __Observable<Array<PeriodeDto>> {
    return this.findAllPeriodeByAnneeResponse(params).pipe(
      __map(_r => _r.body as Array<PeriodeDto>)
    );
  }

  /**
   * @param params The `ApiService.FindAllPeriodeChiffreEtLettreByAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  findAllPeriodeChiffreEtLettreByAnneeResponse(params: ApiService.FindAllPeriodeChiffreEtLettreByAnneeParams): __Observable<__StrictHttpResponse<Array<AnneeAppelLoyersDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAllPeriodeChiffreEtLettreByAnnee/${params.annee}/${params.idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AnneeAppelLoyersDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindAllPeriodeChiffreEtLettreByAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  findAllPeriodeChiffreEtLettreByAnnee(params: ApiService.FindAllPeriodeChiffreEtLettreByAnneeParams): __Observable<Array<AnneeAppelLoyersDto>> {
    return this.findAllPeriodeChiffreEtLettreByAnneeResponse(params).pipe(
      __map(_r => _r.body as Array<AnneeAppelLoyersDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  AppelLoyersParIdResponse(id: number): __Observable<__StrictHttpResponse<AppelLoyersFactureDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAppelloyer/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppelLoyersFactureDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  AppelLoyersParId(id: number): __Observable<AppelLoyersFactureDto> {
    return this.AppelLoyersParIdResponse(id).pipe(
      __map(_r => _r.body as AppelLoyersFactureDto)
    );
  }

  /**
   * @param idBail undefined
   * @return successful operation
   */
  listDesLoyersParBailResponse(idBail: number): __Observable<__StrictHttpResponse<Array<AppelLoyerDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAppelsByIdBail/${idBail}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyerDto>>;
      })
    );
  }
  /**
   * @param idBail undefined
   * @return successful operation
   */
  listDesLoyersParBail(idBail: number): __Observable<Array<AppelLoyerDto>> {
    return this.listDesLoyersParBailResponse(idBail).pipe(
      __map(_r => _r.body as Array<AppelLoyerDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  listDesLoyersImpayerParBailResponse(id: number): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findAppelsImpayerByIdBail/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  listDesLoyersImpayerParBail(id: number): __Observable<Array<AppelLoyersFactureDto>> {
    return this.listDesLoyersImpayerParBailResponse(id).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param params The `ApiService.FindByIdAndBailParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idBien`:
   *
   * @return successful operation
   */
  findByIdAndBailResponse(params: ApiService.FindByIdAndBailParams): __Observable<__StrictHttpResponse<AppelLoyersFactureDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/findByIdAndBail/${params.idBien}/${params.periode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppelLoyersFactureDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindByIdAndBailParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idBien`:
   *
   * @return successful operation
   */
  findByIdAndBail(params: ApiService.FindByIdAndBailParams): __Observable<AppelLoyersFactureDto> {
    return this.findByIdAndBailResponse(params).pipe(
      __map(_r => _r.body as AppelLoyersFactureDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  getFirstLoyerImpayerByBienResponse(id: number): __Observable<__StrictHttpResponse<AppelLoyersFactureDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/getFirstLoyerImpayerByBien/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AppelLoyersFactureDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  getFirstLoyerImpayerByBien(id: number): __Observable<AppelLoyersFactureDto> {
    return this.getFirstLoyerImpayerByBienResponse(id).pipe(
      __map(_r => _r.body as AppelLoyersFactureDto)
    );
  }

  /**
   * @param params The `ApiService.ImpayeLoyerParAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  impayeLoyerParAnneeResponse(params: ApiService.ImpayeLoyerParAnneeParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/impayeParAnnee/${params.annee}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.ImpayeLoyerParAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  impayeLoyerParAnnee(params: ApiService.ImpayeLoyerParAnneeParams): __Observable<number> {
    return this.impayeLoyerParAnneeResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.ImpayeLoyerParMoisAppelLoyerParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  impayeLoyerParMoisAppelLoyerResponse(params: ApiService.ImpayeLoyerParMoisAppelLoyerParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/impayeParMois/${params.periode}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.ImpayeLoyerParMoisAppelLoyerParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  impayeLoyerParMoisAppelLoyer(params: ApiService.ImpayeLoyerParMoisAppelLoyerParams): __Observable<number> {
    return this.impayeLoyerParMoisAppelLoyerResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param login undefined
   * @return successful operation
   */
  listMessageEnvoyerAUnLocataireResponse(login: string): __Observable<__StrictHttpResponse<Array<MessageEnvoyerDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/listMessageEnvoyerAUnLocataire/${login}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MessageEnvoyerDto>>;
      })
    );
  }
  /**
   * @param login undefined
   * @return successful operation
   */
  listMessageEnvoyerAUnLocataire(login: string): __Observable<Array<MessageEnvoyerDto>> {
    return this.listMessageEnvoyerAUnLocataireResponse(login).pipe(
      __map(_r => _r.body as Array<MessageEnvoyerDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listOfDistinctAnneeAppelResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<number>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/listOfDistinctAnneeAppel/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<number>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listOfDistinctAnneeAppel(idAgence: number): __Observable<Array<number>> {
    return this.listOfDistinctAnneeAppelResponse(idAgence).pipe(
      __map(_r => _r.body as Array<number>)
    );
  }

  /**
   * @param params The `ApiService.ListeDesloyerSuperieurAUnePeriodeParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idBien`:
   *
   * @return successful operation
   */
  listeDesloyerSuperieurAUnePeriodeResponse(params: ApiService.ListeDesloyerSuperieurAUnePeriodeParams): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/listeDesloyerSuperieurAUnePeriode/${params.idBien}/${params.periode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListeDesloyerSuperieurAUnePeriodeParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idBien`:
   *
   * @return successful operation
   */
  listeDesloyerSuperieurAUnePeriode(params: ApiService.ListeDesloyerSuperieurAUnePeriodeParams): __Observable<Array<AppelLoyersFactureDto>> {
    return this.listeDesloyerSuperieurAUnePeriodeResponse(params).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  miseAjourDesUnlockDesBauxResponse(idAgence: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/miseAjourDesUnlockDesBaux/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  miseAjourDesUnlockDesBaux(idAgence: number): __Observable<boolean> {
    return this.miseAjourDesUnlockDesBauxResponse(idAgence).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param params The `ApiService.NombreImpayerLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  nombreImpayerLoyerParMoisResponse(params: ApiService.NombreImpayerLoyerParMoisParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/nombreImpayerLoyerParMois/${params.periode}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.NombreImpayerLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  nombreImpayerLoyerParMois(params: ApiService.NombreImpayerLoyerParMoisParams): __Observable<number> {
    return this.nombreImpayerLoyerParMoisResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.NombrePayerLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  nombrePayerLoyerParMoisResponse(params: ApiService.NombrePayerLoyerParMoisParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/nombrePayerLoyerParMois/${params.periode}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.NombrePayerLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  nombrePayerLoyerParMois(params: ApiService.NombrePayerLoyerParMoisParams): __Observable<number> {
    return this.nombrePayerLoyerParMoisResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.PayeLoyerParAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  payeLoyerParAnneeResponse(params: ApiService.PayeLoyerParAnneeParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/payeParAnnee/${params.annee}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.PayeLoyerParAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  payeLoyerParAnnee(params: ApiService.PayeLoyerParAnneeParams): __Observable<number> {
    return this.payeLoyerParAnneeResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.PayeLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  payeLoyerParMoisResponse(params: ApiService.PayeLoyerParMoisParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/payeParMois/${params.periode}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.PayeLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  payeLoyerParMois(params: ApiService.PayeLoyerParMoisParams): __Observable<number> {
    return this.payeLoyerParMoisResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  ReductionLoyerByPeriodeResponse(body?: PourcentageAppelDto): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/appelloyer/reductionLoyerByPeriode`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  ReductionLoyerByPeriode(body?: PourcentageAppelDto): __Observable<Array<AppelLoyersFactureDto>> {
    return this.ReductionLoyerByPeriodeResponse(body).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveAppelLoyersResponse(body?: AppelLoyerRequestDto): __Observable<__StrictHttpResponse<Array<string>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/appelloyer/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<string>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveAppelLoyers(body?: AppelLoyerRequestDto): __Observable<Array<string>> {
    return this.saveAppelLoyersResponse(body).pipe(
      __map(_r => _r.body as Array<string>)
    );
  }

  /**
   * @param params The `ApiService.StaisiqueLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  staisiqueLoyerParMoisResponse(params: ApiService.StaisiqueLoyerParMoisParams): __Observable<__StrictHttpResponse<StatistiquePeriodeDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/staisiqueLoyerParMois/${params.periode}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<StatistiquePeriodeDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.StaisiqueLoyerParMoisParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  staisiqueLoyerParMois(params: ApiService.StaisiqueLoyerParMoisParams): __Observable<StatistiquePeriodeDto> {
    return this.staisiqueLoyerParMoisResponse(params).pipe(
      __map(_r => _r.body as StatistiquePeriodeDto)
    );
  }

  /**
   * @param params The `ApiService.StatistiqueLoyerParAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  statistiqueLoyerParAnneeResponse(params: ApiService.StatistiqueLoyerParAnneeParams): __Observable<__StrictHttpResponse<StatistiquePeriodeDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/statistiqueLoyerParAnnee/${params.annee}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<StatistiquePeriodeDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.StatistiqueLoyerParAnneeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * - `annee`:
   *
   * @return successful operation
   */
  statistiqueLoyerParAnnee(params: ApiService.StatistiqueLoyerParAnneeParams): __Observable<StatistiquePeriodeDto> {
    return this.statistiqueLoyerParAnneeResponse(params).pipe(
      __map(_r => _r.body as StatistiquePeriodeDto)
    );
  }

  /**
   * @param params The `ApiService.SupprimerPaiementAppelParams` containing the following parameters:
   *
   * - `idPeriode`:
   *
   * - `idBail`:
   *
   * @return successful operation
   */
  supprimerPaiementAppelResponse(params: ApiService.SupprimerPaiementAppelParams): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/appelloyer/supprimerPaiementAppel/${params.idPeriode}/${params.idBail}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.SupprimerPaiementAppelParams` containing the following parameters:
   *
   * - `idPeriode`:
   *
   * - `idBail`:
   *
   * @return successful operation
   */
  supprimerPaiementAppel(params: ApiService.SupprimerPaiementAppelParams): __Observable<Array<AppelLoyersFactureDto>> {
    return this.supprimerPaiementAppelResponse(params).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param token undefined
   * @return successful operation
   */
  verifyAccountResponse(token: string): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/auth/accountVerification/${token}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @param token undefined
   * @return successful operation
   */
  verifyAccount(token: string): __Observable<string> {
    return this.verifyAccountResponse(token).pipe(
      __map(_r => _r.body as string)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  loginResponse(body?: AuthRequestDto): __Observable<__StrictHttpResponse<Utilisateur>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/auth/login`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Utilisateur>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  login(body?: AuthRequestDto): __Observable<Utilisateur> {
    return this.loginResponse(body).pipe(
      __map(_r => _r.body as Utilisateur)
    );
  }

  /**
   * @param params The `ApiService.BailByLocataireEtBienParams` containing the following parameters:
   *
   * - `locataire`:
   *
   * - `bien`:
   *
   * @return successful operation
   */
  bailByLocataireEtBienResponse(params: ApiService.BailByLocataireEtBienParams): __Observable<__StrictHttpResponse<LocataireEncaisDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bail/bailLocataireetbien/${params.locataire}/${params.bien}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<LocataireEncaisDTO>;
      })
    );
  }
  /**
   * @param params The `ApiService.BailByLocataireEtBienParams` containing the following parameters:
   *
   * - `locataire`:
   *
   * - `bien`:
   *
   * @return successful operation
   */
  bailByLocataireEtBien(params: ApiService.BailByLocataireEtBienParams): __Observable<LocataireEncaisDTO> {
    return this.bailByLocataireEtBienResponse(params).pipe(
      __map(_r => _r.body as LocataireEncaisDTO)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  clotureBailResponse(id: number, compteSolde?: boolean, body?: any): __Observable<__StrictHttpResponse<Array<OperationDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    if (compteSolde !== null && compteSolde !== undefined) {
      __params = __params.set('compteSolde', compteSolde.toString());
    }

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/bail/clotureBail/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<OperationDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  clotureBail(id: number, compteSolde?: boolean, body?: any): __Observable<Array<OperationDto>> {
    return this.clotureBailResponse(id, compteSolde, body).pipe(
      __map(_r => _r.body as Array<OperationDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findOperationByIdResponse(id: number): __Observable<__StrictHttpResponse<OperationDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bail/findoperationbyid/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OperationDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findOperationById(id: number): __Observable<OperationDto> {
    return this.findOperationByIdResponse(id).pipe(
      __map(_r => _r.body as OperationDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  listDesBauxPourUnBienImmobilierResponse(id: number): __Observable<__StrictHttpResponse<Array<AppelLoyersFactureDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bail/getallbailbybien/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyersFactureDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  listDesBauxPourUnBienImmobilier(id: number): __Observable<Array<AppelLoyersFactureDto>> {
    return this.listDesBauxPourUnBienImmobilierResponse(id).pipe(
      __map(_r => _r.body as Array<AppelLoyersFactureDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  listDesBauxPourUnLocataireResponse(id: number): __Observable<__StrictHttpResponse<Array<OperationDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bail/getallbailbylocataire/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<OperationDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  listDesBauxPourUnLocataire(id: number): __Observable<Array<OperationDto>> {
    return this.listDesBauxPourUnLocataireResponse(id).pipe(
      __map(_r => _r.body as Array<OperationDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  nombrebailactifResponse(idAgence: number): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bail/nombrebailactif/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  nombrebailactif(idAgence: number): __Observable<number> {
    return this.nombrebailactifResponse(idAgence).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  nombrebailnonactifResponse(idAgence: number): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bail/nombrebailnonactif/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  nombrebailnonactif(idAgence: number): __Observable<number> {
    return this.nombrebailnonactifResponse(idAgence).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  modifierUnBailResponse(body?: BailModifDto): __Observable<__StrictHttpResponse<OperationDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/bail/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OperationDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  modifierUnBail(body?: BailModifDto): __Observable<OperationDto> {
    return this.modifierUnBailResponse(body).pipe(
      __map(_r => _r.body as OperationDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  supprimerBailResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/bail/supprimerBail/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  supprimerBail(id: number): __Observable<boolean> {
    return this.supprimerBailResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllBailAppartementResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<BailAppartementDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailappartement/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<BailAppartementDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllBailAppartement(idAgence: number): __Observable<Array<BailAppartementDto>> {
    return this.findAllBailAppartementResponse(idAgence).pipe(
      __map(_r => _r.body as Array<BailAppartementDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllOperationsResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<OperationDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailappartement/alloperation/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<OperationDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllOperations(idAgence: number): __Observable<Array<OperationDto>> {
    return this.findAllOperationsResponse(idAgence).pipe(
      __map(_r => _r.body as Array<OperationDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteBailAppartementResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/bailappartement/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteBailAppartement(id: number): __Observable<boolean> {
    return this.deleteBailAppartementResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDBailAppartementResponse(id: number): __Observable<__StrictHttpResponse<BailAppartementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailappartement/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BailAppartementDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDBailAppartement(id: number): __Observable<BailAppartementDto> {
    return this.findByIDBailAppartementResponse(id).pipe(
      __map(_r => _r.body as BailAppartementDto)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameBailAppartementResponse(name: string): __Observable<__StrictHttpResponse<BailAppartementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailappartement/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BailAppartementDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameBailAppartement(name: string): __Observable<BailAppartementDto> {
    return this.findByNameBailAppartementResponse(name).pipe(
      __map(_r => _r.body as BailAppartementDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveBailAppartementResponse(body?: BailAppartementDto): __Observable<__StrictHttpResponse<OperationDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/bailappartement/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OperationDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveBailAppartement(body?: BailAppartementDto): __Observable<OperationDto> {
    return this.saveBailAppartementResponse(body).pipe(
      __map(_r => _r.body as OperationDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllBailMagasinResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<BailMagasinDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailmagasin/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<BailMagasinDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllBailMagasin(idAgence: number): __Observable<Array<BailMagasinDto>> {
    return this.findAllBailMagasinResponse(idAgence).pipe(
      __map(_r => _r.body as Array<BailMagasinDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteBailMagasinResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/bailmagasin/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteBailMagasin(id: number): __Observable<boolean> {
    return this.deleteBailMagasinResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDBailMagasinResponse(id: number): __Observable<__StrictHttpResponse<BailMagasinDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailmagasin/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BailMagasinDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDBailMagasin(id: number): __Observable<BailMagasinDto> {
    return this.findByIDBailMagasinResponse(id).pipe(
      __map(_r => _r.body as BailMagasinDto)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameBailMagasinResponse(name: string): __Observable<__StrictHttpResponse<BailMagasinDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailmagasin/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BailMagasinDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameBailMagasin(name: string): __Observable<BailMagasinDto> {
    return this.findByNameBailMagasinResponse(name).pipe(
      __map(_r => _r.body as BailMagasinDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveBailMagasinResponse(body?: BailMagasinDto): __Observable<__StrictHttpResponse<OperationDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/bailmagasin/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OperationDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveBailMagasin(body?: BailMagasinDto): __Observable<OperationDto> {
    return this.saveBailMagasinResponse(body).pipe(
      __map(_r => _r.body as OperationDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllBailVillaResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<BailVillaDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailvilla/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<BailVillaDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllBailVilla(idAgence: number): __Observable<Array<BailVillaDto>> {
    return this.findAllBailVillaResponse(idAgence).pipe(
      __map(_r => _r.body as Array<BailVillaDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteBailVillaResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/bailvilla/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteBailVilla(id: number): __Observable<boolean> {
    return this.deleteBailVillaResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findBailVillaByIDResponse(id: number): __Observable<__StrictHttpResponse<BailVillaDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailvilla/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BailVillaDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findBailVillaByID(id: number): __Observable<BailVillaDto> {
    return this.findBailVillaByIDResponse(id).pipe(
      __map(_r => _r.body as BailVillaDto)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findBailVillaByNameResponse(name: string): __Observable<__StrictHttpResponse<BailVillaDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bailvilla/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BailVillaDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findBailVillaByName(name: string): __Observable<BailVillaDto> {
    return this.findBailVillaByNameResponse(name).pipe(
      __map(_r => _r.body as BailVillaDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveBailVillaResponse(body?: BailVillaDto): __Observable<__StrictHttpResponse<OperationDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/bailvilla/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OperationDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveBailVilla(body?: BailVillaDto): __Observable<OperationDto> {
    return this.saveBailVillaResponse(body).pipe(
      __map(_r => _r.body as OperationDto)
    );
  }

  /**
   * @param params The `ApiService.FindAllBienParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllBienResponse(params: ApiService.FindAllBienParams): __Observable<__StrictHttpResponse<Array<BienImmobilierAffiheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bienImmobilier/all/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<BienImmobilierAffiheDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindAllBienParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllBien(params: ApiService.FindAllBienParams): __Observable<Array<BienImmobilierAffiheDto>> {
    return this.findAllBienResponse(params).pipe(
      __map(_r => _r.body as Array<BienImmobilierAffiheDto>)
    );
  }

  /**
   * @param params The `ApiService.FindAllBienOqpParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllBienOqpResponse(params: ApiService.FindAllBienOqpParams): __Observable<__StrictHttpResponse<Array<BienImmobilierAffiheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bienImmobilier/allBienOccuper/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<BienImmobilierAffiheDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindAllBienOqpParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllBienOqp(params: ApiService.FindAllBienOqpParams): __Observable<Array<BienImmobilierAffiheDto>> {
    return this.findAllBienOqpResponse(params).pipe(
      __map(_r => _r.body as Array<BienImmobilierAffiheDto>)
    );
  }

  /**
   * @param params The `ApiService.RattacherUnBienAUnChapitreParams` containing the following parameters:
   *
   * - `idBien`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  rattacherUnBienAUnChapitreResponse(params: ApiService.RattacherUnBienAUnChapitreParams): __Observable<__StrictHttpResponse<BienImmobilierAffiheDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/bienImmobilier/rattacherUnBienAUnChapitre/${params.idBien}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BienImmobilierAffiheDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.RattacherUnBienAUnChapitreParams` containing the following parameters:
   *
   * - `idBien`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  rattacherUnBienAUnChapitre(params: ApiService.RattacherUnBienAUnChapitreParams): __Observable<BienImmobilierAffiheDto> {
    return this.rattacherUnBienAUnChapitreResponse(params).pipe(
      __map(_r => _r.body as BienImmobilierAffiheDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllCategorieChambreResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<CategoryChambreSaveOrUpdateDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/categoriechambre/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CategoryChambreSaveOrUpdateDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllCategorieChambre(idAgence: number): __Observable<Array<CategoryChambreSaveOrUpdateDto>> {
    return this.findAllCategorieChambreResponse(idAgence).pipe(
      __map(_r => _r.body as Array<CategoryChambreSaveOrUpdateDto>)
    );
  }

  /**
   * @param id undefined
   */
  deleteCategoryChambreResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/categoriechambre/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id undefined
   */
  deleteCategoryChambre(id: number): __Observable<null> {
    return this.deleteCategoryChambreResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findCategorieChambreByIDResponse(id: number): __Observable<__StrictHttpResponse<CategoryChambreSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/categoriechambre/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryChambreSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findCategorieChambreByID(id: number): __Observable<CategoryChambreSaveOrUpdateDto> {
    return this.findCategorieChambreByIDResponse(id).pipe(
      __map(_r => _r.body as CategoryChambreSaveOrUpdateDto)
    );
  }

  /**
   * @param idAppart undefined
   * @return successful operation
   */
  findCategorieByIdAppartementResponse(idAppart: number): __Observable<__StrictHttpResponse<CategoryChambreSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/categoriechambre/findCategorieByIdAppartement/${idAppart}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryChambreSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param idAppart undefined
   * @return successful operation
   */
  findCategorieByIdAppartement(idAppart: number): __Observable<CategoryChambreSaveOrUpdateDto> {
    return this.findCategorieByIdAppartementResponse(idAppart).pipe(
      __map(_r => _r.body as CategoryChambreSaveOrUpdateDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveOrUpdateCategoryChambreResponse(body?: CategoryChambreSaveOrUpdateDto): __Observable<__StrictHttpResponse<CategoryChambreSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/categoriechambre/saveOrUpdateCategoryChambre`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryChambreSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveOrUpdateCategoryChambre(body?: CategoryChambreSaveOrUpdateDto): __Observable<CategoryChambreSaveOrUpdateDto> {
    return this.saveOrUpdateCategoryChambreResponse(body).pipe(
      __map(_r => _r.body as CategoryChambreSaveOrUpdateDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdateCategoryChambreResponse(body?: CategoryChambreSaveOrUpdateDto): __Observable<__StrictHttpResponse<CategoryChambreSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/categoriechambre/saveorupdate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryChambreSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdateCategoryChambre(body?: CategoryChambreSaveOrUpdateDto): __Observable<CategoryChambreSaveOrUpdateDto> {
    return this.saveorupdateCategoryChambreResponse(body).pipe(
      __map(_r => _r.body as CategoryChambreSaveOrUpdateDto)
    );
  }

  /**
   * @param params The `ApiService.CountInitClotureByCaissiaireAndChampitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  countInitClotureByCaissiaireAndChampitreResponse(params: ApiService.CountInitClotureByCaissiaireAndChampitreParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/cloturecaisse/countInitClotureByCaissiaireAndChampitre/${params.idCaisse}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.CountInitClotureByCaissiaireAndChampitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  countInitClotureByCaissiaireAndChampitre(params: ApiService.CountInitClotureByCaissiaireAndChampitreParams): __Observable<number> {
    return this.countInitClotureByCaissiaireAndChampitreResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.FindAllByCaissierAndChapitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllByCaissierAndChapitreResponse(params: ApiService.FindAllByCaissierAndChapitreParams): __Observable<__StrictHttpResponse<Array<ClotureCaisseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/cloturecaisse/countInitClotureByCaissiaireAndChampitre/${params.idCaisse}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ClotureCaisseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindAllByCaissierAndChapitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllByCaissierAndChapitre(params: ApiService.FindAllByCaissierAndChapitreParams): __Observable<Array<ClotureCaisseDto>> {
    return this.findAllByCaissierAndChapitreResponse(params).pipe(
      __map(_r => _r.body as Array<ClotureCaisseDto>)
    );
  }

  /**
   * @return successful operation
   */
  findAllCloturerCaisseAgenceResponse(): __Observable<__StrictHttpResponse<Array<ClotureCaisseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/cloturecaisse/findAllCloturerCaisseAgence`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ClotureCaisseDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllCloturerCaisseAgence(): __Observable<Array<ClotureCaisseDto>> {
    return this.findAllCloturerCaisseAgenceResponse().pipe(
      __map(_r => _r.body as Array<ClotureCaisseDto>)
    );
  }

  /**
   * @param params The `ApiService.FindAllCloturerCaisseByDateAndChapitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `dateDuJoure`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllCloturerCaisseByDateAndChapitreResponse(params: ApiService.FindAllCloturerCaisseByDateAndChapitreParams): __Observable<__StrictHttpResponse<Array<ClotureCaisseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/cloturecaisse/findAllCloturerCaisseByDateAndChapitre/${params.idCaisse}/${params.chapitre}/${params.dateDuJoure}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ClotureCaisseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindAllCloturerCaisseByDateAndChapitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `dateDuJoure`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findAllCloturerCaisseByDateAndChapitre(params: ApiService.FindAllCloturerCaisseByDateAndChapitreParams): __Observable<Array<ClotureCaisseDto>> {
    return this.findAllCloturerCaisseByDateAndChapitreResponse(params).pipe(
      __map(_r => _r.body as Array<ClotureCaisseDto>)
    );
  }

  /**
   * @param params The `ApiService.FindNonCloturerByDateAndCaisseAndChapitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `dateDuJoure`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findNonCloturerByDateAndCaisseAndChapitreResponse(params: ApiService.FindNonCloturerByDateAndCaisseAndChapitreParams): __Observable<__StrictHttpResponse<Array<ClotureCaisseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/cloturecaisse/findNonCloturerByDateAndCaisseAndChapitre/${params.idCaisse}/${params.chapitre}/${params.dateDuJoure}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ClotureCaisseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.FindNonCloturerByDateAndCaisseAndChapitreParams` containing the following parameters:
   *
   * - `idCaisse`:
   *
   * - `dateDuJoure`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  findNonCloturerByDateAndCaisseAndChapitre(params: ApiService.FindNonCloturerByDateAndCaisseAndChapitreParams): __Observable<Array<ClotureCaisseDto>> {
    return this.findNonCloturerByDateAndCaisseAndChapitreResponse(params).pipe(
      __map(_r => _r.body as Array<ClotureCaisseDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveClotureCaisseResponse(body?: ClotureCaisseDto): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/cloturecaisse/savecloturecaisse`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveClotureCaisse(body?: ClotureCaisseDto): __Observable<boolean> {
    return this.saveClotureCaisseResponse(body).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @return successful operation
   */
  findAllCommuneResponse(): __Observable<__StrictHttpResponse<Array<CommuneRequestDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/commune/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommuneRequestDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllCommune(): __Observable<Array<CommuneRequestDto>> {
    return this.findAllCommuneResponse().pipe(
      __map(_r => _r.body as Array<CommuneRequestDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteCommuneResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/commune/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteCommune(id: number): __Observable<boolean> {
    return this.deleteCommuneResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findCommuneByIDResponse(id: number): __Observable<__StrictHttpResponse<CommuneRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/commune/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommuneRequestDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findCommuneByID(id: number): __Observable<CommuneRequestDto> {
    return this.findCommuneByIDResponse(id).pipe(
      __map(_r => _r.body as CommuneRequestDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findCommuneByIdPaysResponse(id: number): __Observable<__StrictHttpResponse<Array<CommuneResponseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/commune/findByIdVille/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommuneResponseDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findCommuneByIdPays(id: number): __Observable<Array<CommuneResponseDto>> {
    return this.findCommuneByIdPaysResponse(id).pipe(
      __map(_r => _r.body as Array<CommuneResponseDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findCommuneByNameResponse(name: string): __Observable<__StrictHttpResponse<CommuneRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/commune/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommuneRequestDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findCommuneByName(name: string): __Observable<CommuneRequestDto> {
    return this.findCommuneByNameResponse(name).pipe(
      __map(_r => _r.body as CommuneRequestDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveCommuneResponse(body?: CommuneRequestDto): __Observable<__StrictHttpResponse<CommuneRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/commune/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommuneRequestDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveCommune(body?: CommuneRequestDto): __Observable<CommuneRequestDto> {
    return this.saveCommuneResponse(body).pipe(
      __map(_r => _r.body as CommuneRequestDto)
    );
  }

  /**
   * @return successful operation
   */
  findAllDroitAccessResponse(): __Observable<__StrictHttpResponse<Array<DroitAccesDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/droitAccess/`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<DroitAccesDTO>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllDroitAccess(): __Observable<Array<DroitAccesDTO>> {
    return this.findAllDroitAccessResponse().pipe(
      __map(_r => _r.body as Array<DroitAccesDTO>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveDroitAccessResponse(body?: DroitAccesPayloadDTO): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/droitAccess/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveDroitAccess(body?: DroitAccesPayloadDTO): __Observable<number> {
    return this.saveDroitAccessResponse(body).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param droitAccessid undefined
   * @return successful operation
   */
  findByIdDroitAccessResponse(droitAccessid: number): __Observable<__StrictHttpResponse<DroitAccesDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/droitAccess/${droitAccessid}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DroitAccesDTO>;
      })
    );
  }
  /**
   * @param droitAccessid undefined
   * @return successful operation
   */
  findByIdDroitAccess(droitAccessid: number): __Observable<DroitAccesDTO> {
    return this.findByIdDroitAccessResponse(droitAccessid).pipe(
      __map(_r => _r.body as DroitAccesDTO)
    );
  }

  /**
   * @param droitAccessid undefined
   */
  deleteDroitAccessResponse(droitAccessid: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/droitAccess/${droitAccessid}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param droitAccessid undefined
   */
  deleteDroitAccess(droitAccessid: number): __Observable<null> {
    return this.deleteDroitAccessResponse(droitAccessid).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param idLocatire undefined
   * @return successful operation
   */
  findAllEncaissementByIdLocatireResponse(idLocatire: number): __Observable<__StrictHttpResponse<Array<EncaissementPrincipalDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/allEncaissementByIdLocatire/${idLocatire}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementPrincipalDTO>>;
      })
    );
  }
  /**
   * @param idLocatire undefined
   * @return successful operation
   */
  findAllEncaissementByIdLocatire(idLocatire: number): __Observable<Array<EncaissementPrincipalDTO>> {
    return this.findAllEncaissementByIdLocatireResponse(idLocatire).pipe(
      __map(_r => _r.body as Array<EncaissementPrincipalDTO>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllEncaissementByIdBienImmobilierResponse(id: number): __Observable<__StrictHttpResponse<Array<EncaissementPrincipalDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/allencaissementByIdBien/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementPrincipalDTO>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllEncaissementByIdBienImmobilier(id: number): __Observable<Array<EncaissementPrincipalDTO>> {
    return this.findAllEncaissementByIdBienImmobilierResponse(id).pipe(
      __map(_r => _r.body as Array<EncaissementPrincipalDTO>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listTousEncaissementsPrincipalResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<EncaissementPrincipalDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/findAllEncaissementPrincipal/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementPrincipalDTO>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listTousEncaissementsPrincipal(idAgence: number): __Observable<Array<EncaissementPrincipalDTO>> {
    return this.listTousEncaissementsPrincipalResponse(idAgence).pipe(
      __map(_r => _r.body as Array<EncaissementPrincipalDTO>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIdEncaissementResponse(id: number): __Observable<__StrictHttpResponse<EncaissementPrincipalDTO>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/findByIdEncaissement/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EncaissementPrincipalDTO>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIdEncaissement(id: number): __Observable<EncaissementPrincipalDTO> {
    return this.findByIdEncaissementResponse(id).pipe(
      __map(_r => _r.body as EncaissementPrincipalDTO)
    );
  }

  /**
   * @param params The `ApiService.GetTotalEncaissementparPeriodeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  getTotalEncaissementparPeriodeResponse(params: ApiService.GetTotalEncaissementparPeriodeParams): __Observable<__StrictHttpResponse<Array<EncaissementPrincipalDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/getTotalEncaissementparPeriode/${params.idAgence}/${params.datedebut}/${params.datefin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementPrincipalDTO>>;
      })
    );
  }
  /**
   * @param params The `ApiService.GetTotalEncaissementparPeriodeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  getTotalEncaissementparPeriode(params: ApiService.GetTotalEncaissementparPeriodeParams): __Observable<Array<EncaissementPrincipalDTO>> {
    return this.getTotalEncaissementparPeriodeResponse(params).pipe(
      __map(_r => _r.body as Array<EncaissementPrincipalDTO>)
    );
  }

  /**
   * @param params The `ApiService.GetTotalEncaissementsEtMontantsDeLoyerParMoisParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  getTotalEncaissementsEtMontantsDeLoyerParMoisResponse(params: ApiService.GetTotalEncaissementsEtMontantsDeLoyerParMoisParams): __Observable<__StrictHttpResponse<{[key: string]: Array<number>}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/getTotalEncaissementsEtMontantsDeLoyerParMois/${params.idAgence}/${params.datedebut}/${params.datefin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{[key: string]: Array<number>}>;
      })
    );
  }
  /**
   * @param params The `ApiService.GetTotalEncaissementsEtMontantsDeLoyerParMoisParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  getTotalEncaissementsEtMontantsDeLoyerParMois(params: ApiService.GetTotalEncaissementsEtMontantsDeLoyerParMoisParams): __Observable<{[key: string]: Array<number>}> {
    return this.getTotalEncaissementsEtMontantsDeLoyerParMoisResponse(params).pipe(
      __map(_r => _r.body as {[key: string]: Array<number>})
    );
  }

  /**
   * @param params The `ApiService.GetTotalEncaissementsParMoisParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  getTotalEncaissementsParMoisResponse(params: ApiService.GetTotalEncaissementsParMoisParams): __Observable<__StrictHttpResponse<{[key: string]: number}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/getTotalEncaissementsParMois/${params.idAgence}/${params.datedebut}/${params.datefin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{[key: string]: number}>;
      })
    );
  }
  /**
   * @param params The `ApiService.GetTotalEncaissementsParMoisParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  getTotalEncaissementsParMois(params: ApiService.GetTotalEncaissementsParMoisParams): __Observable<{[key: string]: number}> {
    return this.getTotalEncaissementsParMoisResponse(params).pipe(
      __map(_r => _r.body as {[key: string]: number})
    );
  }

  /**
   * @param params The `ApiService.ListeEncaisseLoyerEntreDeuxDateParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  listeEncaisseLoyerEntreDeuxDateResponse(params: ApiService.ListeEncaisseLoyerEntreDeuxDateParams): __Observable<__StrictHttpResponse<Array<AppelLoyerEncaissDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/listeEncaisseLoyerEntreDeuxDate/${params.idAgence}/${params.datedebut}/${params.datefin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<AppelLoyerEncaissDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListeEncaisseLoyerEntreDeuxDateParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  listeEncaisseLoyerEntreDeuxDate(params: ApiService.ListeEncaisseLoyerEntreDeuxDateParams): __Observable<Array<AppelLoyerEncaissDto>> {
    return this.listeEncaisseLoyerEntreDeuxDateResponse(params).pipe(
      __map(_r => _r.body as Array<AppelLoyerEncaissDto>)
    );
  }

  /**
   * @param params The `ApiService.ListeEncaissementEntreDeuxDateParChapitreEtCaisseParams` containing the following parameters:
   *
   * - `idEncaiss`:
   *
   * - `idChapitre`:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  listeEncaissementEntreDeuxDateParChapitreEtCaisseResponse(params: ApiService.ListeEncaissementEntreDeuxDateParChapitreEtCaisseParams): __Observable<__StrictHttpResponse<Array<EncaissementPrincipalDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/listeEncaissementEntreDeuxDateParChapitreEtCaisse/${params.idEncaiss}/${params.idChapitre}/${params.debut}/${params.fin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementPrincipalDTO>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListeEncaissementEntreDeuxDateParChapitreEtCaisseParams` containing the following parameters:
   *
   * - `idEncaiss`:
   *
   * - `idChapitre`:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  listeEncaissementEntreDeuxDateParChapitreEtCaisse(params: ApiService.ListeEncaissementEntreDeuxDateParChapitreEtCaisseParams): __Observable<Array<EncaissementPrincipalDTO>> {
    return this.listeEncaissementEntreDeuxDateParChapitreEtCaisseResponse(params).pipe(
      __map(_r => _r.body as Array<EncaissementPrincipalDTO>)
    );
  }

  /**
   * @param params The `ApiService.ListeLocataireImpayerParAgenceEtPeriodeParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `agence`:
   *
   * @return successful operation
   */
  listeLocataireImpayerParAgenceEtPeriodeResponse(params: ApiService.ListeLocataireImpayerParAgenceEtPeriodeParams): __Observable<__StrictHttpResponse<Array<LocataireEncaisDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/listeLocataireImpayerParAgenceEtPeriode/${params.agence}/${params.periode}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LocataireEncaisDTO>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListeLocataireImpayerParAgenceEtPeriodeParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `agence`:
   *
   * @return successful operation
   */
  listeLocataireImpayerParAgenceEtPeriode(params: ApiService.ListeLocataireImpayerParAgenceEtPeriodeParams): __Observable<Array<LocataireEncaisDTO>> {
    return this.listeLocataireImpayerParAgenceEtPeriodeResponse(params).pipe(
      __map(_r => _r.body as Array<LocataireEncaisDTO>)
    );
  }

  /**
   * @param idEncaiss undefined
   * @return successful operation
   */
  miseAJourEncaissementCloturerResponse(idEncaiss: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/miseAJourEncaissementCloturer/${idEncaiss}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param idEncaiss undefined
   * @return successful operation
   */
  miseAJourEncaissementCloturer(idEncaiss: number): __Observable<boolean> {
    return this.miseAJourEncaissementCloturerResponse(idEncaiss).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementResponse(body?: EncaissementPayloadDto): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/encaissement/saveencaissement`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissement(body?: EncaissementPayloadDto): __Observable<boolean> {
    return this.saveEncaissementResponse(body).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementAvecretourDeListeResponse(body?: EncaissementPayloadDto): __Observable<__StrictHttpResponse<Array<EncaissementPrincipalDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/encaissement/saveencaissementavecretour`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementPrincipalDTO>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementAvecretourDeListe(body?: EncaissementPayloadDto): __Observable<Array<EncaissementPrincipalDTO>> {
    return this.saveEncaissementAvecretourDeListeResponse(body).pipe(
      __map(_r => _r.body as Array<EncaissementPrincipalDTO>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementMasseResponse(body?: Array<EncaissementPayloadDto>): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/encaissement/saveencaissementmasse`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementMasse(body?: Array<EncaissementPayloadDto>): __Observable<boolean> {
    return this.saveEncaissementMasseResponse(body).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementMasseAvecretourDeListeResponse(body?: EncaissementPayloadDto): __Observable<__StrictHttpResponse<Array<LocataireEncaisDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/encaissement/saveencaissementmasseavecretour`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LocataireEncaisDTO>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveEncaissementMasseAvecretourDeListe(body?: EncaissementPayloadDto): __Observable<Array<LocataireEncaisDTO>> {
    return this.saveEncaissementMasseAvecretourDeListeResponse(body).pipe(
      __map(_r => _r.body as Array<LocataireEncaisDTO>)
    );
  }

  /**
   * @param params The `ApiService.SommeEncaissementParAgenceEtParPeriodeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  sommeEncaissementParAgenceEtParPeriodeResponse(params: ApiService.SommeEncaissementParAgenceEtParPeriodeParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/sommeEncaissementParAgenceEtParPeriode/${params.idAgence}/${params.datedebut}/${params.datefin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.SommeEncaissementParAgenceEtParPeriodeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  sommeEncaissementParAgenceEtParPeriode(params: ApiService.SommeEncaissementParAgenceEtParPeriodeParams): __Observable<number> {
    return this.sommeEncaissementParAgenceEtParPeriodeResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.SommeLoyerParAgenceEtParPeriodeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  sommeLoyerParAgenceEtParPeriodeResponse(params: ApiService.SommeLoyerParAgenceEtParPeriodeParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/sommeLoyerParAgenceEtParPeriode/${params.idAgence}/${params.datedebut}/${params.datefin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.SommeLoyerParAgenceEtParPeriodeParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `datefin`:
   *
   * - `datedebut`:
   *
   * @return successful operation
   */
  sommeLoyerParAgenceEtParPeriode(params: ApiService.SommeLoyerParAgenceEtParPeriodeParams): __Observable<number> {
    return this.sommeLoyerParAgenceEtParPeriodeResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  totalencaissementParIdAppelLoyerResponse(id: number): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/totalencaissement/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  totalencaissementParIdAppelLoyer(id: number): __Observable<number> {
    return this.totalencaissementParIdAppelLoyerResponse(id).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.TotalEncaissementParJourParams` containing the following parameters:
   *
   * - `jour`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  totalEncaissementParJourResponse(params: ApiService.TotalEncaissementParJourParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/encaissement/totalencaissementjournalier/${params.jour}/${params.idAgence}/${params.chapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.TotalEncaissementParJourParams` containing the following parameters:
   *
   * - `jour`:
   *
   * - `idAgence`:
   *
   * - `chapitre`:
   *
   * @return successful operation
   */
  totalEncaissementParJour(params: ApiService.TotalEncaissementParJourParams): __Observable<number> {
    return this.totalEncaissementParJourResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param params The `ApiService.SendMailGrouperWithAttachmentParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  sendMailGrouperWithAttachmentResponse(params: ApiService.SendMailGrouperWithAttachmentParams): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/envoimail/sendmailgrouper/${params.periode}/${params.idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param params The `ApiService.SendMailGrouperWithAttachmentParams` containing the following parameters:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  sendMailGrouperWithAttachment(params: ApiService.SendMailGrouperWithAttachmentParams): __Observable<boolean> {
    return this.sendMailGrouperWithAttachmentResponse(params).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  sendMailQuittanceWithAttachmentResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/envoimail/sendquittancebymail/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  sendMailQuittanceWithAttachment(id: number): __Observable<boolean> {
    return this.sendMailQuittanceWithAttachmentResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveEspeceEncaissementResponse(body?: EspeceEncaissementDto): __Observable<__StrictHttpResponse<EspeceEncaissementDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/especeencaissement/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EspeceEncaissementDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveEspeceEncaissement(body?: EspeceEncaissementDto): __Observable<EspeceEncaissementDto> {
    return this.saveEspeceEncaissementResponse(body).pipe(
      __map(_r => _r.body as EspeceEncaissementDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  getDefaultEtableResponse(id: number): __Observable<__StrictHttpResponse<EtablissementUtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/etablissement/getDefaultEtable/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EtablissementUtilisateurDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  getDefaultEtable(id: number): __Observable<EtablissementUtilisateurDto> {
    return this.getDefaultEtableResponse(id).pipe(
      __map(_r => _r.body as EtablissementUtilisateurDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllEtageResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<EtageDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/etage/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EtageDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllEtage(idAgence: number): __Observable<Array<EtageDto>> {
    return this.findAllEtageResponse(idAgence).pipe(
      __map(_r => _r.body as Array<EtageDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteEtageResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/etage/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteEtage(id: number): __Observable<boolean> {
    return this.deleteEtageResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findEtageByIDResponse(id: number): __Observable<__StrictHttpResponse<EtageDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/etage/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EtageDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findEtageByID(id: number): __Observable<EtageDto> {
    return this.findEtageByIDResponse(id).pipe(
      __map(_r => _r.body as EtageDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  affichageDesEtageParImmeubleResponse(id: number): __Observable<__StrictHttpResponse<Array<EtageAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/etage/findByIdImmeuble/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EtageAfficheDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  affichageDesEtageParImmeuble(id: number): __Observable<Array<EtageAfficheDto>> {
    return this.affichageDesEtageParImmeubleResponse(id).pipe(
      __map(_r => _r.body as Array<EtageAfficheDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findEtageByNameResponse(name: string): __Observable<__StrictHttpResponse<EtageDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/etage/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EtageDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findEtageByName(name: string): __Observable<EtageDto> {
    return this.findEtageByNameResponse(name).pipe(
      __map(_r => _r.body as EtageDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveEtageResponse(body?: EtageDto): __Observable<__StrictHttpResponse<EtageDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/etage/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EtageDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveEtage(body?: EtageDto): __Observable<EtageDto> {
    return this.saveEtageResponse(body).pipe(
      __map(_r => _r.body as EtageDto)
    );
  }

  /**
   * @return successful operation
   */
  findAllGroupeDroitResponse(): __Observable<__StrictHttpResponse<Array<GroupeDroitDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/groupeDroit/`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<GroupeDroitDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllGroupeDroit(): __Observable<Array<GroupeDroitDto>> {
    return this.findAllGroupeDroitResponse().pipe(
      __map(_r => _r.body as Array<GroupeDroitDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveGroupeDroitResponse(body?: GroupeDroitDto): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/groupeDroit/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveGroupeDroit(body?: GroupeDroitDto): __Observable<number> {
    return this.saveGroupeDroitResponse(body).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param groupedroitid undefined
   * @return successful operation
   */
  findByIdGroupeDroitResponse(groupedroitid: number): __Observable<__StrictHttpResponse<GroupeDroitDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/groupeDroit/${groupedroitid}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<GroupeDroitDto>;
      })
    );
  }
  /**
   * @param groupedroitid undefined
   * @return successful operation
   */
  findByIdGroupeDroit(groupedroitid: number): __Observable<GroupeDroitDto> {
    return this.findByIdGroupeDroitResponse(groupedroitid).pipe(
      __map(_r => _r.body as GroupeDroitDto)
    );
  }

  /**
   * @param groupedroitid undefined
   */
  deleteGroupeDroitResponse(groupedroitid: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/groupeDroit/${groupedroitid}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param groupedroitid undefined
   */
  deleteGroupeDroit(groupedroitid: number): __Observable<null> {
    return this.deleteGroupeDroitResponse(groupedroitid).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  telechagerImageResponse(id: number): __Observable<__StrictHttpResponse<Array<ImageDataDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/image/imagesbybien/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ImageDataDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  telechagerImage(id: number): __Observable<Array<ImageDataDto>> {
    return this.telechagerImageResponse(id).pipe(
      __map(_r => _r.body as Array<ImageDataDto>)
    );
  }

  /**
   * @param params The `ApiService.UploadImageParams` containing the following parameters:
   *
   * - `name`:
   *
   * - `id`:
   *
   * - `file`:
   *
   * @return successful operation
   */
  uploadImageResponse(params: ApiService.UploadImageParams): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    if (params.file != null) __params = __params.set('file', params.file.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/image/upload/${params.id}/${params.name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param params The `ApiService.UploadImageParams` containing the following parameters:
   *
   * - `name`:
   *
   * - `id`:
   *
   * - `file`:
   *
   * @return successful operation
   */
  uploadImage(params: ApiService.UploadImageParams): __Observable<boolean> {
    return this.uploadImageResponse(params).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  affichageDesImmeublesResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<ImmeubleEtageDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/immeuble/affichetoutlesimmeubles/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ImmeubleEtageDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  affichageDesImmeubles(idAgence: number): __Observable<Array<ImmeubleEtageDto>> {
    return this.affichageDesImmeublesResponse(idAgence).pipe(
      __map(_r => _r.body as Array<ImmeubleEtageDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllImmeubleResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<ImmeubleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/immeuble/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ImmeubleDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllImmeuble(idAgence: number): __Observable<Array<ImmeubleDto>> {
    return this.findAllImmeubleResponse(idAgence).pipe(
      __map(_r => _r.body as Array<ImmeubleDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteImmeubleResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/immeuble/deleteImmeuble/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteImmeuble(id: number): __Observable<boolean> {
    return this.deleteImmeubleResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findImmeubleByIDResponse(id: number): __Observable<__StrictHttpResponse<ImmeubleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/immeuble/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ImmeubleDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findImmeubleByID(id: number): __Observable<ImmeubleDto> {
    return this.findImmeubleByIDResponse(id).pipe(
      __map(_r => _r.body as ImmeubleDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findImmeubleByIdSiteResponse(id: number): __Observable<__StrictHttpResponse<Array<ImmeubleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/immeuble/findByIdSite/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ImmeubleDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findImmeubleByIdSite(id: number): __Observable<Array<ImmeubleDto>> {
    return this.findImmeubleByIdSiteResponse(id).pipe(
      __map(_r => _r.body as Array<ImmeubleDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findImmeubleByNameResponse(name: string): __Observable<__StrictHttpResponse<ImmeubleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/immeuble/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ImmeubleDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findImmeubleByName(name: string): __Observable<ImmeubleDto> {
    return this.findImmeubleByNameResponse(name).pipe(
      __map(_r => _r.body as ImmeubleDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveImmeubleEtageResponse(body?: ImmeubleEtageDto): __Observable<__StrictHttpResponse<ImmeubleEtageDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/immeuble/saveImeubleEtage`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ImmeubleEtageDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveImmeubleEtage(body?: ImmeubleEtageDto): __Observable<ImmeubleEtageDto> {
    return this.saveImmeubleEtageResponse(body).pipe(
      __map(_r => _r.body as ImmeubleEtageDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllMagasinResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<MagasinResponseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/magasin/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MagasinResponseDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllMagasin(idAgence: number): __Observable<Array<MagasinResponseDto>> {
    return this.findAllMagasinResponse(idAgence).pipe(
      __map(_r => _r.body as Array<MagasinResponseDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllMagasinLibreResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<MagasinResponseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/magasin/alllibre/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MagasinResponseDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllMagasinLibre(idAgence: number): __Observable<Array<MagasinResponseDto>> {
    return this.findAllMagasinLibreResponse(idAgence).pipe(
      __map(_r => _r.body as Array<MagasinResponseDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllMagasinByEtageResponse(id: number): __Observable<__StrictHttpResponse<Array<MagasinDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/magasin/findAllMagasinByIdEtage/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MagasinDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllMagasinByEtage(id: number): __Observable<Array<MagasinDto>> {
    return this.findAllMagasinByEtageResponse(id).pipe(
      __map(_r => _r.body as Array<MagasinDto>)
    );
  }

  /**
   * @param idSite undefined
   * @return successful operation
   */
  findAllMagasinByIdSiteResponse(idSite: number): __Observable<__StrictHttpResponse<Array<MagasinDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/magasin/findAllMagasinByIdSite/${idSite}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MagasinDto>>;
      })
    );
  }
  /**
   * @param idSite undefined
   * @return successful operation
   */
  findAllMagasinByIdSite(idSite: number): __Observable<Array<MagasinDto>> {
    return this.findAllMagasinByIdSiteResponse(idSite).pipe(
      __map(_r => _r.body as Array<MagasinDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameMagasinDtoResponse(name: string): __Observable<__StrictHttpResponse<MagasinDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/magasin/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MagasinDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameMagasinDto(name: string): __Observable<MagasinDto> {
    return this.findByNameMagasinDtoResponse(name).pipe(
      __map(_r => _r.body as MagasinDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDMagasinResponse(id: number): __Observable<__StrictHttpResponse<MagasinDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/magasin/findmagasinById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MagasinDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDMagasin(id: number): __Observable<MagasinDto> {
    return this.findByIDMagasinResponse(id).pipe(
      __map(_r => _r.body as MagasinDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveMagasinReturnDtoResponse(body?: MagasinDto): __Observable<__StrictHttpResponse<MagasinDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/magasin/savemagasin`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MagasinDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveMagasinReturnDto(body?: MagasinDto): __Observable<MagasinDto> {
    return this.saveMagasinReturnDtoResponse(body).pipe(
      __map(_r => _r.body as MagasinDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDMontantLoyerBailResponse(id: number): __Observable<__StrictHttpResponse<Array<MontantLoyerBailDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/montantloyerbail/findMontantByBail/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MontantLoyerBailDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDMontantLoyerBail(id: number): __Observable<Array<MontantLoyerBailDto>> {
    return this.findByIDMontantLoyerBailResponse(id).pipe(
      __map(_r => _r.body as Array<MontantLoyerBailDto>)
    );
  }

  /**
   * @return successful operation
   */
  findAllPaysResponse(): __Observable<__StrictHttpResponse<Array<PaysDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/pays/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PaysDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllPays(): __Observable<Array<PaysDto>> {
    return this.findAllPaysResponse().pipe(
      __map(_r => _r.body as Array<PaysDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deletePaysResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/pays/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deletePays(id: number): __Observable<boolean> {
    return this.deletePaysResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findPaysByIDResponse(id: number): __Observable<__StrictHttpResponse<PaysDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/pays/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaysDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findPaysByID(id: number): __Observable<PaysDto> {
    return this.findPaysByIDResponse(id).pipe(
      __map(_r => _r.body as PaysDto)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findPaysByNameResponse(name: string): __Observable<__StrictHttpResponse<PaysDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/pays/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaysDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findPaysByName(name: string): __Observable<PaysDto> {
    return this.findPaysByNameResponse(name).pipe(
      __map(_r => _r.body as PaysDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  savePaysResponse(body?: PaysDto): __Observable<__StrictHttpResponse<PaysDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/pays/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PaysDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  savePays(body?: PaysDto): __Observable<PaysDto> {
    return this.savePaysResponse(body).pipe(
      __map(_r => _r.body as PaysDto)
    );
  }

  /**
   * @return successful operation
   */
  findAllServiceAdditionnelPrestationResponse(): __Observable<__StrictHttpResponse<Array<PrestationSaveOrUpdateDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/prestation/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PrestationSaveOrUpdateDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllServiceAdditionnelPrestation(): __Observable<Array<PrestationSaveOrUpdateDto>> {
    return this.findAllServiceAdditionnelPrestationResponse().pipe(
      __map(_r => _r.body as Array<PrestationSaveOrUpdateDto>)
    );
  }

  /**
   * @param id undefined
   */
  deleteServiceAdditionnelPrestationResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/prestation/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id undefined
   */
  deleteServiceAdditionnelPrestation(id: number): __Observable<null> {
    return this.deleteServiceAdditionnelPrestationResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findServiceAdditionnelByIDPrestationResponse(id: number): __Observable<__StrictHttpResponse<PrestationSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/prestation/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PrestationSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findServiceAdditionnelByIDPrestation(id: number): __Observable<PrestationSaveOrUpdateDto> {
    return this.findServiceAdditionnelByIDPrestationResponse(id).pipe(
      __map(_r => _r.body as PrestationSaveOrUpdateDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdatePrestationResponse(body?: PrestationSaveOrUpdateDto): __Observable<__StrictHttpResponse<PrestationSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/prestation/saveorupdate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PrestationSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdatePrestation(body?: PrestationSaveOrUpdateDto): __Observable<PrestationSaveOrUpdateDto> {
    return this.saveorupdatePrestationResponse(body).pipe(
      __map(_r => _r.body as PrestationSaveOrUpdateDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  sampleQuitanceResponse(id: number): __Observable<__StrictHttpResponse<Array<string>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/print/quittance/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<string>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  sampleQuitance(id: number): __Observable<Array<string>> {
    return this.sampleQuitanceResponse(id).pipe(
      __map(_r => _r.body as Array<string>)
    );
  }

  /**
   * @param params The `ApiService.QuittancePeriodeParams` containing the following parameters:
   *
   * - `proprio`:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  quittancePeriodeResponse(params: ApiService.QuittancePeriodeParams): __Observable<__StrictHttpResponse<InputStreamResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/print/quittancegrouper/${params.periode}/${params.idAgence}/${params.proprio}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InputStreamResource>;
      })
    );
  }
  /**
   * @param params The `ApiService.QuittancePeriodeParams` containing the following parameters:
   *
   * - `proprio`:
   *
   * - `periode`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  quittancePeriode(params: ApiService.QuittancePeriodeParams): __Observable<InputStreamResource> {
    return this.quittancePeriodeResponse(params).pipe(
      __map(_r => _r.body as InputStreamResource)
    );
  }

  /**
   * @param params The `ApiService.RecuReservationParIdReservationParams` containing the following parameters:
   *
   * - `proprio`:
   *
   * - `idReservation`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  recuReservationParIdReservationResponse(params: ApiService.RecuReservationParIdReservationParams): __Observable<__StrictHttpResponse<InputStreamResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/print/recuReservationParIdReservation/${params.idReservation}/${params.idAgence}/${params.proprio}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InputStreamResource>;
      })
    );
  }
  /**
   * @param params The `ApiService.RecuReservationParIdReservationParams` containing the following parameters:
   *
   * - `proprio`:
   *
   * - `idReservation`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  recuReservationParIdReservation(params: ApiService.RecuReservationParIdReservationParams): __Observable<InputStreamResource> {
    return this.recuReservationParIdReservationResponse(params).pipe(
      __map(_r => _r.body as InputStreamResource)
    );
  }

  /**
   * @param idEncaissement undefined
   * @return successful operation
   */
  recuPaimentResponse(idEncaissement: number): __Observable<__StrictHttpResponse<InputStreamResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/print/recupaiment/${idEncaissement}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InputStreamResource>;
      })
    );
  }
  /**
   * @param idEncaissement undefined
   * @return successful operation
   */
  recuPaiment(idEncaissement: number): __Observable<InputStreamResource> {
    return this.recuPaimentResponse(idEncaissement).pipe(
      __map(_r => _r.body as InputStreamResource)
    );
  }

  /**
   * @param params The `ApiService.RecuReservationParams` containing the following parameters:
   *
   * - `proprio`:
   *
   * - `idEncaissement`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  recuReservationResponse(params: ApiService.RecuReservationParams): __Observable<__StrictHttpResponse<InputStreamResource>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/print/recureservation/${params.idEncaissement}/${params.idAgence}/${params.proprio}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InputStreamResource>;
      })
    );
  }
  /**
   * @param params The `ApiService.RecuReservationParams` containing the following parameters:
   *
   * - `proprio`:
   *
   * - `idEncaissement`:
   *
   * - `idAgence`:
   *
   * @return successful operation
   */
  recuReservation(params: ApiService.RecuReservationParams): __Observable<InputStreamResource> {
    return this.recuReservationResponse(params).pipe(
      __map(_r => _r.body as InputStreamResource)
    );
  }

  /**
   * @param idCategorie undefined
   * @return successful operation
   */
  listDesPrixParCategoriResponse(idCategorie: number): __Observable<__StrictHttpResponse<Array<PrixParCategorieChambreDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/prixparcategorie/listDesPrixParCategori/${idCategorie}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PrixParCategorieChambreDto>>;
      })
    );
  }
  /**
   * @param idCategorie undefined
   * @return successful operation
   */
  listDesPrixParCategori(idCategorie: number): __Observable<Array<PrixParCategorieChambreDto>> {
    return this.listDesPrixParCategoriResponse(idCategorie).pipe(
      __map(_r => _r.body as Array<PrixParCategorieChambreDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveOrUpDatePrixParCategorieResponse(body?: PrixParCategorieChambreDto): __Observable<__StrictHttpResponse<PrixParCategorieChambreDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/prixparcategorie/saveOrUpDatePrixParCategorie`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PrixParCategorieChambreDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveOrUpDatePrixParCategorie(body?: PrixParCategorieChambreDto): __Observable<PrixParCategorieChambreDto> {
    return this.saveOrUpDatePrixParCategorieResponse(body).pipe(
      __map(_r => _r.body as PrixParCategorieChambreDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllQuartiersResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<QuartierRequestDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/quartier/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<QuartierRequestDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllQuartiers(idAgence: number): __Observable<Array<QuartierRequestDto>> {
    return this.findAllQuartiersResponse(idAgence).pipe(
      __map(_r => _r.body as Array<QuartierRequestDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteQuartierResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/quartier/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteQuartier(id: number): __Observable<boolean> {
    return this.deleteQuartierResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDQuartiersResponse(id: number): __Observable<__StrictHttpResponse<QuartierRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/quartier/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<QuartierRequestDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIDQuartiers(id: number): __Observable<QuartierRequestDto> {
    return this.findByIDQuartiersResponse(id).pipe(
      __map(_r => _r.body as QuartierRequestDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllQuartierByIdCommuneResponse(id: number): __Observable<__StrictHttpResponse<Array<QuartierRequestDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/quartier/findByIdCommune/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<QuartierRequestDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllQuartierByIdCommune(id: number): __Observable<Array<QuartierRequestDto>> {
    return this.findAllQuartierByIdCommuneResponse(id).pipe(
      __map(_r => _r.body as Array<QuartierRequestDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameQuartierResponse(name: string): __Observable<__StrictHttpResponse<QuartierRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/quartier/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<QuartierRequestDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findByNameQuartier(name: string): __Observable<QuartierRequestDto> {
    return this.findByNameQuartierResponse(name).pipe(
      __map(_r => _r.body as QuartierRequestDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveQuartierResponse(body?: QuartierRequestDto): __Observable<__StrictHttpResponse<QuartierRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/quartier/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<QuartierRequestDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveQuartier(body?: QuartierRequestDto): __Observable<QuartierRequestDto> {
    return this.saveQuartierResponse(body).pipe(
      __map(_r => _r.body as QuartierRequestDto)
    );
  }

  /**
   * @return successful operation
   */
  allreservationResponse(): __Observable<__StrictHttpResponse<Array<ReservationAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/reservation/allreservation`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ReservationAfficheDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  allreservation(): __Observable<Array<ReservationAfficheDto>> {
    return this.allreservationResponse().pipe(
      __map(_r => _r.body as Array<ReservationAfficheDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  allreservationparagenceResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<ReservationAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/reservation/allreservationparagence/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ReservationAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  allreservationparagence(idAgence: number): __Observable<Array<ReservationAfficheDto>> {
    return this.allreservationparagenceResponse(idAgence).pipe(
      __map(_r => _r.body as Array<ReservationAfficheDto>)
    );
  }

  /**
   * @param id undefined
   */
  deleteReservationResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/reservation/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id undefined
   */
  deleteReservation(id: number): __Observable<null> {
    return this.deleteReservationResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param idReser undefined
   * @return successful operation
   */
  findAllEncaissementReservationByIdBienResponse(idReser: number): __Observable<__StrictHttpResponse<Array<EncaissementReservationDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/reservation/findAllEncaissementReservationByIdBien/${idReser}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementReservationDto>>;
      })
    );
  }
  /**
   * @param idReser undefined
   * @return successful operation
   */
  findAllEncaissementReservationByIdBien(idReser: number): __Observable<Array<EncaissementReservationDto>> {
    return this.findAllEncaissementReservationByIdBienResponse(idReser).pipe(
      __map(_r => _r.body as Array<EncaissementReservationDto>)
    );
  }

  /**
   * @param idBien undefined
   * @return successful operation
   */
  findPeriodeReservationByIdBienResponse(idBien: number): __Observable<__StrictHttpResponse<ReservationAfficheDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/reservation/findPeriodeReservationByIdBien/${idBien}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ReservationAfficheDto>;
      })
    );
  }
  /**
   * @param idBien undefined
   * @return successful operation
   */
  findPeriodeReservationByIdBien(idBien: number): __Observable<ReservationAfficheDto> {
    return this.findPeriodeReservationByIdBienResponse(idBien).pipe(
      __map(_r => _r.body as ReservationAfficheDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findCategorieChambreByIDReservationResponse(id: number): __Observable<__StrictHttpResponse<ReservationAfficheDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/reservation/findReservationById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ReservationAfficheDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findCategorieChambreByIDReservation(id: number): __Observable<ReservationAfficheDto> {
    return this.findCategorieChambreByIDReservationResponse(id).pipe(
      __map(_r => _r.body as ReservationAfficheDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listeDesReservationOuvertParAgenceResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<ReservationAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/reservation/listeDesReservationOuvertParAgence/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ReservationAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listeDesReservationOuvertParAgence(idAgence: number): __Observable<Array<ReservationAfficheDto>> {
    return this.listeDesReservationOuvertParAgenceResponse(idAgence).pipe(
      __map(_r => _r.body as Array<ReservationAfficheDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveencaissementreservationResponse(body?: EncaissementReservationRequestDto): __Observable<__StrictHttpResponse<Array<EncaissementReservationDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/reservation/saveencaissementreservation`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EncaissementReservationDto>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveencaissementreservation(body?: EncaissementReservationRequestDto): __Observable<Array<EncaissementReservationDto>> {
    return this.saveencaissementreservationResponse(body).pipe(
      __map(_r => _r.body as Array<EncaissementReservationDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdateResResponse(body?: ReservationSaveOrUpdateDto): __Observable<__StrictHttpResponse<ReservationSaveOrUpdateDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/reservation/saveorupdate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ReservationSaveOrUpdateDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdateRes(body?: ReservationSaveOrUpdateDto): __Observable<ReservationSaveOrUpdateDto> {
    return this.saveorupdateResResponse(body).pipe(
      __map(_r => _r.body as ReservationSaveOrUpdateDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdategoodResponse(body?: ReservationRequestDto): __Observable<__StrictHttpResponse<ReservationAfficheDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/reservation/saveorupdategood`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ReservationAfficheDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdategood(body?: ReservationRequestDto): __Observable<ReservationAfficheDto> {
    return this.saveorupdategoodResponse(body).pipe(
      __map(_r => _r.body as ReservationAfficheDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdatereservationResponse(body?: ReservationRequestDto): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/reservation/saveorupdatereservation`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdatereservation(body?: ReservationRequestDto): __Observable<boolean> {
    return this.saveorupdatereservationResponse(body).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @return successful operation
   */
  findAllServiceAdditionnelPrestationAdditionnelResponse(): __Observable<__StrictHttpResponse<Array<PrestationAdditionnelReservationSaveOrrUpdate>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/serviceadditionnel/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PrestationAdditionnelReservationSaveOrrUpdate>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllServiceAdditionnelPrestationAdditionnel(): __Observable<Array<PrestationAdditionnelReservationSaveOrrUpdate>> {
    return this.findAllServiceAdditionnelPrestationAdditionnelResponse().pipe(
      __map(_r => _r.body as Array<PrestationAdditionnelReservationSaveOrrUpdate>)
    );
  }

  /**
   * @param id undefined
   */
  deleteServiceAdditionnelPrestationAdditionnelResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/serviceadditionnel/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id undefined
   */
  deleteServiceAdditionnelPrestationAdditionnel(id: number): __Observable<null> {
    return this.deleteServiceAdditionnelPrestationAdditionnelResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findServiceAdditionnelByIDPrestationAdditionnelResponse(id: number): __Observable<__StrictHttpResponse<PrestationAdditionnelReservationSaveOrrUpdate>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/serviceadditionnel/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PrestationAdditionnelReservationSaveOrrUpdate>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findServiceAdditionnelByIDPrestationAdditionnel(id: number): __Observable<PrestationAdditionnelReservationSaveOrrUpdate> {
    return this.findServiceAdditionnelByIDPrestationAdditionnelResponse(id).pipe(
      __map(_r => _r.body as PrestationAdditionnelReservationSaveOrrUpdate)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdatePrestationAdditionnelResponse(body?: PrestationAdditionnelReservationSaveOrrUpdate): __Observable<__StrictHttpResponse<PrestationAdditionnelReservationSaveOrrUpdate>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/serviceadditionnel/saveorupdate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PrestationAdditionnelReservationSaveOrrUpdate>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveorupdatePrestationAdditionnel(body?: PrestationAdditionnelReservationSaveOrrUpdate): __Observable<PrestationAdditionnelReservationSaveOrrUpdate> {
    return this.saveorupdatePrestationAdditionnelResponse(body).pipe(
      __map(_r => _r.body as PrestationAdditionnelReservationSaveOrrUpdate)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllSitesResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<SiteResponseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/sites/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SiteResponseDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllSites(idAgence: number): __Observable<Array<SiteResponseDto>> {
    return this.findAllSitesResponse(idAgence).pipe(
      __map(_r => _r.body as Array<SiteResponseDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteSiteResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/sites/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteSite(id: number): __Observable<boolean> {
    return this.deleteSiteResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findSiteByIDResponse(id: number): __Observable<__StrictHttpResponse<SiteResponseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/sites/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SiteResponseDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findSiteByID(id: number): __Observable<SiteResponseDto> {
    return this.findSiteByIDResponse(id).pipe(
      __map(_r => _r.body as SiteResponseDto)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findSiteByNameResponse(name: string): __Observable<__StrictHttpResponse<SiteResponseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/sites/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SiteResponseDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findSiteByName(name: string): __Observable<SiteResponseDto> {
    return this.findSiteByNameResponse(name).pipe(
      __map(_r => _r.body as SiteResponseDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveSitesResponse(body?: SiteRequestDto): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/sites/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveSites(body?: SiteRequestDto): __Observable<boolean> {
    return this.saveSitesResponse(body).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveSiteResponse(body?: SiteRequestDto): __Observable<__StrictHttpResponse<SiteResponseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/sites/savesite`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SiteResponseDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveSite(body?: SiteRequestDto): __Observable<SiteResponseDto> {
    return this.saveSiteResponse(body).pipe(
      __map(_r => _r.body as SiteResponseDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllEncaissementSuivieDepenseParAgenceResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<SuivieDepenseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/allSuivieDepense/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SuivieDepenseDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllEncaissementSuivieDepenseParAgence(idAgence: number): __Observable<Array<SuivieDepenseDto>> {
    return this.getAllEncaissementSuivieDepenseParAgenceResponse(idAgence).pipe(
      __map(_r => _r.body as Array<SuivieDepenseDto>)
    );
  }

  /**
   * @param params The `ApiService.CountSuiviNonCloturerParCaisseEtChapitreAvantDateParams` containing the following parameters:
   *
   * - `idChapitre`:
   *
   * - `idCaiss`:
   *
   * - `datePriseEnCompteEncaii`:
   *
   * @return successful operation
   */
  countSuiviNonCloturerParCaisseEtChapitreAvantDateResponse(params: ApiService.CountSuiviNonCloturerParCaisseEtChapitreAvantDateParams): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/countSuiviNonCloturerParCaisseEtChapitreAvantDate/${params.datePriseEnCompteEncaii}/${params.idCaiss}/${params.idChapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param params The `ApiService.CountSuiviNonCloturerParCaisseEtChapitreAvantDateParams` containing the following parameters:
   *
   * - `idChapitre`:
   *
   * - `idCaiss`:
   *
   * - `datePriseEnCompteEncaii`:
   *
   * @return successful operation
   */
  countSuiviNonCloturerParCaisseEtChapitreAvantDate(params: ApiService.CountSuiviNonCloturerParCaisseEtChapitreAvantDateParams): __Observable<number> {
    return this.countSuiviNonCloturerParCaisseEtChapitreAvantDateResponse(params).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * @param codeTransaction undefined
   * @return successful operation
   */
  getSuivieDepenseByCodeTransactionResponse(codeTransaction: string): __Observable<__StrictHttpResponse<SuivieDepenseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/getSuivieDepenseByCodeTransaction/${codeTransaction}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SuivieDepenseDto>;
      })
    );
  }
  /**
   * @param codeTransaction undefined
   * @return successful operation
   */
  getSuivieDepenseByCodeTransaction(codeTransaction: string): __Observable<SuivieDepenseDto> {
    return this.getSuivieDepenseByCodeTransactionResponse(codeTransaction).pipe(
      __map(_r => _r.body as SuivieDepenseDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  getSuivieDepenseByIdResponse(id: number): __Observable<__StrictHttpResponse<SuivieDepenseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/getSuivieDepenseById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SuivieDepenseDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  getSuivieDepenseById(id: number): __Observable<SuivieDepenseDto> {
    return this.getSuivieDepenseByIdResponse(id).pipe(
      __map(_r => _r.body as SuivieDepenseDto)
    );
  }

  /**
   * @param params The `ApiService.ListSortieDeuxDateParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  listSortieDeuxDateResponse(params: ApiService.ListSortieDeuxDateParams): __Observable<__StrictHttpResponse<Array<SuivieDepenseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/listSortieDeuxDate/${params.idAgence}/${params.debut}/${params.fin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SuivieDepenseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListSortieDeuxDateParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  listSortieDeuxDate(params: ApiService.ListSortieDeuxDateParams): __Observable<Array<SuivieDepenseDto>> {
    return this.listSortieDeuxDateResponse(params).pipe(
      __map(_r => _r.body as Array<SuivieDepenseDto>)
    );
  }

  /**
   * @param params The `ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateParams` containing the following parameters:
   *
   * - `idcaisse`:
   *
   * - `idChapitre`:
   *
   * - `dateDepriseEnCompte`:
   *
   * @return successful operation
   */
  listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateResponse(params: ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateParams): __Observable<__StrictHttpResponse<Array<SuivieDepenseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate/${params.idcaisse}/${params.dateDepriseEnCompte}/${params.idChapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SuivieDepenseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateParams` containing the following parameters:
   *
   * - `idcaisse`:
   *
   * - `idChapitre`:
   *
   * - `dateDepriseEnCompte`:
   *
   * @return successful operation
   */
  listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate(params: ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateParams): __Observable<Array<SuivieDepenseDto>> {
    return this.listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateResponse(params).pipe(
      __map(_r => _r.body as Array<SuivieDepenseDto>)
    );
  }

  /**
   * @param params The `ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateParams` containing the following parameters:
   *
   * - `idcaisse`:
   *
   * - `idChapitre`:
   *
   * - `dateFin`:
   *
   * - `dateDebut`:
   *
   * @return successful operation
   */
  listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateResponse(params: ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateParams): __Observable<__StrictHttpResponse<Array<SuivieDepenseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate/${params.idcaisse}/${params.dateDebut}/${params.dateFin}/${params.idChapitre}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SuivieDepenseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateParams` containing the following parameters:
   *
   * - `idcaisse`:
   *
   * - `idChapitre`:
   *
   * - `dateFin`:
   *
   * - `dateDebut`:
   *
   * @return successful operation
   */
  listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate(params: ApiService.ListSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateParams): __Observable<Array<SuivieDepenseDto>> {
    return this.listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateResponse(params).pipe(
      __map(_r => _r.body as Array<SuivieDepenseDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveSuivieDepenseResponse(body?: SuivieDepenseDto): __Observable<__StrictHttpResponse<Array<SuivieDepenseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/suiviedepense/saveSuivieDepense`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SuivieDepenseDto>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveSuivieDepense(body?: SuivieDepenseDto): __Observable<Array<SuivieDepenseDto>> {
    return this.saveSuivieDepenseResponse(body).pipe(
      __map(_r => _r.body as Array<SuivieDepenseDto>)
    );
  }

  /**
   * @param params The `ApiService.SuprimerSuiviParIdParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `id`:
   *
   * @return successful operation
   */
  suprimerSuiviParIdResponse(params: ApiService.SuprimerSuiviParIdParams): __Observable<__StrictHttpResponse<Array<SuivieDepenseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/suiviedepense/suprimerSuiviParId/${params.id}/${params.idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SuivieDepenseDto>>;
      })
    );
  }
  /**
   * @param params The `ApiService.SuprimerSuiviParIdParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `id`:
   *
   * @return successful operation
   */
  suprimerSuiviParId(params: ApiService.SuprimerSuiviParIdParams): __Observable<Array<SuivieDepenseDto>> {
    return this.suprimerSuiviParIdResponse(params).pipe(
      __map(_r => _r.body as Array<SuivieDepenseDto>)
    );
  }

  /**
   * @param params The `ApiService.TotalSortieDeuxDateParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  totalSortieDeuxDateResponse(params: ApiService.TotalSortieDeuxDateParams): __Observable<__StrictHttpResponse<SuivieDepenseEncaisPeriodeDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/suiviedepense/totalSortieDeuxDate/${params.idAgence}/${params.debut}/${params.fin}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SuivieDepenseEncaisPeriodeDto>;
      })
    );
  }
  /**
   * @param params The `ApiService.TotalSortieDeuxDateParams` containing the following parameters:
   *
   * - `idAgence`:
   *
   * - `fin`:
   *
   * - `debut`:
   *
   * @return successful operation
   */
  totalSortieDeuxDate(params: ApiService.TotalSortieDeuxDateParams): __Observable<SuivieDepenseEncaisPeriodeDto> {
    return this.totalSortieDeuxDateResponse(params).pipe(
      __map(_r => _r.body as SuivieDepenseEncaisPeriodeDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllUtilisateursByOrderResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllUtilisateursByOrder(idAgence: number): __Observable<Array<UtilisateurAfficheDto>> {
    return this.getAllUtilisateursByOrderResponse(idAgence).pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listOfAllUtilisateurClientHotelOrderbyNameByAgenceResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/clienthotel/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  listOfAllUtilisateurClientHotelOrderbyNameByAgence(idAgence: number): __Observable<Array<UtilisateurAfficheDto>> {
    return this.listOfAllUtilisateurClientHotelOrderbyNameByAgenceResponse(idAgence).pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllGerantsByOrderResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/gerants/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllGerantsByOrder(idAgence: number): __Observable<Array<UtilisateurAfficheDto>> {
    return this.getAllGerantsByOrderResponse(idAgence).pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getUtilisateurByAgenceResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/getAllutilisateurbyAgence/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getUtilisateurByAgence(idAgence: number): __Observable<Array<UtilisateurAfficheDto>> {
    return this.getUtilisateurByAgenceResponse(idAgence).pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param email undefined
   * @return successful operation
   */
  getUtilisateurByEmailResponse(email: string): __Observable<__StrictHttpResponse<UtilisateurRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/getutilisateurbyemail/${email}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateurRequestDto>;
      })
    );
  }
  /**
   * @param email undefined
   * @return successful operation
   */
  getUtilisateurByEmail(email: string): __Observable<UtilisateurRequestDto> {
    return this.getUtilisateurByEmailResponse(email).pipe(
      __map(_r => _r.body as UtilisateurRequestDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  getUtilisateurByIDResponse(id: number): __Observable<__StrictHttpResponse<UtilisateurRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/getutilisateurbyid/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateurRequestDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  getUtilisateurByID(id: number): __Observable<UtilisateurRequestDto> {
    return this.getUtilisateurByIDResponse(id).pipe(
      __map(_r => _r.body as UtilisateurRequestDto)
    );
  }

  /**
   * @param username undefined
   * @return successful operation
   */
  getUtilisateurByUsernameResponse(username: string): __Observable<__StrictHttpResponse<UtilisateurRequestDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/getutilisateurbyusername/${username}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateurRequestDto>;
      })
    );
  }
  /**
   * @param username undefined
   * @return successful operation
   */
  getUtilisateurByUsername(username: string): __Observable<UtilisateurRequestDto> {
    return this.getUtilisateurByUsernameResponse(username).pipe(
      __map(_r => _r.body as UtilisateurRequestDto)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllLocatairesByOrderResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/locataires/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllLocatairesByOrder(idAgence: number): __Observable<Array<UtilisateurAfficheDto>> {
    return this.getAllLocatairesByOrderResponse(idAgence).pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllLocatairesAvecBailResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<LocataireEncaisDTO>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/locataires/ayanbail/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LocataireEncaisDTO>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllLocatairesAvecBail(idAgence: number): __Observable<Array<LocataireEncaisDTO>> {
    return this.getAllLocatairesAvecBailResponse(idAgence).pipe(
      __map(_r => _r.body as Array<LocataireEncaisDTO>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllProprietaireByOrderResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/proprietaires/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  getAllProprietaireByOrder(idAgence: number): __Observable<Array<UtilisateurAfficheDto>> {
    return this.getAllProprietaireByOrderResponse(idAgence).pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveUtilisateurResponse(body?: UtilisateurRequestDto): __Observable<__StrictHttpResponse<UtilisateurAfficheDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/utilisateur/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateurAfficheDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveUtilisateur(body?: UtilisateurRequestDto): __Observable<UtilisateurAfficheDto> {
    return this.saveUtilisateurResponse(body).pipe(
      __map(_r => _r.body as UtilisateurAfficheDto)
    );
  }

  /**
   * @return successful operation
   */
  getAllSuperviseursByOrderResponse(): __Observable<__StrictHttpResponse<Array<UtilisateurAfficheDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/utilisateur/superviseurs/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurAfficheDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  getAllSuperviseursByOrder(): __Observable<Array<UtilisateurAfficheDto>> {
    return this.getAllSuperviseursByOrderResponse().pipe(
      __map(_r => _r.body as Array<UtilisateurAfficheDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllVillaResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<VillaDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/villa/all/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VillaDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllVilla(idAgence: number): __Observable<Array<VillaDto>> {
    return this.findAllVillaResponse(idAgence).pipe(
      __map(_r => _r.body as Array<VillaDto>)
    );
  }

  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllVillaLibreResponse(idAgence: number): __Observable<__StrictHttpResponse<Array<VillaDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/villa/alllibre/${idAgence}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VillaDto>>;
      })
    );
  }
  /**
   * @param idAgence undefined
   * @return successful operation
   */
  findAllVillaLibre(idAgence: number): __Observable<Array<VillaDto>> {
    return this.findAllVillaLibreResponse(idAgence).pipe(
      __map(_r => _r.body as Array<VillaDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findVillaByIdResponse(id: number): __Observable<__StrictHttpResponse<VillaDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/villa/findVillaById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VillaDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findVillaById(id: number): __Observable<VillaDto> {
    return this.findVillaByIdResponse(id).pipe(
      __map(_r => _r.body as VillaDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveVillaResponse(body?: VillaDto): __Observable<__StrictHttpResponse<VillaDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/villa/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VillaDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveVilla(body?: VillaDto): __Observable<VillaDto> {
    return this.saveVillaResponse(body).pipe(
      __map(_r => _r.body as VillaDto)
    );
  }

  /**
   * @return successful operation
   */
  findAllVillesResponse(): __Observable<__StrictHttpResponse<Array<VilleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/ville/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VilleDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAllVilles(): __Observable<Array<VilleDto>> {
    return this.findAllVillesResponse().pipe(
      __map(_r => _r.body as Array<VilleDto>)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  deleteVilleResponse(id: number): __Observable<__StrictHttpResponse<boolean>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/v1/ville/delete/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: (_r as HttpResponse<any>).body === 'true' }) as __StrictHttpResponse<boolean>
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  deleteVille(id: number): __Observable<boolean> {
    return this.deleteVilleResponse(id).pipe(
      __map(_r => _r.body as boolean)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findByIdVilleResponse(id: number): __Observable<__StrictHttpResponse<VilleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/ville/findById/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VilleDto>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findByIdVille(id: number): __Observable<VilleDto> {
    return this.findByIdVilleResponse(id).pipe(
      __map(_r => _r.body as VilleDto)
    );
  }

  /**
   * @param id undefined
   * @return successful operation
   */
  findAllVilleByIdPaysResponse(id: number): __Observable<__StrictHttpResponse<Array<VilleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/ville/findByIdPays/${id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VilleDto>>;
      })
    );
  }
  /**
   * @param id undefined
   * @return successful operation
   */
  findAllVilleByIdPays(id: number): __Observable<Array<VilleDto>> {
    return this.findAllVilleByIdPaysResponse(id).pipe(
      __map(_r => _r.body as Array<VilleDto>)
    );
  }

  /**
   * @param name undefined
   * @return successful operation
   */
  findVilleByNameVilleResponse(name: string): __Observable<__StrictHttpResponse<VilleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/ville/findByName/${name}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VilleDto>;
      })
    );
  }
  /**
   * @param name undefined
   * @return successful operation
   */
  findVilleByNameVille(name: string): __Observable<VilleDto> {
    return this.findVilleByNameVilleResponse(name).pipe(
      __map(_r => _r.body as VilleDto)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  findAllVilleByPaysObjectResponse(body?: PaysDto): __Observable<__StrictHttpResponse<Array<VilleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/v1/ville/findByPays`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VilleDto>>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  findAllVilleByPaysObject(body?: PaysDto): __Observable<Array<VilleDto>> {
    return this.findAllVilleByPaysObjectResponse(body).pipe(
      __map(_r => _r.body as Array<VilleDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveVilleResponse(body?: VilleDto): __Observable<__StrictHttpResponse<VilleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `api/v1/ville/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VilleDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  saveVille(body?: VilleDto): __Observable<VilleDto> {
    return this.saveVilleResponse(body).pipe(
      __map(_r => _r.body as VilleDto)
    );
  }
}

module ApiService {

  /**
   * Parameters for AppelLoyersParPeriode
   */
  export interface AppelLoyersParPeriodeParams {
    periode: string;
    idAgence: number;
  }

  /**
   * Parameters for findAllPeriodeByAnnee
   */
  export interface FindAllPeriodeByAnneeParams {
    idAgence: number;
    annee: number;
  }

  /**
   * Parameters for findAllPeriodeChiffreEtLettreByAnnee
   */
  export interface FindAllPeriodeChiffreEtLettreByAnneeParams {
    idAgence: number;
    annee: number;
  }

  /**
   * Parameters for findByIdAndBail
   */
  export interface FindByIdAndBailParams {
    periode: string;
    idBien: number;
  }

  /**
   * Parameters for impayeLoyerParAnnee
   */
  export interface ImpayeLoyerParAnneeParams {
    idAgence: number;
    chapitre: number;
    annee: number;
  }

  /**
   * Parameters for impayeLoyerParMoisAppelLoyer
   */
  export interface ImpayeLoyerParMoisAppelLoyerParams {
    periode: string;
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for listeDesloyerSuperieurAUnePeriode
   */
  export interface ListeDesloyerSuperieurAUnePeriodeParams {
    periode: string;
    idBien: number;
  }

  /**
   * Parameters for nombreImpayerLoyerParMois
   */
  export interface NombreImpayerLoyerParMoisParams {
    periode: string;
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for nombrePayerLoyerParMois
   */
  export interface NombrePayerLoyerParMoisParams {
    periode: string;
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for payeLoyerParAnnee
   */
  export interface PayeLoyerParAnneeParams {
    idAgence: number;
    chapitre: number;
    annee: number;
  }

  /**
   * Parameters for payeLoyerParMois
   */
  export interface PayeLoyerParMoisParams {
    periode: string;
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for staisiqueLoyerParMois
   */
  export interface StaisiqueLoyerParMoisParams {
    periode: string;
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for statistiqueLoyerParAnnee
   */
  export interface StatistiqueLoyerParAnneeParams {
    idAgence: number;
    chapitre: number;
    annee: number;
  }

  /**
   * Parameters for supprimerPaiementAppel
   */
  export interface SupprimerPaiementAppelParams {
    idPeriode: number;
    idBail: number;
  }

  /**
   * Parameters for bailByLocataireEtBien
   */
  export interface BailByLocataireEtBienParams {
    locataire: number;
    bien: number;
  }

  /**
   * Parameters for findAllBien
   */
  export interface FindAllBienParams {
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for findAllBienOqp
   */
  export interface FindAllBienOqpParams {
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for rattacherUnBienAUnChapitre
   */
  export interface RattacherUnBienAUnChapitreParams {
    idBien: number;
    chapitre: number;
  }

  /**
   * Parameters for countInitClotureByCaissiaireAndChampitre
   */
  export interface CountInitClotureByCaissiaireAndChampitreParams {
    idCaisse: number;
    chapitre: string;
  }

  /**
   * Parameters for findAllByCaissierAndChapitre
   */
  export interface FindAllByCaissierAndChapitreParams {
    idCaisse: number;
    chapitre: string;
  }

  /**
   * Parameters for findAllCloturerCaisseByDateAndChapitre
   */
  export interface FindAllCloturerCaisseByDateAndChapitreParams {
    idCaisse: number;
    dateDuJoure: number;
    chapitre: string;
  }

  /**
   * Parameters for findNonCloturerByDateAndCaisseAndChapitre
   */
  export interface FindNonCloturerByDateAndCaisseAndChapitreParams {
    idCaisse: number;
    dateDuJoure: number;
    chapitre: string;
  }

  /**
   * Parameters for getTotalEncaissementparPeriode
   */
  export interface GetTotalEncaissementparPeriodeParams {
    idAgence: number;
    datefin: string;
    datedebut: string;
  }

  /**
   * Parameters for getTotalEncaissementsEtMontantsDeLoyerParMois
   */
  export interface GetTotalEncaissementsEtMontantsDeLoyerParMoisParams {
    idAgence: number;
    datefin: string;
    datedebut: string;
  }

  /**
   * Parameters for getTotalEncaissementsParMois
   */
  export interface GetTotalEncaissementsParMoisParams {
    idAgence: number;
    datefin: string;
    datedebut: string;
  }

  /**
   * Parameters for listeEncaisseLoyerEntreDeuxDate
   */
  export interface ListeEncaisseLoyerEntreDeuxDateParams {
    idAgence: number;
    datefin: string;
    datedebut: string;
  }

  /**
   * Parameters for listeEncaissementEntreDeuxDateParChapitreEtCaisse
   */
  export interface ListeEncaissementEntreDeuxDateParChapitreEtCaisseParams {
    idEncaiss: number;
    idChapitre: number;
    fin: string;
    debut: string;
  }

  /**
   * Parameters for listeLocataireImpayerParAgenceEtPeriode
   */
  export interface ListeLocataireImpayerParAgenceEtPeriodeParams {
    periode: string;
    agence: number;
  }

  /**
   * Parameters for sommeEncaissementParAgenceEtParPeriode
   */
  export interface SommeEncaissementParAgenceEtParPeriodeParams {
    idAgence: number;
    datefin: string;
    datedebut: string;
  }

  /**
   * Parameters for sommeLoyerParAgenceEtParPeriode
   */
  export interface SommeLoyerParAgenceEtParPeriodeParams {
    idAgence: number;
    datefin: string;
    datedebut: string;
  }

  /**
   * Parameters for totalEncaissementParJour
   */
  export interface TotalEncaissementParJourParams {
    jour: string;
    idAgence: number;
    chapitre: number;
  }

  /**
   * Parameters for sendMailGrouperWithAttachment
   */
  export interface SendMailGrouperWithAttachmentParams {
    periode: string;
    idAgence: number;
  }

  /**
   * Parameters for uploadImage
   */
  export interface UploadImageParams {
    name: string;
    id: number;
    file: any;
  }

  /**
   * Parameters for quittancePeriode
   */
  export interface QuittancePeriodeParams {
    proprio: string;
    periode: string;
    idAgence: number;
  }

  /**
   * Parameters for recuReservationParIdReservation
   */
  export interface RecuReservationParIdReservationParams {
    proprio: string;
    idReservation: number;
    idAgence: number;
  }

  /**
   * Parameters for recuReservation
   */
  export interface RecuReservationParams {
    proprio: string;
    idEncaissement: number;
    idAgence: number;
  }

  /**
   * Parameters for countSuiviNonCloturerParCaisseEtChapitreAvantDate
   */
  export interface CountSuiviNonCloturerParCaisseEtChapitreAvantDateParams {
    idChapitre: number;
    idCaiss: number;
    datePriseEnCompteEncaii: string;
  }

  /**
   * Parameters for listSortieDeuxDate
   */
  export interface ListSortieDeuxDateParams {
    idAgence: number;
    fin: string;
    debut: string;
  }

  /**
   * Parameters for listSuiviDepenseNonCloturerParCaisseEtChapitrAvantDate
   */
  export interface ListSuiviDepenseNonCloturerParCaisseEtChapitrAvantDateParams {
    idcaisse: number;
    idChapitre: number;
    dateDepriseEnCompte: string;
  }

  /**
   * Parameters for listSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDate
   */
  export interface ListSuiviDepenseNonCloturerParCaisseEtChapitreEntreDeuxDateParams {
    idcaisse: number;
    idChapitre: number;
    dateFin: string;
    dateDebut: string;
  }

  /**
   * Parameters for suprimerSuiviParId
   */
  export interface SuprimerSuiviParIdParams {
    idAgence: number;
    id: number;
  }

  /**
   * Parameters for totalSortieDeuxDate
   */
  export interface TotalSortieDeuxDateParams {
    idAgence: number;
    fin: string;
    debut: string;
  }
}

export { ApiService }
