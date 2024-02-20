import {ActionReducer, combineReducers, MetaReducer} from '@ngrx/store';
import * as unitsOfMeasurementStore from './units-of-measurement.reducer';
import {UnitOfMeasurement} from '@models';

export interface State {
  unitsOfMeasurement: UnitOfMeasurement[];
}

export const reducers = combineReducers<State, any>({
  unitsOfMeasurement: unitsOfMeasurementStore.reducer,
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];
