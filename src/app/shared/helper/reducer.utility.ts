import {NgrxFormControlId, SetValueAction} from "ngrx-forms";

export const createNamedReducer = (reducer, name) => {
  return (state, action) => {
    const {featureName} = action;
    const isInitializationCall = state === undefined;
    if (name !== featureName && !isInitializationCall) {
      return state;
    }

    return reducer(state, action);
  };
}

export class NamedSetValueAction<TValue> extends SetValueAction<TValue> {
  constructor(controlId: NgrxFormControlId, value: TValue, featureName: string) {
    super(controlId, value);
  }
}

