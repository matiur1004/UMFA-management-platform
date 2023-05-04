import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { BuildingService, MeterService, UserService } from '@shared/services';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmrMeterAssignmentsResolver implements Resolve<boolean> {
  constructor(
    private _amrService: AMRScheduleService,
    private _buildingService: BuildingService,
    private _meterService: MeterService,
    private userService: UserService,
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let id = route.params['id'];
    return forkJoin([
      this._amrService.getScheduleStatus(),
      //this._meterService.getMetersForUser(this.userService.userValue.Id),
      this._amrService.getScadaRequestDetails(id),
      this._buildingService.getBuildingsForUser(this.userService.userValue.UmfaId),
    ]);
  }
}
