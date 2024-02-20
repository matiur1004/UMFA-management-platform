import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import * as fromStore from './shared/store/state/common-data.state';
import * as commonDataActions from './shared/store/actions/common-data.action';

@Injectable({
  providedIn: 'root'
})
export class EnableVersionGuardService {

  constructor(private readonly store$: Store<fromStore.State>) {
  }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store$.dispatch(new commonDataActions.DisableChangingVersion(false));
    return true;
  }
}
