import {SupplyType} from './../../../../../../shared/models/supply-type.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Action, select, Store} from "@ngrx/store";
import * as tariffVersionSettingsActions from 'app/shared/tariffs/store/actions/tariff-version-settings.actions';
import {Observable, of} from "rxjs";
import {switchMap, tap, withLatestFrom} from "rxjs/operators";
import {TariffVersionSettingsService} from "@app/shared/tariffs/services/tariff-version-settings.service";
import * as selectors from "../selectors/index";
import * as state from "../reducers/index";
import {TariffVersionSettingsViewModel} from "@app/shared/models/tariff-version-settings.model";
import * as categoriesActions from 'app/shared/tariffs/store/actions/tariff-categories.actions';
import * as stepsActions from 'app/shared/tariffs/store/actions/tariff-steps.actions';
import {AddTariffCategoryOrStepPopupMode} from "@app/shared/tariffs/models/add-tariff-category-or-step-popup-mode.enum";
import {AddTariffCategoryOrStepPopupComponent} from "@app/shared/tariffs/add-tariff-category-or-step-popup/add-tariff-category-or-step-popup.component";
import {TariffVersionCategoryViewModel, TariffVersionStepModel} from "@app/shared/models";
import {ResetAction} from "ngrx-forms";

const featureName = "building-tariffs";

@Injectable()
export class TariffVersionSettingsEffects {

  saveTariffVersionSettings: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffVersionSettingsActions.SAVE_TARIFF_VERSION_SETTINGS),
    withLatestFrom(
      this.store$.pipe(select(selectors.getTariffCategoriesState)),
      this.store$.pipe(select(selectors.getTariffStepsState)),
      (action: tariffVersionSettingsActions.SaveTariffVersionSettings, categoriesForm, stepsForm) => {
        return {
          tariffVersionId: action.payload.tariffVersionId,
          buildingId: action.payload.buildingId,
          categoriesForm: categoriesForm,
          stepsForm: stepsForm
        };
      }),
    switchMap(({tariffVersionId, buildingId, categoriesForm, stepsForm}) => {
      if (categoriesForm.formState.isValid && stepsForm.formState.isValid) {
        const categoriesFormValue = categoriesForm.formState.value;
        const stepsFormValue = stepsForm.formState.value;

        const model = new TariffVersionSettingsViewModel();
        model.categoriesEnabled = categoriesFormValue.categoriesEnabled;
        model.tariffCategories = categoriesFormValue.categoriesEnabled ? categoriesFormValue.categories : [];
        model.stepsEnabled = stepsFormValue.stepsEnabled;
        model.tariffSteps = stepsFormValue.stepsEnabled ? stepsFormValue.steps : [];

        return this.tariffVersionSettingsService.update(tariffVersionId, buildingId, model).pipe(
          switchMap(() => [
            new ResetAction(state.buildingTariffCategoriesFormId),
            new ResetAction(state.buildingTariffStepsFormId)
          ]));
      }

      return of({type: 'DUMMY'});
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<state.State>,
    private tariffVersionSettingsService: TariffVersionSettingsService,
    private modalService: NgbModal
  ) {
  }

  showAddCategoryOrStepPopup = (
    mode: AddTariffCategoryOrStepPopupMode,
    items: TariffVersionCategoryViewModel[] | TariffVersionStepModel[],
    supplyType?: SupplyType): void => {
    const modalRef = this.modalService.open(AddTariffCategoryOrStepPopupComponent, {backdrop: 'static'});
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.items = items || [];
    modalRef.componentInstance.supplyType = supplyType;
    modalRef.result.then(({mode, items}) => {
      const actionToDispatch = mode === AddTariffCategoryOrStepPopupMode.Category
        ? new categoriesActions.TariffCategoryAdd(featureName, items)
        : new stepsActions.TariffStepAddNewStep(featureName, items);

      this.store$.dispatch(actionToDispatch);
    }, () => {
    });
  }

  addTariffCategoryForVersion = createEffect(() => this.actions$.pipe(
    ofType(categoriesActions.TARIFF_CATEGORY_ADD_NEW_CATEGORY_FOR_VERSION),
    withLatestFrom(
      this.store$.pipe(select(selectors.getTariffSettings)),
      this.store$.pipe(select(selectors.getTariffForm)),
      (_, settings, tariffForm) => {
        const supplyType = tariffForm.value.supplyType;

        return {
          items: settings.tariffCategories?.filter(item => item.supplyType === supplyType),
          supplyType: tariffForm.value.supplyType
        };
      }),
    tap(({items, supplyType}) => {
      this.showAddCategoryOrStepPopup(AddTariffCategoryOrStepPopupMode.Category, items, supplyType);
    })
  ), {dispatch: false});
  addTariffStepForVersion = createEffect(() => this.actions$.pipe(
    ofType(stepsActions.TARIFF_STEP_ADD_NEW_STEP_FOR_VERSION),
    withLatestFrom(
      this.store$.pipe(select(selectors.getTariffSettings)),
      (_, settings) => {
        return {
          items: settings.tariffSteps
        };
      }),
    tap(({items}) => {
      this.showAddCategoryOrStepPopup(AddTariffCategoryOrStepPopupMode.Step, items);
    })
  ), {dispatch: false});
}
