import {
  createFormGroupState,
  disable,
  enable,
  formGroupReducer,
  FormGroupState,
  updateGroup,
  validate
} from "ngrx-forms";
import {Action, combineReducers} from "@ngrx/store";
import {maxLength, required} from "ngrx-forms/validation";

import * as locationFormActions from '../actions/location-form.actions';
import {VersionActionType} from "@models";

export interface FormValue {
  id: string,
  name: string;
  description: string;
  buildingId: string;
  sequenceNumber: number;
  actionType: VersionActionType;
  date: any;
}

const formatedNowDate = () => {
  let date = new Date();
  return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
}

export const INIT_DEFAULT_STATE = {
  id: '',
  name: '',
  description: '',
  buildingId: '',
  sequenceNumber: 0,
  actionType: VersionActionType.Overwrite,
  date: formatedNowDate()
}

export const FORM_ID: string = 'buildingLocationForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID, INIT_DEFAULT_STATE);

export interface State {
  formState: FormGroupState<FormValue>;
  isNew: boolean;
  isComplete: boolean;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(150)),
  date: (s, parent) => {
    if (parent.value.actionType == 1)
      return enable(s);

    return disable(s);
  }
});

const reducers = combineReducers<State, any>({
  formState(s = InitState, a: Action) {
    return validateAndUpdateForm(formGroupReducer(s, a));
  },
  isNew(s: boolean, a: locationFormActions.Action) {
    switch (a.type) {
      case locationFormActions.EDIT_LOCATION:
        return false;

      case locationFormActions.CREATE_LOCATION:
        return true;

      default:
        return s;
    }
  },
  isComplete(s: boolean, a: locationFormActions.Action) {
    switch (a.type) {
      case locationFormActions.CREATE_LOCATION:
      case locationFormActions.EDIT_LOCATION:
        return false;

      case locationFormActions.SEND_LOCATION_REQUEST_COMPLETE:
        return true;

      default:
        return s;
    }
  },
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;
export const getIsNew = (state: State) => state.isNew;
export const getIsComplete = (state: State) => state.isComplete;
