import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  SetValueAction,
  updateArrayWithFilter,
  updateGroup
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

import * as addClosingReadingsActions
  from '../../actions/replace-equipment-wizard-actions/add-closing-readings-step.actions';

import {AddClosingReadingViewModel} from '../../../models';

export interface FormValue {
  readings: AddClosingReadingViewModel[];
  replacementDate: string | Date;
}

export const INIT_DEFAULT_STATE = {
  readings: [],
  replacementDate: new Date()
};

export interface State {
  formState: FormGroupState<FormValue>;
  registerFiles: any;
}

export const FORM_ID: string = 'buildingReplaceEquipmentAddClosingReadings';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

const validateAndUpdateForm = updateGroup<FormValue>({});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: addClosingReadingsActions.Action | SetValueAction<any>) {
    state = formGroupReducer(state, action);

    switch (action.type) {
      case SetValueAction.TYPE: {
        const replacementDateId = state.controls.replacementDate.id;
        if (action.controlId === replacementDateId) {
          state = updateGroup<FormValue>({
            readings: updateArrayWithFilter<AddClosingReadingViewModel>(
              (r) => r.value.date instanceof Date && r.value.date.toISOString() > state.value.replacementDate
                || r.value.date > state.value.replacementDate,
              (c) => setValue<AddClosingReadingViewModel>({...c.value, date: state.value.replacementDate})(c)
            )
          })(state);
        }
        break;
      }

      default:
        break;
    }
    return validateAndUpdateForm(state);
  },
  registerFiles(state = {}, action: addClosingReadingsActions.Action) {
    switch (action.type) {
      case addClosingReadingsActions.UPDATE_REGISTER_FILE: {
        const {registerTouKey, file} = action.payload;

        return {
          ...state,
          [registerTouKey]: file
        };
      }

      case addClosingReadingsActions.RESET_ADD_CLOSING_READINGS_STEP:
        return {};

      default:
        return state;
    }
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;
export const getRegisterFiles = (state: State) => state.registerFiles;
