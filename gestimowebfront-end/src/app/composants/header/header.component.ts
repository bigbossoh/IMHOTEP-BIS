import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { GetDefaultEtabNameActions } from 'src/app/ngrx/etablissement/etablisement.action';
import { EtablissementState, EtablissementStateEnum } from 'src/app/ngrx/etablissement/etablissement.reducer';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurRequestDto } from 'src/gs-api/src/models';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public user?: UtilisateurRequestDto;

  etablissementState$: Observable<EtablissementState> | null = null;

  readonly EtablissementStateEnum = EtablissementStateEnum;

  constructor(
    private store: Store<any>,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalCache();
    if (this.user?.id) {
      this.store.dispatch(new GetDefaultEtabNameActions(this.user.id));
    }

    this.etablissementState$ = this.store.pipe(map((state) => state.etablissementState));
  }

  goToProfile(menu?: HTMLDetailsElement): void {
    menu?.removeAttribute('open');
    this.router.navigate(['/profil']);
  }

  goToAide(menu?: HTMLDetailsElement): void {
    menu?.removeAttribute('open');
    this.router.navigate(['/aide']);
  }

  logoutUser(menu?: HTMLDetailsElement): void {
    menu?.removeAttribute('open');
    this.userService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(
      NotificationType.SUCCESS,
      'Vous avez ete deconnecte avec succes.'
    );
  }

  get userInitials(): string {
    const nom = this.user?.nom?.trim().charAt(0) ?? '';
    const prenom = this.user?.prenom?.trim().charAt(0) ?? '';
    return `${nom}${prenom}`.toUpperCase() || 'GU';
  }

  get userRoleLabel(): string {
    return this.user?.roleUsed || 'Profil utilisateur';
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    this.notificationService.notify(notificationType, message || 'Une erreur est survenue.');
  }
}
