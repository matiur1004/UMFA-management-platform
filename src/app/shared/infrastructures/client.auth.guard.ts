import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '@services';


@Injectable()
export class ClientAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(): boolean {
    if (this.authService.isAuthorized()) {
      if (this.authService.isClientUser()) {
        return true;
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
