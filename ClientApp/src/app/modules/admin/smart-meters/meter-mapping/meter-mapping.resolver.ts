import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { BuildingService, MeterMappingService, UserService } from '@shared/services';
import { forkJoin, merge, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeterMappingResolver implements Resolve<boolean> {
  constructor(
    private _service: BuildingService,
    private _mappingMeterService: MeterMappingService,
    private _usrService: UserService,
    private _authService: AuthService
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._usrService.getUser(this._authService.userValue.Id),
      this._service.getBuildingsForUser(this._usrService.userValue.UmfaId),
      this._mappingMeterService.getAllRegisterTypes(),
      this._mappingMeterService.getAllTimeOfUse(),
      this._mappingMeterService.getAllSupplyTypes(),
    ]);
  }
}
