import {VirtualRegisterDetail, VirtualRegisterListItem} from '../../models/virtual-register.model';

export interface State {
  registers: VirtualRegisterListItem[];
  total: number;
  selectedRegister: VirtualRegisterDetail;
}

export const initialState: State = {
  registers: [],
  total: 0,
  selectedRegister: null
};

export const getRegisters = (state: State) => state.registers;
export const getSelectedRegister = (state: State) => state.selectedRegister;
export const getRegistersTotal = (state: State) => state.total;
