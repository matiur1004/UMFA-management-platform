import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  markAsPristine,
  setValue,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {greaterThan, maxLength, required} from 'ngrx-forms/validation';
import {combineReducers} from '@ngrx/store';

import * as fromTariffValuesActions from '../actions/tariff-value-form.actions';
import {TariffLineItemValuesViewModel, TariffLineItemValueViewModel, TariffValueInfoViewModel} from '@models';

export interface FormValue {
  id: string;
  name: string;
  increase: number;
  tariffVersionId: string;
  tariffName: string;
  tariffVersion: string;
  startDate: string;
  endDate: string;
  majorVersion: number;
  minorVersion: number;
  version: string;
  versionDate: Date;
  isActual: boolean;
  lineItemValues: TariffLineItemValuesViewModel[];
  versions: TariffValueInfoViewModel[];
}

export const initialFormState: FormValue = {
  id: '',
  name: '',
  tariffVersionId: '',
  tariffName: '',
  tariffVersion: '',
  increase: 0,
  startDate: '',
  endDate: '',
  majorVersion: 1,
  minorVersion: 0,
  version: '1.0',
  versionDate: null,
  isActual: false,
  lineItemValues: [],
  versions: []
};

export const FORM_ID: string = 'tariff-values';

export const InitialState = createFormGroupState<FormValue>(FORM_ID, {
  ...initialFormState
});

export interface State {
  formState: FormGroupState<FormValue>;
}

const validateAndUpdateForm = (s) => updateGroup<FormValue>({
  name: validate(required, maxLength(150)),
  startDate: validate(required),
  endDate: validate(required, (e) => greaterThan(new Date(s.value.startDate).getTime())(new Date(e).getTime())),
  lineItemValues: updateArray<TariffLineItemValuesViewModel>(
    updateGroup<TariffLineItemValuesViewModel>({
      values: updateArray<TariffLineItemValueViewModel>(
        updateGroup<TariffLineItemValueViewModel>({
          value: validate(required)
        })
      ),
    })
  ),
})(s);

export const getReducer = (formId) => {
  const initialState = createFormGroupState<FormValue>(formId, {
    ...initialFormState
  });


  return combineReducers<State, any>({
    formState(state = initialState, action: fromTariffValuesActions.Action) {
      state = formGroupReducer(state, action);

      if (action.payload && action.payload['formId'] === formId) {
        switch (action.type) {
          case fromTariffValuesActions.PURGE_TARIFF_VALUES: {
            state = setValue(state, initialFormState);
            state = markAsPristine(state);
            break;
          }
          default:
            break;
        }
      }
      return validateAndUpdateForm(state);
    },
  });
};

export const reducer = getReducer(FORM_ID);

