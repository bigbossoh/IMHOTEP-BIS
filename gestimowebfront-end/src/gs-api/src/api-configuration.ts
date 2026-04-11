/* tslint:disable */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ApiConfigurationInterface {
  rootUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl = ApiConfiguration.normalizeRootUrl(environment.serverUrl);

  private static normalizeRootUrl(serverUrl: string | undefined | null): string {
    const baseUrl = (serverUrl ?? '')
      .replace(/\/actuator\/?$/, '')
      .replace(/\/+$/, '');
    return baseUrl ? `${baseUrl}/` : '/';
  }
}
