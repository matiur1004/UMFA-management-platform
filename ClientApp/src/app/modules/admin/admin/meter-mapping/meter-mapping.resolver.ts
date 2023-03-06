import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { BuildingService, UserService } from '@shared/services';
import { merge, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeterMappingResolver implements Resolve<boolean> {
  constructor(
    private _service: BuildingService,
    private _usrService: UserService,
    private _authService: AuthService
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return merge(
      this._usrService.getUser(this._authService.userValue.Id),
      this._service.getBuildingsForUser(this._usrService.userValue.UmfaId)
    );
  }
}
