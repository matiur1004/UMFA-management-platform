import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as fromStore from '../store';

@Injectable()
export class AllocatedSuppliersGuard implements CanDeactivate<Observable<boolean> | Promise<boolean> | boolean> {
  constructor(
    private readonly store: Store<fromStore.State>,
  ) {
  }

  canDeactivate(component: Observable<boolean> | Promise<boolean> | boolean) {
    this.store.dispatch(new fromStore.PurgeAllocatedSuppliersStore());
    return true;
  }
}
