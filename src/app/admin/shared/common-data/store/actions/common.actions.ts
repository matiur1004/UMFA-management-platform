import {Action as StoreAction} from '@ngrx/store';
import {UnitOfMeasurement} from '@models';

export const SET_UNIT_OF_MEASUREMENT = '[Admin Common Data] GET_UNIT_OF_MEASUREMENT';

export class SetUnitsOfMeasurement implements StoreAction {
  readonly type = SET_UNIT_OF_MEASUREMENT;

  constructor(public payload: UnitOfMeasurement[]) {
  }
}

export type Action =
  SetUnitsOfMeasurement;
