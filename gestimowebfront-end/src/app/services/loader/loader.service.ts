import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError
        )
      )
      .subscribe((e) => {
        this.loading$.next(e instanceof NavigationStart);
      });
  }

  get isLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
