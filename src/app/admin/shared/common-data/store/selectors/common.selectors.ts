import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from '../reducers';

const _getState = createFeatureSelector<State>('adminCommonData');

export const getUnitsOfMeasurement = createSelector(
  _getState,
  (state: State) => state.unitsOfMeasurement
);
