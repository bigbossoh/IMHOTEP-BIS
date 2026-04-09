import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services';
import {
  ExpenseActionPayload,
  ExpenseFormPayload,
  ExpenseRecord,
  ExpenseSupplierSuggestion,
  ExpenseWorkflowConfig,
} from './depense.models';

@Injectable({
  providedIn: 'root',
})
export class DepenseService {
  constructor(private readonly http: HttpClient, private readonly apiService: ApiService) {}

  public getExpenses(idAgence: number): Observable<ExpenseRecord[]> {
    return this.http.get<ExpenseRecord[]>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/expenses/${idAgence}`
    );
  }

  public getWorkflowConfig(idAgence: number): Observable<ExpenseWorkflowConfig> {
    return this.http.get<ExpenseWorkflowConfig>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/config/${idAgence}`
    );
  }

  public saveWorkflowConfig(payload: ExpenseWorkflowConfig): Observable<ExpenseWorkflowConfig> {
    return this.http.put<ExpenseWorkflowConfig>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/config`,
      payload
    );
  }

  public listSupplierSuggestions(idAgence: number): Observable<ExpenseSupplierSuggestion[]> {
    return this.http.get<ExpenseSupplierSuggestion[]>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/suppliers/${idAgence}`
    );
  }

  public saveExpense(payload: ExpenseFormPayload, justificatif?: File | null): Observable<ExpenseRecord> {
    const formData = new FormData();
    formData.append(
      'payload',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );
    if (justificatif) {
      formData.append('justificatif', justificatif, justificatif.name);
    }
    return this.http.post<ExpenseRecord>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/save`,
      formData
    );
  }

  public approveExpense(id: number, payload: ExpenseActionPayload): Observable<ExpenseRecord> {
    return this.http.post<ExpenseRecord>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/${id}/approve`,
      payload
    );
  }

  public rejectExpense(id: number, payload: ExpenseActionPayload): Observable<ExpenseRecord> {
    return this.http.post<ExpenseRecord>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/${id}/reject`,
      payload
    );
  }

  public cancelExpense(id: number, payload: ExpenseActionPayload): Observable<ExpenseRecord> {
    return this.http.post<ExpenseRecord>(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/${id}/cancel`,
      payload
    );
  }

  public downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(
      `${this.apiService.rootUrl}gestimoweb/api/v1/suiviedepense/management/attachment/${id}`,
      { responseType: 'blob' }
    );
  }
}
