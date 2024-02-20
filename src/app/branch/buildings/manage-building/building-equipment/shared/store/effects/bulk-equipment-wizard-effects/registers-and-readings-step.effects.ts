import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {map, withLatestFrom} from 'rxjs/operators';

import * as fromEquipment from '../../reducers';
import * as registersAndReadingsStepSelectors
  from '../../reducers/bulk-equipment-wizard-reducers/selectors/registers-and-readings.selectors';

import * as registersAndReadingsStepStore
  from '../../reducers/bulk-equipment-wizard-reducers/registers-and-readings-step.store';
import {FormValue} from '../../reducers/bulk-equipment-wizard-reducers/registers-and-readings-step.store';
import * as registersAndReadingsStepActions
  from '../../actions/bulk-equipment-wizard-actions/registers-and-readings-step.actions';

import {FormGroupState, SetValueAction} from 'ngrx-forms';
import {RegistersAndReadingsStepActionType} from '../../../models/bulk-action.model';
import {ngbDateNgrxValueConverter} from '@shared-helpers';

@Injectable()
export class RegistersAndReadingsStepEffects {

  // Apply bulk value
  applyBulkValue = createEffect(() => this.actions$.pipe(
    ofType(registersAndReadingsStepActions.APPLY_BULK_VALUE),
    withLatestFrom(this.store$.pipe(select(registersAndReadingsStepSelectors.getFormState)),
      (action: any, form) => {
        return {
          bulkAction: action.payload.bulkAction,
          bulkValue: action.payload.bulkValue,
          form: form,
        };
      }),
    map(({bulkAction, bulkValue, form}) => {

      switch (bulkAction) {
        case RegistersAndReadingsStepActionType.SetRegisterNote: {
          return new SetValueAction(registersAndReadingsStepStore.FORM_ID, this.getFormValue(bulkValue, form, 'description'));
        }
        case RegistersAndReadingsStepActionType.SetRatio: {
          return new SetValueAction(registersAndReadingsStepStore.FORM_ID, this.getFormValue(bulkValue, form, 'ratio'));
        }
        case RegistersAndReadingsStepActionType.SetReading: {
          return new SetValueAction(registersAndReadingsStepStore.FORM_ID, this.getFormValue(bulkValue, form, 'readings'));
        }
        case RegistersAndReadingsStepActionType.SetReadingDate: {
          const date = ngbDateNgrxValueConverter.convertViewToStateValue(bulkValue);
          const formValue = this.getFormValue(date, form, 'date');
          return new SetValueAction(registersAndReadingsStepStore.FORM_ID, formValue);
        }
        case RegistersAndReadingsStepActionType.SetBilling: {
          return new SetValueAction(registersAndReadingsStepStore.FORM_ID, this.getFormValue(bulkValue, form, 'useForBilling'));
        }
      }
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
  ) {
  }

  getFormValue(bulkValue: any, form: FormGroupState<FormValue>, dataName: string) {
    return {
      meters: form.value.meters.map(m => {
          if (m.isSelected) {
            return {
              ...m,
              registers: m.registers.map(r => {
                return {
                  ...r,
                  [dataName]: bulkValue
                };
              })
            };
          }

          return m;
        }
      )
    };
  }
}
