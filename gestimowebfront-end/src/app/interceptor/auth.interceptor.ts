import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/gs-api/src/services';
import { UserService } from '../services/user/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    httpHandler: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      httpRequest.url.includes(
        `${this.apiService.rootUrl}gestimoweb/api/v1/auth/login`
      )
    ) {
      return httpHandler.handle(httpRequest);
    }
    if (
      httpRequest.url.includes(
        `https://api.openai.com/v1/chat/completions`
      )
    ) {
      return httpHandler.handle(httpRequest);
    }

    this.userService.loadToken();
    const token = this.userService.getToken();
    if (!token) {
      return httpHandler.handle(httpRequest);
    }
    const requestClone = httpRequest.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return httpHandler.handle(requestClone);
  }
}
