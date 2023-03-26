import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmrMeterAssignmentsResolver implements Resolve<boolean> {
  constructor(
    private _amrService: AMRScheduleService,
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._amrService.getScheduleStatus(),
      this._amrService.getScadaRequestDetails(),
    ]);
  }
}
