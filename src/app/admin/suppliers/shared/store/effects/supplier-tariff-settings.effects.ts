import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {ResetAction, unbox} from 'ngrx-forms';
import {Observable, of} from 'rxjs';
import {catchError, filter, switchMap, withLatestFrom} from 'rxjs/operators';
import {SupplierService} from '../../services/supplier.service';
import * as fromActions from '../actions/supplier-categories.actions';
import * as fromStore from '../reducers';


import * as fromSelectors from '../selectors';


@Injectable()
export class SupplierTariffCategoriesEffects {

  updateTariffCategories: Observable<Action> = createEffect(() => 
    this.actions$.pipe(
      ofType(fromActions.API_SUPPLIER_TARIFF_CATEGORIES_UPDATE),
      withLatestFrom(
        this.store$.pipe(select(fromSelectors.getTariffCategoriesFormState)),
        this.store$.pipe(select(fromSelectors.getTariffStepsFormState)),
        (action: fromActions.ApiUpdateSupplierCategories, categoriesForm, stepsForm) => {
          return {supplierId: categoriesForm.value.id, categoriesForm, stepsForm};
        }),
      filter(({categoriesForm, stepsForm}) => categoriesForm.isValid && stepsForm.isValid),
      switchMap(({supplierId, categoriesForm, stepsForm}) => {
        const categories = unbox(categoriesForm.value.categories).map(c => {
          c.supplierId = supplierId;
          return c;
        });
        const steps = unbox(stepsForm.value.steps).map(s => {
          s.supplierId = supplierId;
          return s;
        });

        const model = {
          categoriesEnabled: categoriesForm.value.categoriesEnabled,
          tariffCategories: categories,
          stepsEnabled: stepsForm.value.stepsEnabled,
          tariffSteps: steps
        };

        return this.supplierService.updateSupplierTariffCategories(supplierId, model).pipe(
          switchMap(() => {
            return [
              new fromActions.ApiUpdateSupplierCategoriesSucceeded(model),
              new ResetAction(fromStore.SupplierCategoriesFormId),
              new ResetAction(fromStore.SupplierStepsFormId)
            ];
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private supplierService: SupplierService
  ) {
  }
}
