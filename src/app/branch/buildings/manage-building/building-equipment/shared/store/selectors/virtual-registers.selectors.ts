import {getVirtualRegisters} from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {createSelector} from '@ngrx/store';
import * as fromVirtualRegisters from '../state/virtual-registers.state';

export const getRegisters = createSelector(
  getVirtualRegisters,
  fromVirtualRegisters.getRegisters
);

export const getRegistersTotal = createSelector(
  getVirtualRegisters,
  fromVirtualRegisters.getRegistersTotal
);

export const getSelectedVirtualRegister = createSelector(
  getVirtualRegisters,
  fromVirtualRegisters.getSelectedRegister
);
