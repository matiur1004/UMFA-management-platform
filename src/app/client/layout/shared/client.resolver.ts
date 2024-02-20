import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {switchMap, tap, withLatestFrom} from 'rxjs/operators';

import * as commonDataActions from '../shared/store/actions/common-data.actions';
import * as commonDataSelector from '../shared/store/selectors/common-data.selector';

import * as fromCommonData from '../shared/store/reducers';

import {CommonDataService} from './common-data.service';

@Injectable()
export class ClientResolver implements Resolve<any> {

  constructor(private store$: Store<fromCommonData.State>, private commonDataService: CommonDataService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return of(null).pipe(
      withLatestFrom(this.store$.pipe(select(commonDataSelector.getClientId))),
      switchMap(([_, clientId]) => clientId ? of(clientId) : this.commonDataService.getClientId().pipe(
        tap(clientId => this.store$.dispatch(new commonDataActions.ClientIdRequestComplete(clientId)))))
    );
  }
}
