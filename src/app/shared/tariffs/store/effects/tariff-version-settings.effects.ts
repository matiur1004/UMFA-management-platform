import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {map, switchMap, tap, withLatestFrom} from "rxjs/operators";
import {TariffVersionSettingsService} from "../../services/tariff-version-settings.service";
import * as tariffSettingsActions from "../actions/tariff-version-settings.actions";
import * as tariffStore from '@app/admin/suppliers/shared/store/reducers';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TariffVersionSettingsPopupComponent} from "../../popups/tariff-version-setting-popup/tariff-version-settings-popup.component";
import {MarkAsSubmittedAction} from "ngrx-forms";

@Injectable()
export class SharedTariffVersionSettingsEffects {

  getTariffCategoriesAllocatedUnits$ = createEffect(() => this.actions$.pipe(
    ofType(tariffSettingsActions.GET_TARIFF_CATEGORIES_ALLOCATED_UNITS),
    withLatestFrom(
      (action: tariffSettingsActions.GetTariffCategoriesAllocatedUnits) => {
        return {
          tariffVersionId: action.payload.tariffVersionId,
          tariffCategoryIds: action.payload.tariffCategoryIds,
          categoryFormId: action.payload.categoryFormId,
          stepFormId: action.payload.stepFormId,
          saveAction: action.payload.saveAction
        };
      }),
    switchMap(({
                 tariffVersionId,
                 tariffCategoryIds,
                 categoryFormId,
                 stepFormId,
                 saveAction
               }) => {
      return this.tariffVersionSettingsService.getAllocatedUnits(tariffVersionId, tariffCategoryIds).pipe(
        map((allocatedUnits) => {
          return new tariffSettingsActions.GetTariffCategoriesAllocatedUnitsSuccess({
            allocatedUnits,
            categoryFormId,
            stepFormId,
            saveAction
          });
        })
      );
    }),
    tap((result) => {
      if (result.payload.allocatedUnits.length > 0) {
        const modalRef = this.modalService.open(TariffVersionSettingsPopupComponent, {backdrop: 'static'});
        modalRef.componentInstance.allocatedUnits = result.payload.allocatedUnits;

        modalRef.result.then(() => {
          this.dispatchSave(result.payload.categoryFormId,
            result.payload.stepFormId,
            result.payload.saveAction);
        });
      } else {
        this.dispatchSave(result.payload.categoryFormId,
          result.payload.stepFormId,
          result.payload.saveAction);
      }
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<tariffStore.State>,
    private tariffVersionSettingsService: TariffVersionSettingsService,
    private modalService: NgbModal
  ) {
  }

  private dispatchSave(categoryFormId, stepsFormId, saveAction) {
    this.store$.dispatch(new MarkAsSubmittedAction(categoryFormId));
    this.store$.dispatch(new MarkAsSubmittedAction(stepsFormId));
    this.store$.dispatch(saveAction);
  }
}
