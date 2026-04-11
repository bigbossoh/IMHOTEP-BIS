import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { ApiConfiguration } from '../../../gs-api/src/api-configuration';

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: number | null;
  userName: string;
  method: string;
  url: string;
  action: string;
  module: string;
  status: number;
  success: boolean;
  durationMs: number;
}

export type AuditEntryCreate = Omit<
  AuditEntry,
  'id' | 'timestamp' | 'userId' | 'userName'
>;

@Injectable({ providedIn: 'root' })
export class AuditService {

  // HttpClient instancié depuis HttpBackend pour bypasser tous les intercepteurs
  // (évite la boucle infinie : AuditInterceptor → AuditService → AuditInterceptor)
  private http: HttpClient;

  constructor(
    handler: HttpBackend,
    private userService: UserService,
    private apiConfig: ApiConfiguration
  ) {
    this.http = new HttpClient(handler);
  }

  // ─── Ajout d'une entrée ───────────────────────────────────────────────────

  private getApiRoot(): string {
    const rootUrl = this.apiConfig.rootUrl ?? '';
    const normalizedRootUrl = rootUrl.endsWith('/') ? rootUrl : `${rootUrl}/`;
    return `${normalizedRootUrl}gestimoweb/api/v1/audit`;
  }

  addEntry(entry: AuditEntryCreate): void {
    const user = this.userService.getUserFromLocalCache();
    const payload = {
      ...entry,
      idAgence: user?.idAgence ?? null,
      timestamp: new Date().toISOString(),
      userId: user?.id ?? null,
      userName: user
        ? `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || user.username || 'Inconnu'
        : 'Inconnu',
    };
    this.http
      .post(this.getApiRoot(), payload, { headers: this.getHeaders() })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  // ─── Lecture ──────────────────────────────────────────────────────────────

  getAll(): Observable<AuditEntry[]> {
    const user = this.userService.getUserFromLocalCache();
    const idAgence = user?.idAgence ?? 0;
    return this.http
      .get<AuditEntry[]>(`${this.getApiRoot()}/agence/${idAgence}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(() => of([])));
  }

  // ─── Effacement ───────────────────────────────────────────────────────────

  clearAll(): Observable<void> {
    const user = this.userService.getUserFromLocalCache();
    const idAgence = user?.idAgence ?? 0;
    return this.http
      .delete<void>(`${this.getApiRoot()}/agence/${idAgence}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(() => of(undefined)));
  }

  // ─── Mapping URL → action lisible ─────────────────────────────────────────

  getActionLabel(method: string, url: string): { action: string; module: string } {
    const u = url.toLowerCase();
    const m = method.toUpperCase();

    if (u.includes('/auth/login'))                                  return { action: 'Connexion', module: 'Authentification' };

    if (u.includes('/encaissement/saveencaissementgroupe'))         return { action: 'Règlement groupé enregistré', module: 'Règlement' };
    if (u.includes('/encaissement/saveencaissement'))               return { action: 'Encaissement enregistré', module: 'Règlement' };
    if (u.includes('/encaissement/'))                               return { action: 'Opération de règlement', module: 'Règlement' };

    if (u.includes('/appelloyer/saveappelannuler'))                 return { action: 'Appel de loyer annulé', module: 'Appels de loyer' };
    if (u.includes('/appelloyer/saveappelloyer'))                   return { action: 'Appel de loyer créé', module: 'Appels de loyer' };
    if (u.includes('/appelloyer/'))                                 return { action: 'Opération sur appel de loyer', module: 'Appels de loyer' };

    if (u.includes('/bail/') && m === 'POST')                       return { action: 'Bail créé', module: 'Baux' };
    if (u.includes('/bail/') && m === 'PUT')                        return { action: 'Bail modifié', module: 'Baux' };
    if (u.includes('/bail/') && m === 'DELETE')                     return { action: 'Bail supprimé', module: 'Baux' };
    if (u.includes('/bail/'))                                       return { action: 'Opération sur bail', module: 'Baux' };

    if (u.includes('/auth/signup'))                                 return { action: 'Utilisateur créé', module: 'Utilisateurs' };
    if (u.includes('/utilisateurs/') && m === 'PUT')                return { action: 'Utilisateur modifié', module: 'Utilisateurs' };
    if (u.includes('/utilisateurs/') && m === 'DELETE')             return { action: 'Utilisateur supprimé', module: 'Utilisateurs' };
    if (u.includes('/utilisateurs/'))                               return { action: 'Opération utilisateur', module: 'Utilisateurs' };

    if (u.includes('/agences/signup'))                              return { action: 'Agence créée', module: 'Agence' };
    if (u.includes('/agences/') && m === 'DELETE')                  return { action: 'Agence supprimée', module: 'Agence' };
    if (u.includes('/agences/'))                                    return { action: 'Opération agence', module: 'Agence' };

    if (u.includes('/sites/') && m === 'POST')                      return { action: 'Site créé', module: 'Sites' };
    if (u.includes('/sites/') && m === 'DELETE')                    return { action: 'Site supprimé', module: 'Sites' };
    if (u.includes('/sites/'))                                      return { action: 'Opération site', module: 'Sites' };

    if (u.includes('/immeuble/') && m === 'POST')                   return { action: 'Immeuble créé', module: 'Immeubles' };
    if (u.includes('/immeuble/') && m === 'DELETE')                 return { action: 'Immeuble supprimé', module: 'Immeubles' };
    if (u.includes('/immeuble/'))                                   return { action: 'Opération immeuble', module: 'Immeubles' };

    if (u.includes('/bienimmobilier/') && m === 'POST')             return { action: 'Bien immobilier créé', module: 'Biens' };
    if (u.includes('/bienimmobilier/') && m === 'DELETE')           return { action: 'Bien immobilier supprimé', module: 'Biens' };
    if (u.includes('/bienimmobilier/'))                             return { action: 'Opération bien immobilier', module: 'Biens' };

    if (u.includes('/reservation/') && m === 'POST')                return { action: 'Réservation créée', module: 'Résidence' };
    if (u.includes('/reservation/') && m === 'DELETE')              return { action: 'Réservation supprimée', module: 'Résidence' };
    if (u.includes('/reservation/'))                                return { action: 'Opération réservation', module: 'Résidence' };

    if (u.includes('/categoriechambre/') && m === 'POST')           return { action: 'Catégorie créée', module: 'Catégories' };
    if (u.includes('/categoriechambre/'))                           return { action: 'Opération catégorie', module: 'Catégories' };

    if (u.includes('/cloturecaisse/'))                              return { action: 'Clôture de caisse', module: 'Comptabilité' };
    if (u.includes('/depense/') && m === 'POST')                    return { action: 'Dépense enregistrée', module: 'Comptabilité' };

    if (m === 'POST')    return { action: 'Création', module: 'Général' };
    if (m === 'PUT')     return { action: 'Modification', module: 'Général' };
    if (m === 'DELETE')  return { action: 'Suppression', module: 'Général' };
    if (m === 'PATCH')   return { action: 'Mise à jour partielle', module: 'Général' };

    return { action: 'Opération', module: 'Général' };
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────────

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
