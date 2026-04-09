import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit/audit.service';

// URLs à ne pas tracer
const EXCLUDED_URLS = [
  'openai.com',
  'actuator',
  'api/v1/images',
];

// Méthodes à tracer + login (POST)
const TRACED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

@Injectable()
export class AuditInterceptor implements HttpInterceptor {

  constructor(private auditService: AuditService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const method = req.method.toUpperCase();
    const url = req.url;

    const shouldTrace =
      TRACED_METHODS.includes(method) &&
      (url.includes('gestimoweb/api/v1') || url.includes('/auth/login')) &&
      !EXCLUDED_URLS.some((ex) => url.includes(ex));

    if (!shouldTrace) {
      return next.handle(req);
    }

    const startTime = Date.now();
    const { action, module } = this.auditService.getActionLabel(method, url);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.auditService.addEntry({
              method,
              url,
              action,
              module,
              status: event.status,
              success: event.status >= 200 && event.status < 300,
              durationMs: Date.now() - startTime,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.auditService.addEntry({
            method,
            url,
            action: `${action} — ERREUR`,
            module,
            status: err.status ?? 0,
            success: false,
            durationMs: Date.now() - startTime,
          });
        },
      })
    );
  }
}
