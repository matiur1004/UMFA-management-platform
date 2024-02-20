import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  VirtualRegisterDetail,
  VirtualRegisterListItem
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {VirtualRegistersService} from '@app/branch/buildings/manage-building/building-equipment/shared/virtual-registers.service';
import * as commonData from '@app/branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import * as state from '@app/branch/buildings/manage-building/shared/store/state/common-data.state';
import {ApplyResultService} from '@app/popups/apply-result-popup/apply-result.service';
import {convertAnyToParams} from '@app/shared/helper/http-helper';
import {versionDayKey} from '@app/shared/helper/version-date-key';
import {BranchModel, HistoryViewModel, PagingViewModel, VersionResultViewModel} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {BranchManagerService} from '@services';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as virtualRegistersActions from '../actions/virtual-registers.action';

@Injectable()
export class VirtualRegistersEffect {
  // Get virtual registers by calling API OR by searching
  getVirtualRegisters: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.REQUEST_VIRTUAL_REGISTERS, virtualRegistersActions.SEARCH_VIRTUAL_REGISTERS),
    withLatestFrom(
      this.store$.pipe(select(fromEquipment.getEquipmentState)),
      this.store$.pipe(select((commonData.getBuildingId))),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: virtualRegistersActions.RequestVirtualRegisters, equipmentState, buildingId, versionId) => {
        action.payload.requestParameters.versionId = versionId;
        return {
          payload: action.payload,
          buildingId: buildingId
        };
      }),
    switchMap(({payload, buildingId}) => {
      const objToParams = convertAnyToParams(payload);
      return this.virtualRegisterService.getVirtualRegisters(buildingId, objToParams).pipe(
        map((response: PagingViewModel<VirtualRegisterListItem>) => {

          return new virtualRegistersActions.RequestVirtualRegistersComplete({
            items: response.items,
            total: response.total
          });
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  getVirtualRegisterDetail: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.GET_VIRTUAL_REGISTER_DETAIL),
    withLatestFrom(
      this.store$.pipe(select((commonData.getBuildingId))),
      (action: virtualRegistersActions.GetVirtualRegisterDetail, buildingId) => {
        return {
          payload: action.payload,
          buildingId
        };
      }),

    switchMap(({payload, buildingId}) => {

      return this.virtualRegisterService.getVirtualRegisterDetail(buildingId, payload).pipe(
        map((virtualRegister: VirtualRegisterDetail) => new virtualRegistersActions.SetVirtualRegisterDetailSuccess(virtualRegister)),
        catchError(r => of({type: 'DUMMY'}))
      );
    })
  ));
  navigateToVirtualRegisterDetail: Observable<boolean> = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.NAVIGATE_TO_VIRTUAL_REGISTER_DETAIL),
    withLatestFrom(
      this.branchManagerService.getBranchObservable(),
      this.store$.pipe(select((commonData.getBuildingId))),
      this.store$.pipe(select(commonData.getSelectedHistoryLog)),
      (a: virtualRegistersActions.NavigateToVirtualRegisterDetail, branch: BranchModel, buildingId: string, version: HistoryViewModel) => {
        return {
          payload: a.payload,
          branchId: branch.id,
          buildingId,
          version
        };
      }),
    switchMap(({payload, branchId, buildingId, version}) => {
      return this.router.navigate(['/branch', branchId, 'buildings', buildingId, 'version',
        version.versionDay, 'equipment', 'virtual-registers', payload]);
    })
  ), {dispatch: false})
  createVirtualRegister = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.CREATE_VIRTUAL_REGISTER),
    withLatestFrom(
      this.store$.pipe(select((commonData.getBuildingId))),
      (action: virtualRegistersActions.CreateVirtualRegister, buildingId) => {
        action.payload.entity.buildingId = buildingId;
        return {
          payload: action.payload
        };
      }),
    switchMap(({payload}) => {
      return this.virtualRegisterService.createVirtualRegister(payload)
        .pipe(map(result => ({status: true, payload: result})),
          catchError(err => of({status: false, payload: null})));
    }),
    switchMap((result: { status: boolean, payload: VersionResultViewModel }) => {
      if (result.status) {
        this.versionUpdateService.showVersionUpdateResults(result.payload.next);
        return this.redirectToUpdatedList(result.payload);
      }
      return of({type: 'DUMMY'});
    })));
  updateVirtualRegister = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.UPDATE_VIRTUAL_REGISTER),
    withLatestFrom(
      this.store$.pipe(select((commonData.getBuildingId))),
      (action: virtualRegistersActions.UpdateVirtualRegister, buildingId) => {
        action.payload.entity.buildingId = buildingId;
        return {
          payload: action.payload
        };
      }),
    switchMap(({payload}) => {
      return this.virtualRegisterService.updateVirtualRegister(payload)
        .pipe(map(result => ({status: true, payload: result})),
          catchError(err => of({status: false, payload: null})));
    }),
    switchMap((result: { status: boolean, payload: VersionResultViewModel }) => {
      if (result.status) {
        this.versionUpdateService.showVersionUpdateResults(result.payload.next);
        return this.redirectToUpdatedList(result.payload);
      }
      return of({type: 'DUMMY'});
    })));
  closeUpdateVirtualRegister = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.CLOSE_UPDATE_VIRTUAL_REGISTER),
    withLatestFrom(
      this.branchManagerService.getBranchObservable(),
      this.store$.pipe(select((commonData.getBuildingId))),
      this.store$.pipe(select((commonData.getSelectedHistoryLog))),
      (_,
       branch: BranchModel,
       buildingId: string,
       version: HistoryViewModel) => {
        return {
          branchId: branch.id,
          buildingId,
          version
        };
      }),
    tap(({branchId, buildingId, version}) => {
      this.router.navigate(['/branch', branchId, 'buildings', buildingId, 'version',
        version.versionDay, 'equipment', 'virtual-registers']);
    })
  ), {dispatch: false})
  deleteVirtualRegisters: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(virtualRegistersActions.DELETE_VIRTUAL_REGISTER),
    withLatestFrom(
      this.store$.pipe(select((commonData.getBuildingId))),
      this.store$.pipe(select((commonData.getSelectedHistoryLog))),
      (action: virtualRegistersActions.DeleteVirtualRegister, buildingId, version: HistoryViewModel) => {
        return {
          payload: action.payload,
          version,
          buildingId: buildingId
        };
      }),
    switchMap(({payload, buildingId, version}) => {

      const paramsToHttpParams = convertAnyToParams(payload);

      return this.virtualRegisterService.removeVirtualRegister(buildingId, paramsToHttpParams).pipe(
        switchMap((result: VersionResultViewModel) => {
          return [
            new commonDataActions.UpdateUrlVersionAction(result.current.versionDate),
            new commonDataActions.GetHistoryWithVersionId(result.current.id),
            new virtualRegistersActions.RequestVirtualRegisters()
          ];
        }),
        catchError(r => of({type: 'DUMMY'}))
      );
    })
  ));

  constructor(private virtualRegisterService: VirtualRegistersService,
              private store$: Store<state.State>,
              private readonly branchManagerService: BranchManagerService,
              private versionUpdateService: ApplyResultService,
              private router: Router,
              private actions$: Actions) {
  }

  redirectToUpdatedList(version: VersionResultViewModel) {
    const url = this.router.url
      .replace(/version\/([0-9]{8}|null)\//, 'version/' + versionDayKey(version.current.versionDate) + '/')
      .substring(0, this.router.url.lastIndexOf('/'));
    return [
      new commonDataActions.SetNavigationUrl(url),
      new commonDataActions.GetHistoryWithVersionId(version.current.id)
    ];
  }
}
