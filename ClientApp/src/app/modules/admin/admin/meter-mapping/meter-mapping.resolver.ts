import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { BuildingService, UserService } from '@shared/services';
import { merge, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeterMappingResolver implements Resolve<boolean> {
  constructor(
    private _service: BuildingService,
    private _usrService: UserService
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return merge(
      this._service.getBuildingsForUser(this._usrService.userValue.UmfaId)
    );
  }
}
