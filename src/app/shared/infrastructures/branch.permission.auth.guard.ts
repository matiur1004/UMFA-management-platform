import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService, PermissionService} from '@services';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class BranchAuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private permissionService: PermissionService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissionService.getBranchPermissions().pipe(map(permission => {
      let canActivate: boolean = false;
      let roles = route.data["roles"] as Array<string>;

      roles.forEach(r => {
        if (permission[r])
          canActivate = true;
      });

      return canActivate;
    }));
  }
}
