import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmrScheduleEditResolver implements Resolve<any> {
  constructor(
    private _amrService: AMRScheduleService,
    private actRoute: ActivatedRoute
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let id = route.params['id'];
    return forkJoin([
      this._amrService.getScadaRequestHeaderDetail(id),
    ]);
  }
}
