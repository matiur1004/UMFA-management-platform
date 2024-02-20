import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {unbox} from 'ngrx-forms';

import {SupplierService} from '../../services';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';

@Injectable()
export class AddNewSupplierBranchEffects {

  getSuppliers$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_SUPPLIERS),
    switchMap((action: fromActions.GetSuppliers) =>
      this.s.getSuppliers(action.payload)
        .pipe(
          map((res) => new fromActions.GetSuppliersSuccess(res)),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetSuppliersFailed(res.error)))
        )
    )
  ));

  addSuppliers$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.ADD_NEW_SUPPLIER_BRANCH),
    switchMap((action: fromActions.AddNewSupplierBranch) => {
      const {branchId, ids} = action.payload;
      const added = unbox(ids).map(id => this.s.addSupplierToBranch(branchId, id));

      return forkJoin(added).pipe(
        map((res) => new fromActions.AddNewSupplierBranchSuccess(res)),
        catchError((res: HttpErrorResponse) =>
          of(new fromActions.AddNewSupplierBranchFailed(res.error)))
      );
    })
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: SupplierService
  ) {
  }
}
