import { Injectable } from '@angular/core';
import { ApiService } from 'src/gs-api/src/services';
import {
  AuthRequestDto,
  EtablissementUtilisateurDto,
  LocataireEncaisDTO,
  UtilisateurAfficheDto,
  UtilisateurRequestDto,
} from 'src/gs-api/src/models';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface EstablishmentOption {
  id?: number;
  idAgence?: number;
  idCreateur?: number;
  idChapitre?: number;
  libChapitre?: string;
  utilisateurIds?: Array<number>;
}

export interface DepartmentOption {
  id?: number;
  libelle?: string;
}

export interface ImportRowError {
  row: number;
  message: string;
}

export interface ImportResult {
  total: number;
  success: number;
  errors: number;
  rowErrors: ImportRowError[];
}

export interface UserEstablishmentAssignmentPayload {
  userId: number;
  establishmentId: number;
  defaultEtablissement: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token?: string | null;
  private loggedInUsername?: string | null;
  private loggedInAgence?: string | null;
  private jwtHelper = new JwtHelperService();
  private selectedFile: any = null;
  private defaultChapitre: any = null;
  constructor(private apiService: ApiService, private http: HttpClient) {}

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }


  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string | null | undefined {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token == null || this.token === '') {
      this.logOut();
      return false;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      const subject = decodedToken?.sub;
      if (!subject || this.jwtHelper.isTokenExpired(this.token)) {
        this.logOut();
        return false;
      }
      if (!this.hasUserInLocalCache()) {
        this.logOut();
        return false;
      }
      this.loggedInUsername = subject;
      return true;
    } catch (error) {
      this.logOut();
      return false;
    }
  }

  private hasUserInLocalCache(): boolean {
    const userRaw = localStorage.getItem('user');
    if (!userRaw || userRaw === 'null' || userRaw === 'undefined') {
      return false;
    }
    try {
      const user = JSON.parse(userRaw);
      return !!user;
    } catch (error) {
      return false;
    }
  }

  public login(authRequestDto: AuthRequestDto): Observable<any> {
    return this.http.post<UtilisateurRequestDto>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/auth/login`,
      authRequestDto,
      { observe: 'response' }
    );
  }

  public requestPasswordReset(identifier: string): Observable<string> {
    return this.http.post(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/password-reset/request`,
      { identifier },
      { responseType: 'text' }
    );
  }

  public confirmPasswordReset(payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<string> {
    return this.http.post(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/password-reset/confirm`,
      payload,
      { responseType: 'text' }
    );
  }

  public getDefaultEtablissement(
    idUtilisateur: number
  ): Observable<EtablissementUtilisateurDto> {
    return this.http.get<EtablissementUtilisateurDto>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/etablissement/getDefaultEtable/${idUtilisateur}`
    );
  }

  public getAllEstablishments(): Observable<EstablishmentOption[]> {
    return this.http.get<EstablishmentOption[]>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/establishments`
    );
  }

  public getDepartmentsByEstablishment(
    idEtablissement: number
  ): Observable<DepartmentOption[]> {
    return this.http.get<DepartmentOption[]>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/establishments/${idEtablissement}/departments`
    );
  }

  public assignUserToEstablishment(
    payload: UserEstablishmentAssignmentPayload
  ): Observable<EtablissementUtilisateurDto> {
    return this.http.post<EtablissementUtilisateurDto>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/affecter-etablissement`,
      payload
    );
  }

  public getDefaultChapitre(id: any): Observable<any> {
  return  this.http.get<any>(
      this.apiService.rootUrl +
        'gestimoweb/api/v1/etablissement/getDefaultEtable/' +
        id,
      { observe: 'response' }
    );

  }
  deleteAgenceBy(id: number) {
    return this.apiService.deleteAgenceByIdAgence(id);
  }

  public getUsers(idAgence: number): Observable<any | HttpErrorResponse> {
    return this.getUsersByAgence(idAgence);
  }

  public getUsersByAgence(
    idAgence: number
  ): Observable<UtilisateurAfficheDto[]> {
    return this.http.get<UtilisateurAfficheDto[]>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/all/${idAgence}`
    );
  }

  public getLocatairesCompteClient(
    idAgence: number
  ): Observable<LocataireEncaisDTO[]> {
    return this.http.get<LocataireEncaisDTO[]>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/locataires/compte-client/${idAgence}`
    );
  }

  public saveUser(
    formData: UtilisateurRequestDto
  ): Observable<UtilisateurAfficheDto> {
    return this.http.post<UtilisateurAfficheDto>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/save`,
      formData
    );
  }

  public addUser(formData: UtilisateurRequestDto): Observable<any> {
    return this.saveUser(formData);
  }

  public deactivateUser(idUtilisateur: number): Observable<UtilisateurAfficheDto> {
    return this.http.put<UtilisateurAfficheDto>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/desactiver/${idUtilisateur}`,
      {}
    );
  }

  public deleteUser(idUtilisateur: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/${idUtilisateur}`
    );
  }

  public addUsersToLocalCache(users: UtilisateurRequestDto[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public addUserToLocalCache(user: UtilisateurRequestDto): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): UtilisateurRequestDto {
    return JSON.parse(localStorage.getItem('user')!);
  }
  public getUsersFromLocalCache(): UtilisateurRequestDto[] {
    return JSON.parse(localStorage.getItem('users')!);
  }
  public importUsersFromExcel(
    file: File,
    idAgence: number,
    idCreateur: number
  ): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idAgence', idAgence.toString());
    formData.append('idCreateur', idCreateur.toString());
    return this.http.post<ImportResult>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/utilisateur/import/excel`,
      formData
    );
  }

  public createUserFormDate(
    loggedId: string,
    user: UtilisateurRequestDto
  ): FormData {
    const formData = new FormData();
    formData.append('id', loggedId);
    formData.append('firstName', user.nom!);
    formData.append('lastName', user.prenom!);
    formData.append('username', user.username!);
    formData.append('email', user.email!);
    formData.append('role', user.roleUsed!);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.nonLocked));
    return formData;
  }
}
