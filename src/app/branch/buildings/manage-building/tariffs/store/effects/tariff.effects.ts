import {BranchManagerService} from './../../../../../../shared/services/branch-manager.service';
import {Router} from '@angular/router';
import {BuildingTariffsService} from '../../services/building-tariffs.service';
import {Action, select, Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import * as tariffActions from '../actions/tariff.actions';
import * as tariffDetailsActions from '../actions/tariff-details.actions';
import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {MarkAsSubmittedAction, unbox} from 'ngrx-forms';
import {TariffDetailViewModel, TariffValueVersionModel, VersionActionType, VersionViewModel} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewTariffVersionComponent} from '@app/shared/tariffs';
import {fromPromise} from 'rxjs/internal-compatibility';

const convertLineItemToModel = (item) => {
  return {...item, categories: unbox(item.categories)};
};

@Injectable()
export class TariffDetailsEffects {
  // Get building categories
  getBuildingCategories: Observable<tariffActions.Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.GET_BUILDING_CATEGORIES),
    switchMap((_) => {

      return this.tariffService.getAllCategory().pipe(
        map(items => {
          return new tariffActions.GetBuildingCategoriesComplete(items);
        }),
        catchError((e) => {
          return of(new tariffActions.GetBuildingCategoriesFailed());
        })
      );
    })
  ));
  // Save tariff
  saveTariff: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffDetailsActions.SEND_TARIFF_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      this.store$.pipe(select(selectors.getTariffForm)),
      this.store$.pipe(select(selectors.getTariffSteps)),
      this.store$.pipe(select(selectors.getTariffVersionSettings)),
      (action: tariffDetailsActions.SendTariffRequest, buildingId, formState, steps, tariffVersionSettings) => {
        return {
          buildingId: buildingId,
          formState: formState,
          isNewVersion: action.payload.tariffValueVersion.isNewVersion,
          isSubVersion: action.payload.isSubVersion,
          currentTariff: action.payload.currTariff,
          postUpdateActions: action.payload.tariffValueVersion.postUpdateActions,
          tariffVersionSettings: tariffVersionSettings.tariffVersionSettings
        };
      }
    ),
    switchMap(({
                 buildingId,
                 formState,
                 isNewVersion,
                 currentTariff,
                 isSubVersion,
                 postUpdateActions,
                 tariffVersionSettings
               }) => {
      if (!currentTariff && !formState.isValid) {
        return of({type: 'DUMMY'});
      }
      let form;
      if (formState.value.versionId) {
        form = formState.value;
      } else {
        form = {...formState.value, currentTariff};
      }

      const model = Object.assign(new TariffDetailViewModel(), {
        id: form.id,
        supplierId: null,
        buildingId: buildingId,
        name: form.name,
        code: form.code,
        supplyType: form.supplyType,
        seasonalChangesEnabled: form.seasonalChangesEnabled,
        touChangesEnabled: form.touChangesEnabled,
        buildingCategoriesIds: unbox(form.buildingCategoriesIds),
        basedOnReadingsLineItems: form.basedOnReadingsLineItems ? form.basedOnReadingsLineItems.map((item) => {
          const newItem = convertLineItemToModel(item);
          newItem.stepSchema = tariffVersionSettings.tariffSteps.find((s: any) => s.id === item.stepSchema) || null;
          return newItem;
        }) : null,
        basedOnReadingsAndSettingsLineItems:
          form.basedOnReadingsAndSettingsLineItems ? form.basedOnReadingsAndSettingsLineItems.map(convertLineItemToModel) : [],
        basedOnAttributeLineItems: form.basedOnAttributesLineItems ? form.basedOnAttributesLineItems.map(convertLineItemToModel) : [],
        basedOnCalculationsLineItems:
          form.basedOnCalculationsLineItems ? form.basedOnCalculationsLineItems.map(convertLineItemToModel) : [],
        fixedPriceLineItems: form.fixedPriceLineItems ? form.fixedPriceLineItems.map(convertLineItemToModel) : [],
        tariffCategories: unbox(form.tariffCategories),
        createdOn: form.createdOn,
        createdBy: form.createdBy ? form.createdBy : currentTariff.createdByUser.id,
        disableAfter: form.disableAfter,
        tariffVersionSettings: tariffVersionSettings
      });

      const version: VersionViewModel<TariffDetailViewModel> =
        new VersionViewModel(model, '', VersionActionType.Overwrite, new Date(form.versionDate), form.versionId);
      if (isNewVersion) {
        return this.tariffService.addTariffNewVersion(version, isSubVersion).pipe(
          map((result) => {
            return new tariffActions.CreateTariffRequestComplete({
              buildingId: buildingId,
              tariffVersionId: result.current.id
            });
          }),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      } else {
        return this.tariffService.updateTariff(version, buildingId).pipe(
          map(() => {
            postUpdateActions.forEach(action => {
              this.store$.dispatch(action);
            });

            return new tariffDetailsActions.SendTariffRequestComplete();
          }),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      }
    })
  ));
  deleteTariffSubVersion: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.DELETE_TARIFF_SUBVERSION),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      this.branchManagerService.getBranchObservable(),
      this.store$.pipe(select(selectors.getPreviousSubVersion)),
      (action: any, buildingId, branch, previousSubVersion) => {
        return {
          versionId: action.payload.tariffVersionId,
          buildingId: buildingId,
          previousSubVersionId: previousSubVersion?.versionId,
          branchId: branch.id
        };
      }
    ),
    switchMap(({buildingId, versionId, branchId, previousSubVersionId}) => {
      return this.tariffService.deleteTariffSubVersion(versionId, buildingId).pipe(
        map(() => {
          const route = ['branch', branchId, 'buildings', buildingId, 'tariffs', 'building-tariffs'];

          if (previousSubVersionId) {
            route.push(previousSubVersionId);
          }

          this.router.navigate(route);

          return {type: 'DUMMY'};
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  deleteTariffVersion: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.DELETE_TARIFF_VERSION),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      (action: any, buildingId) => {
        return {
          tariffId: action.payload.tariffId,
          buildingId: buildingId,
          majorVersion: action.payload.majorVersion
        };
      }
    ),
    switchMap(({tariffId, majorVersion, buildingId}) => {
      return this.tariffService.deleteTariffVersion(tariffId, majorVersion, buildingId).pipe(
        map(() => {
          return new tariffActions.RequestTariffList();
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  addTariffVersion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.ADD_TARIFF_VERSION),
    withLatestFrom(
      this.store$.pipe(select(selectors.getTariffForm)),
      this.store$.pipe(select(selectors.getTariffFormMaxMajorVersion)),
      this.store$.pipe(select(selectors.getTariffFormMaxMinorVersion)),
      (action: tariffActions.AddTariffVersion, formState, majorVersion, minorVersion) => {
        return {
          formState,
          isSubVersion: action.isSubVersion,
          majorVersion,
          minorVersion,
          payload: action.payload,
        };
      }
    ),
    switchMap(data => {
      const newVersionModel = data.payload;
      let tariffId = data.formState.value.id;
      const isSubVersion = data.isSubVersion;
      let majorVersion = isSubVersion ? data.formState.value.majorVersion : data.majorVersion;
      let minorVersion = data.minorVersion;
      let currTariff = null;

      if (newVersionModel) {
        tariffId = newVersionModel.tariffId || data.formState.value.id;
        majorVersion = newVersionModel.majorVersion || data.majorVersion;
        minorVersion = newVersionModel.minorVersion || data.payload.minorVersion;
        currTariff = newVersionModel.currentTariff;
      }

      const availableDate$ = isSubVersion
        ? of(data.formState.value.versionDate)
        : this.tariffService.getAvailableDate(tariffId);

      return forkJoin([of(majorVersion), of(minorVersion), of(isSubVersion), availableDate$, of(currTariff)]);
    }),
    map(data => {
      const [majorVersion, minorVersion, isSubVersion, nextAvaibleDate, currentTariff] = data;

      return new tariffActions.OpenTariffPopup({
        majorVersion,
        minorVersion,
        isSubVersion,
        nextAvaibleDate,
        currentTariff
      });
    })
  ));
  openTariffPopup$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.OPEN_TARIFF_POPUP),
    switchMap((action: tariffActions.OpenTariffPopup) => {
      const isSubVersion = action.payload.isSubVersion;
      const majorVersion = isSubVersion ? action.payload.majorVersion : action.payload.majorVersion + 1;
      const minorVersion = isSubVersion ? action.payload.minorVersion + 1 : 0;

      const modalRef = this.modalService.open(NewTariffVersionComponent, {
        backdrop: 'static',
        windowClass: 'tariff-details-modal'
      });
      modalRef.componentInstance.majorVersion = majorVersion;
      modalRef.componentInstance.minorVersion = minorVersion;
      modalRef.componentInstance.isSubVersion = isSubVersion;
      modalRef.componentInstance.versionDate = action.payload.nextAvaibleDate;
      modalRef.componentInstance.currentTariff = action.payload.currentTariff;

      return forkJoin([fromPromise(modalRef.result), of(modalRef.componentInstance.currentTariff), of(isSubVersion)]);
    }),
    map(data => {
      const [result, currentTariff, isSubVersion] = data;

      if (currentTariff) {
        return result ?
          new tariffActions.ResultTariffPopupSuccess({
            result: true, currentTariff: currentTariff, isSubVersion: isSubVersion
          }) : new tariffActions.ResultTariffPopupCancel();
      }
      return result ?
        new tariffActions.ResultTariffPopupSuccess({
          result: true,
          currentTariff: null,
          isSubVersion: isSubVersion
        }) : new tariffActions.ResultTariffPopupCancel();
    })
  ));
  ResultTariffPopupSuccess = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.RESULT_TARIFF_POPUP_SUCCESS),
    withLatestFrom(
      this.store$.pipe(select(selectors.getTariffForm)),
      (action: tariffActions.ResultTariffPopupSuccess, formState) => {
        return {
          payload: action.payload,
          formState,
        };
      }
    ),
    tap(data => {
      const tariffValueVersionModel: TariffValueVersionModel = new TariffValueVersionModel();
      tariffValueVersionModel.isNewVersion = data.payload.result;
      const formId = data.formState.id;

      this.store$.dispatch(new MarkAsSubmittedAction(formId));
      this.store$.dispatch(new tariffDetailsActions.SendTariffRequest({
        tariffValueVersion: tariffValueVersionModel,
        currTariff: data.payload.currentTariff,
        isSubVersion: data.payload.isSubVersion
      }));
    })
  ), {dispatch: false})

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromTariff.State>,
    private readonly tariffService: BuildingTariffsService,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly branchManagerService: BranchManagerService) {
  }
}
