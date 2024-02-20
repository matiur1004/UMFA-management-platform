import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as actions from '../store/actions/building-tariffs.actions';

@Injectable()
export class BuildingIdGuard implements CanActivate {
  constructor(private readonly store: Store<fromTariff.State>) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const buildingId = next.parent.parent.params['id'];
    if (!buildingId) {
      return of(false);
    }
    return of(true).pipe(tap(() => {
      this.store.dispatch(new actions.UpdateBuildingId({buildingId: buildingId}));
    }));
  }
}
