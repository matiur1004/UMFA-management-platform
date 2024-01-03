import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { RoleType } from '@core/models';
import { UserService } from '@shared/services';


@Injectable()
export class ClientAdministratorAuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(): boolean {
    let roleId = this.userService.userValue ?  this.userService.userValue.RoleId : JSON.parse(localStorage.getItem('user')).RoleId;
    if(roleId <= RoleType.ClientAdministrator ) {
        return true;
    }
    this.router.navigate(['/project']);
    return false;
  }
}
