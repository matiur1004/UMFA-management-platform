import {createFormGroupState, formGroupReducer, FormGroupState} from "ngrx-forms";
import {Action, combineReducers} from "@ngrx/store";

import * as enterReadingFormActions from '../actions/enter-reading-form.actions';
import {EnterReadingsShowFilter, EnterReadingViewModel, ReadingsValidationViewModel} from "../../models";

export interface FormValue {
  readings: EnterReadingViewModel[];
  date: string;
}

export const INIT_DEFAULT_STATE: FormValue = {
  readings: [],
  date: new Date().toISOString(),
  // ngrx-form works with date through string. https://ngrx-forms.readthedocs.io/en/master/user-guide/form-controls/#value-conversion
}

export const FORM_ID = 'enterReadingForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID, INIT_DEFAULT_STATE);

export interface State {
  formState: FormGroupState<FormValue>;
  isSubmitted: boolean;
  showFilter: EnterReadingsShowFilter;
  showFilterDate: string;
  registerFiles: {};
  readingsForDate: ReadingsValidationViewModel[];
  searchKey?: string;
  searchLocation?: string;
}

const reducers = combineReducers<State, any>({
  formState(s = InitState, a: Action) {
    return formGroupReducer(s, a);
  },

  isSubmitted(s = true, a: Action) {
    switch (a.type) {
      case enterReadingFormActions.MARK_AS_SUBMITTED:
        return true;

      case enterReadingFormActions.MARK_AS_UNSUBMITTED:
        return false;

      default:
        return s;
    }
  },

  showFilter(s = EnterReadingsShowFilter.AllReadings, a: enterReadingFormActions.Action) {
    switch (a.type) {
      case enterReadingFormActions.CHANGE_FILTER_AS_ALL_READINGS:
        return EnterReadingsShowFilter.AllReadings;

      case enterReadingFormActions.CHANGE_FILTER_AS_HAS_NO_READINGS:
        return EnterReadingsShowFilter.HasNoReadings;

      default:
        return s;
    }
  },

  showFilterDate(s = new Date().toISOString(), a: enterReadingFormActions.Action) {
    switch (a.type) {
      case enterReadingFormActions.CHANGE_FILTER_AS_OF_DATE:
        return a.payload;

      default:
        return s;
    }
  },
  registerFiles(s = {}, a: any) {
    switch (a.type) {
      case enterReadingFormActions.UPDATE_REGISTER_FILE: {


        const {registerTouKey, meterId, file} = a.payload;

        let meter = s[meterId];

        if (meter) {
          meter = {...meter};
        } else
          meter = {};

        meter[registerTouKey] = file;

        return {
          ...s,
          [meterId]: meter
        };
      }

      case enterReadingFormActions.RESET_REGISTER_FILES:
        return {};

      default:
        return s;
    }
  },

  readingsForDate(state = [], action: enterReadingFormActions.Action) {
    switch (action.type) {
      case enterReadingFormActions.REQUEST_READINGS_FOR_DATE_COMPLETE:
        return action.payload.readings;
      default:
        return state;
    }
  },

  searchKey(state: string, action: enterReadingFormActions.Action) {
    switch (action.type) {
      case enterReadingFormActions.UPDATE_SEARCH_KEY:
        return action.payload;
      default:
        return state;
    }
  },

  searchLocation(state: string = '', action: enterReadingFormActions.Action) {
    switch (action.type) {
      case enterReadingFormActions.UPDATE_SEARCH_LOCATION:
        return action.payload;
      default:
        return state;
    }
  },
});

export function reducer(s: State, a: enterReadingFormActions.Action) {
    return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;
export const getIsSubmitted = (state: State) => state.isSubmitted;
export const getShowFilter = (state: State) => state.showFilter;
export const getShowFilterDate = (state: State) => state.showFilterDate;
export const getRegisterFiles = (state: State) => state.registerFiles;
export const getReadingsForDate = (state: State) => state.readingsForDate;
export const getSearchKey = (state: State) => state.searchKey;
export const getSearchLocation = (state: State) => state.searchLocation;


