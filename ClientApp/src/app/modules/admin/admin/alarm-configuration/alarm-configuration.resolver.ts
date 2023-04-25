import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { BuildingService, UserService } from '@shared/services';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmConfigurationResolver implements Resolve<boolean> {
  constructor(
    private _buildingService: BuildingService,
    private _userService: UserService,
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._buildingService.getBuildingsForUser(this._userService.userValue.UmfaId),
      this._buildingService.getPartnersForUser(this._userService.userValue.UmfaId)
    ]);
  }
}
