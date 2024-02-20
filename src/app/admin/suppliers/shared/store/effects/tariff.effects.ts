import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Action, select, Store} from '@ngrx/store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin, merge, Observable, of} from 'rxjs';
import {catchError, debounceTime, first, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {box, MarkAsSubmittedAction, unbox} from 'ngrx-forms';

import {TariffService} from '../../services/tariff.service';

import * as tariffActions from '../actions/tariff.actions';
import * as tariffFormActions from '../actions/tariff-form.actions';
import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import {TariffDetailViewModel, TariffValueVersionModel, VersionActionType, VersionViewModel} from '@models';
import {CreateTariffComponent} from 'app/shared/tariffs/tariff-create/tariff-create.component';
import {convertNgbDateToDate} from '@app/shared/helper/date-extension';
import {NewTariffVersionComponent} from '@app/shared/tariffs';
import {fromPromise} from 'rxjs/internal-compatibility';

const convertLineItemToModel = (item) => {
  return {...item, categories: unbox(item.categories)};
};

@Injectable()
export class TariffEffects {

  // Get aggregated list of tariffs
  getTariffs = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.REQUEST_TARIFF_LIST),
      withLatestFrom(
        this.store$.pipe(select(selectors.getSupplierId)),
        this.store$.pipe(select(selectors.getTariffState))),
      switchMap(([_, supplierId, state]) => {
        const tariffs =
          this.tariffService.getAllTariffs(supplierId, state.searchKey, state.supplyTypeFilter, state.order, state.buildingCategoryId);

        return tariffs.pipe(
          mergeMap((tariff) => [new tariffActions.RequestTariffListComplete(tariff)]),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      })
    )
  );

  // Update search key
  updateSearchKey: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.UPDATE_SEARCH_KEY),
      debounceTime(300),
      map((action) => {
        return new tariffActions.RequestTariffList();
      })
    )
  );

  // Update supplyType, buildingCategory
  updateSupplyTypeBuildingCategory: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.UPDATE_SUPPLY_TYPE_FILTER, tariffActions.UPDATE_BUILDING_CATEGORY_ID),
      map((action) => {
        return new tariffActions.RequestTariffList();
      })
    )
  );

  // Get building categories
  getCategories: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.GET_BUILDING_CATEGORIES),
      switchMap((_) => {

        return this.tariffService.getAllCategory().pipe(
          map(items => {
            return new tariffActions.GetBuildingCategoriesComplete(items);
          }),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      })
    )
  );
  // Start create tariff
  createTariff: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffFormActions.CREATE_TARIFF_CLICK),
      withLatestFrom(this.store$.pipe(select(selectors.getBuildingCategories))),
      mergeMap(([_, bldCategories]) => {
        if (bldCategories) {
          return [new tariffFormActions.OpenCreateTariffModal()];
        } else {

          return merge(
            of(new tariffActions.GetBuildingCategories()),
            this.actions$
              .pipe(
                ofType(tariffActions.GET_BUILDING_CATEGORIES_COMPLETE, tariffActions.GET_BUILDING_CATEGORIES_FAILED),
                map((a: any) => a.type === tariffActions.GET_BUILDING_CATEGORIES_COMPLETE
                  ? new tariffFormActions.OpenCreateTariffModal() : {type: 'DUMMY'}),
                first()
              ));
        }

      }),
      catchError(() => {
        return of({type: 'DUMMY'});
      })
    )
  );

  openCreateTariffModal = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffFormActions.CREATE_TARIFF_OPEN_MODAL),
      withLatestFrom(
        this.store$.pipe(select(selectors.getBuildingCategories)),
        this.store$.pipe(select(selectors.getSuppliersSupplyTypes)),
        this.store$.pipe(select(selectors.getTariffs))),
      tap(([_, buildingCategories, supplyTypes, tariffs]) => {
        const modalRef = this.modalService.open(CreateTariffComponent, {backdrop: 'static'});
        modalRef.componentInstance.supplyTypes = supplyTypes;
        modalRef.componentInstance.buildingCategories = buildingCategories;
        modalRef.componentInstance.tariffs = tariffs;
        modalRef.result.then((data) => this.store$.dispatch(new tariffFormActions.CreateTariffRequest(data)),
          (e) => {/* closed - do nothing */
          });
      })
    ),{dispatch: false}
  );

  // Create tariff
  createSaveTariff: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffFormActions.CREATE_TARIFF_REQUEST),
      withLatestFrom(
        this.store$.pipe(select(selectors.getSupplierId)),
        (action: tariffFormActions.CreateTariffRequest, supplierId) => {
          return {
            tariff: {
              supplierId: supplierId,
              ...action.payload
            }
          };
        }
      ),
      switchMap(({tariff}) => {
        const model = {
          ...new TariffDetailViewModel(),
          ...tariff
        };

        const version: VersionViewModel<TariffDetailViewModel> =
          new VersionViewModel(model, '', VersionActionType.Init, convertNgbDateToDate(model.versionDate), null);

        return this.tariffService.createTariff(version).pipe(
          mergeMap(r => [
            new tariffActions.UpdateTariffVersionId(r.current.id),
            new tariffFormActions.CreateTariffRequestComplete({
              supplierId: version.entity.supplierId,
              tariffVersionId: r.current.id
            })
          ]),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      })
    )
  );

  tariffCreated: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffFormActions.CREATE_TARIFF_REQUEST_COMPLETE),
      tap((action: tariffFormActions.CreateTariffRequestComplete) =>
        this.router.navigate(['admin', 'suppliers', action.payload.supplierId, 'tariffs', action.payload.tariffVersionId])
          .then(() => window.scrollTo(0, 0))))
          ,{dispatch: false}
  );

  // Save tariff
  saveTariff: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffFormActions.SEND_TARIFF_REQUEST),
      withLatestFrom(
        this.store$.pipe(select(selectors.getSupplierId)),
        this.store$.pipe(select(selectors.getTariffForm)),
        this.store$.pipe(select(selectors.getTariffVersionSettings)),
        (action: tariffFormActions.SendTariffRequest, supplierId, formState, tariffVersionSettings) => {
          return {
            supplierId,
            formState,
            isNewVersion: action.payload.tariffValueVersion.isNewVersion,
            isSubVersion: action.payload.isSubVersion,
            currentTariff: action.payload.currTariff,
            postUpdateActions: action.payload.tariffValueVersion.postUpdateActions,
            tariffVersionSettings: tariffVersionSettings.tariffVersionSettings
          };
        }
      ),
      switchMap(({
                  supplierId,
                  formState,
                  isNewVersion,
                  isSubVersion,
                  currentTariff,
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
          supplierId: supplierId,
          buildingId: null,
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
          disableForNewCustomers: false,
          versionDate: form.versionDate,
          tariffVersionSettings: tariffVersionSettings
        });

        const version: VersionViewModel<TariffDetailViewModel> =
          new VersionViewModel(model, '', VersionActionType.Overwrite, new Date(form.versionDate), form.versionId);
        if (isNewVersion) {
          return this.tariffService.addTariffNewVersion(version, isSubVersion).pipe(
            map((result) => {
              return new tariffFormActions.CreateTariffRequestComplete({
                supplierId: supplierId,
                tariffVersionId: result.current.id
              });
            }),
            catchError(() => {
              return of({type: 'DUMMY'});
            })
          );
        } else {
          return this.tariffService.updateTariff(version).pipe(
            map(() => {
              postUpdateActions.forEach(action => {
                this.store$.dispatch(action);
              });

              return new tariffFormActions.SendTariffRequestComplete();
            }),
            catchError(() => {
              return of({type: 'DUMMY'});
            })
          );
        }
      })
    )
  );

  deleteTariffSubVersion: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.DELETE_TARIFF_SUB_VERSION),
      withLatestFrom(
        this.store$.pipe(select(selectors.getSupplierId)),
        this.store$.pipe(select(selectors.getPreviousSubVersion)),
        (action: any, supplierId, previousSubVersion) => {
          return {
            versionId: action.payload.versionId,
            supplierId: supplierId,
            previousSubVersionId: previousSubVersion?.versionId
          };
        }
      ),
      switchMap(({versionId, supplierId, previousSubVersionId}) => {
        return this.tariffService.deleteTariffSubVersion(versionId).pipe(
          map(() => {
            const route = ['admin', 'suppliers', supplierId, 'tariffs'];

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
    )
  );

  deleteTariffVersion: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.DELETE_TARIFF_VERSION),
      switchMap((action: { payload }) => {
        const {tariffId, majorVersion} = action.payload;

        return this.tariffService.deleteTariffVersion(tariffId, majorVersion).pipe(
          map(() => {
            return new tariffActions.RequestTariffList();
          }),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      })
    )
  );

  addTariffVersion$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(tariffActions.ADD_TARIFF_VERSION),
      withLatestFrom(
        this.store$.pipe(select(selectors.getTariffForm)),
        this.store$.pipe(select(selectors.getTariffFormMaxMajorVersion)),
        this.store$.pipe(select(selectors.getTariffFormMaxMinorVersion)),
        (action: tariffActions.AddTariffVersion, formState, majorVersion, minorVersion) => {
          return {
            formState,
            payload: action.payload,
            isSubVersion: action.isSubVersion,
            majorVersion,
            minorVersion
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
    )
  );

  openTariffPopup$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  ResultTariffPopupSuccess = createEffect(() =>
    this.actions$.pipe(
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
        this.store$.dispatch(new tariffFormActions.SendTariffRequest({
          tariffValueVersion: tariffValueVersionModel,
          currTariff: data.payload.currentTariff,
          isSubVersion: data.payload.isSubVersion
        }));
      })
    ), {dispatch: false}
  );

  constructor(private readonly actions$: Actions,
              private readonly store$: Store<fromTariff.State>,
              private readonly tariffService: TariffService,
              private readonly router: Router,
              private readonly modalService: NgbModal) {
  }

  convertToFormModel = (item) => {
    const object = {...item, categories: box(item.categories)};
    return object;
  }

  convertToModel = (item) => {
    const object = {...item, categories: unbox(item.categories)};
    return object;
  }
}
