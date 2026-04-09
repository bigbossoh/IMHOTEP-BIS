import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NotificationType } from 'src/app/enum/natification-type.enum';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGuardService implements CanActivate {

  constructor(private userService:UserService,
    private router:Router,
    private notificationService:NotificationService){}
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean | UrlTree  {
      return this.isUserLoggedIn();
  }
  private isUserLoggedIn(): boolean | UrlTree {
    if(this.userService.isUserLoggedIn()){
      return true;
    }
    this.notificationService.notify(NotificationType.ERROR,"You need to login to access this page");
    return this.router.createUrlTree(['/login']);
  }
}

