import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfiguration } from 'src/gs-api/src/api-configuration';

export interface InvoiceItemDto {
  id: string;
  quantity: number;
  reference?: string;
  description?: string;
  amount?: number;
  discount?: number;
  measurementUnit?: string;
  invoiceId?: string;
}

export interface InvoiceFneCertifyDetailDto {
  invoiceType?: string;
  id: string;
  numeroFactureInterne?: string;
  utilisateurCreateur?: string;
  reference?: string;
  date?: string;
  totalTTC?: number;
  totalHorsTaxes?: number;
  totalTaxes?: number;
  balanceFunds?: number;
  token?: string;
  discount?: number;
  items?: InvoiceItemDto[];
}

export interface RefundItemPayload {
  id: string;
  quantity: number;
}

export interface RefundInvoicePayload {
  invoiceId: string;
  items: RefundItemPayload[];
}

export interface InvoiceRefundResult {
  id?: number;
  reference?: string;
  ncc?: string;
  token?: string;
  warning?: boolean;
  balanceSticker?: number;
  invoiceId?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceRefundService {
  constructor(private http: HttpClient, private apiConfig: ApiConfiguration) {}

  private url(path: string): string {
    const root = this.apiConfig.rootUrl.endsWith('/')
      ? this.apiConfig.rootUrl
      : `${this.apiConfig.rootUrl}/`;
    return `${root}api/v1/new-invoices/${path}`;
  }

  getInvoiceByNumeroFacture(numeroFacture: string): Observable<InvoiceFneCertifyDetailDto[]> {
    const params = new HttpParams().set('numeroFacture', numeroFacture);
    return this.http.get<InvoiceFneCertifyDetailDto[]>(this.url('by-numero'), { params });
  }

  refundInvoice(payload: RefundInvoicePayload): Observable<InvoiceRefundResult> {
    return this.http.post<InvoiceRefundResult>(this.url('refund-invoice'), payload);
  }

  getRefundsByInvoice(invoiceId: string): Observable<InvoiceRefundResult[]> {
    return this.http.get<InvoiceRefundResult[]>(this.url(`invoice/${encodeURIComponent(invoiceId)}`));
  }

  getAllRefunds(): Observable<InvoiceRefundResult[]> {
    return this.http.get<InvoiceRefundResult[]>(this.url('list-facture-avoir'));
  }

  getAllCertifiedInvoices(): Observable<InvoiceFneCertifyDetailDto[]> {
    return this.http.get<InvoiceFneCertifyDetailDto[]>(this.url('all-certified-invoices'));
  }
}
