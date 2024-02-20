import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {VirtualRegisterDetail} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import * as virtualRegistersState
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/state/virtual-registers.state';
import * as virtualRegisters
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/selectors/virtual-registers.selectors';
import * as virtualRegistersAction
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/virtual-registers.action';
import * as commonData from '@app/branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import {HistoryViewModel} from '@models';
import {Actions, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {Observable, of, race} from 'rxjs';
import {catchError, filter, mapTo, switchMap, take, tap} from 'rxjs/operators';

@Injectable()
export class VirtualRegistersDetailsGuard implements CanActivate {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store<virtualRegistersState.State>) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const vrId = next.params['id'];
    return this.store$.pipe(select(commonData.getSelectedHistoryLog),
      switchMap((selectedVersion: HistoryViewModel) => {
        this.store$.dispatch(new virtualRegistersAction.GetVirtualRegisterDetail({
          vrId,
          versionId: selectedVersion.id
        }));

        return race(
          this.getDataFromApiOrStore(vrId).pipe(mapTo(true)),
          this.getErrorAction().pipe(
            tap(() => {
              this.router.navigate(['/page404'], {replaceUrl: true});
            }),
            mapTo(false)))
          .pipe(
            catchError(() => of(false)),
            take(1));
      }));
  }

  getErrorAction() {
    return this.actions$.pipe(
      ofType(virtualRegistersAction.GET_VIRTUAL_REGISTER_DETAIL_FAILED)
    );
  }

  getDataFromApiOrStore(vrId: string): Observable<any> {
    return this.store$.pipe(
      select(virtualRegisters.getSelectedVirtualRegister, vrId),
      filter((vr: VirtualRegisterDetail) => !!vr));
  }
}
