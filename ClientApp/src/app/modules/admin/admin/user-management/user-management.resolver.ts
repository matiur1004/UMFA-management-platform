import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from '@shared/services';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementResolver implements Resolve<any> {
  constructor(
    private _userService: UserService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._userService.getRoles(),
      this._userService.getAllUsers(),
      this._userService.getNotificationTypes()
    ]);
  }
}
