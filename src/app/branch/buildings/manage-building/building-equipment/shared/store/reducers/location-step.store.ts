import {createFormGroupState, FormGroupState, formStateReducer, updateGroup} from "ngrx-forms";
import {Action, combineReducers} from "@ngrx/store";

import * as locationStepActions from '../actions/location-step.actions';
import {UserViewModel} from "../../models";
import {LocationViewModel, SupplyToViewModel} from "@models";

export interface FormValue {
  id: string;
  name: string;
  supplyId: string;
  supplyName: string;
  locationType: string;
  description: string;
  isVerification: boolean;
  testingDate: Date;
  testingNote: string;
  technicianId: string;
  technicianName: string;
  supplyToLocationId: string;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  name: '',
  supplyId: '',
  supplyName: '',
  locationType: '',
  description: '',
  isVerification: false,
  testingDate: null,
  testingNote: '',
  technicianId: '',
  technicianName: '',
  supplyToLocationId: ''
}

export interface State {
  formState: FormGroupState<FormValue>;
  locations: LocationViewModel[];
  supplies: SupplyToViewModel[];
  technicians: UserViewModel[];
}

export const FORM_ID: string = 'buildingEquipmentLocationStep';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

const validateAndUpdateForm = updateGroup<FormValue>({});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: Action) {
    return validateAndUpdateForm(formStateReducer(state, action));
  },
  locations(state = [], action: locationStepActions.Action) {
    switch (action.type) {

      case locationStepActions.GET_LOCATIONS_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  supplies(state = [], action: locationStepActions.Action) {
    switch (action.type) {

      case locationStepActions.GET_SUPPLIES_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  technicians(state = [], action: locationStepActions.Action) {
    switch (action.type) {

      case locationStepActions.GET_TECHNICIANS_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  }
})

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getLocationStepFormState = (state: State) => state.formState;
export const getLocations = (state: State) => state.locations;
export const getSupplies = (state: State) => state.supplies;
export const getTechnicians = (state: State) => state.technicians;


