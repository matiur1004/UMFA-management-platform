import {Injectable} from "@angular/core";
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "@services";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(): boolean {
    if (this.authService.isAuthorized()) {
      if (this.authService.isBranchUser()) {
        return true;
      } else {
        if (this.authService.isSuperAdmin()) {
          this.router.navigate(['/admin']);
          return;
        }
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
