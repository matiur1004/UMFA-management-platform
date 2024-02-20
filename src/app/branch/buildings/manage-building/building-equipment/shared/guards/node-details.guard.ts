import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, race} from 'rxjs';
import {catchError, filter, mapTo, take, tap} from 'rxjs/operators';

import * as fromStore from '../store/reducers';
import * as actions from '../store/actions/node.actions';
import {Actions, ofType} from '@ngrx/effects';

@Injectable()
export class NodeDetailsGuard implements CanActivate {
  constructor(
    private readonly store$: Store<fromStore.State>,
    private actions$: Actions,
    private router: Router
  ) {
  }

  getDataFromApiOrStore(nodeId): Observable<any> {
    return this.store$.pipe(
      select(fromStore.getNodeDetail),
      filter((node: any) => node && node.id === nodeId));
  }

  getErrorAction() {
    return this.actions$.pipe(
      ofType(actions.GET_NODE_DETAILS_FAILED)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const nodeId = next.params['nodeId'];
    this.store$.dispatch(new actions.GetNodeDetails({nodeId}));
    return race(
      this.getDataFromApiOrStore(nodeId).pipe(mapTo(true)),
      this.getErrorAction().pipe(
        tap(() => {
          this.router.navigate(['/page404'], {replaceUrl: true});
        }),
        mapTo(false)))
      .pipe(
        catchError(() => of(false)),
        take(1));
  }
}
