import {Injectable} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {merge, Observable, of} from 'rxjs';
import {catchError, first, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {CreateTariffComponent} from 'app/shared/tariffs/tariff-create/tariff-create.component';
import {getSupplyTypeIndexes, TariffDetailViewModel, VersionActionType, VersionViewModel} from '@models';
import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import * as tariffActions from '../actions/tariff.actions';
import {BuildingTariffsService} from '../../services/building-tariffs.service';
import {BranchManagerService} from '@services';
import {convertNgbDateToDate} from '@app/shared/helper/date-extension';

@Injectable()
export class CreateTariffEffects {

  // Start create tariff
  createTariff: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.CREATE_TARIFF_CLICK),
    withLatestFrom(this.store$.pipe(select(selectors.getBuildingCategories))),
    mergeMap(([_, bldCategories]) => {
      if (bldCategories) {
        return [new tariffActions.OpenCreateTariffModal()];
      } else {

        return merge(
          of(new tariffActions.GetBuildingCategories()),
          this.actions$
            .pipe(
              ofType(tariffActions.GET_BUILDING_CATEGORIES_COMPLETE, tariffActions.GET_BUILDING_CATEGORIES_FAILED),
              map((a: tariffActions.GetBuildingCategoriesComplete | tariffActions.GetBuildingCategoriesFailed) =>
                a.type === tariffActions.GET_BUILDING_CATEGORIES_COMPLETE
                  ? new tariffActions.OpenCreateTariffModal() : {type: 'DUMMY'}),
              first()
            ));
      }

    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ));
  openCreateTariffModal = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.CREATE_TARIFF_OPEN_MODAL),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingCategories)),
      this.store$.pipe(select(selectors.getTariffs))),
    tap(([_, buildingCategories, allTariffs]) => {
      const modalRef = this.modalService.open(CreateTariffComponent, {backdrop: 'static'});
      modalRef.componentInstance.supplyTypes = getSupplyTypeIndexes();
      modalRef.componentInstance.buildingCategories = buildingCategories;
      modalRef.componentInstance.tariffs = allTariffs;
      modalRef.result.then((data) => this.store$.dispatch(new tariffActions.CreateTariffRequest(data)),
        (e) => {/* closed - do nothing */
        });
    })
  ), {dispatch: false});
  // Create tariff
  createSaveTariff: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.CREATE_TARIFF_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      (action: tariffActions.CreateTariffRequest, buildingId) => {
        return {
          tariff: {
            buildingId: buildingId,
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
          new tariffActions.CreateTariffRequestComplete({
            buildingId: version.entity.buildingId,
            tariffVersionId: r.current.id
          })
        ]),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  tariffCreated: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.CREATE_TARIFF_REQUEST_COMPLETE),
    tap((action: tariffActions.CreateTariffRequestComplete) =>
      this.router.navigate(['branch', this.branchManager.getBranchId(),
        'buildings', action.payload.buildingId, 'tariffs', 'building-tariffs', action.payload.tariffVersionId])
        .then(() => window.scrollTo(0, 0)))), {dispatch: false});

  constructor(private readonly actions$: Actions,
              private readonly store$: Store<fromTariff.State>,
              private readonly tariffService: BuildingTariffsService,
              private readonly branchManager: BranchManagerService,
              private readonly router: Router,
              private readonly modalService: NgbModal) {
  }
}
