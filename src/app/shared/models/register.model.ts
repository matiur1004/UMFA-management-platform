import {SupplyType} from './supply-type.model';
import {TimeOfUse} from '@models';
import {UnitOfMeasurementType} from './unit-of-measurement.model';
import {VirtualRegisterType} from '@app/branch/buildings/manage-building/building-equipment/shared/models/virtual-register.model';

export interface RegisterViewModel {
  id: string;
  name: string;
  description: string;
  supplyTypes: SupplyType[];
  timeOfUse: TimeOfUse;
  registerType: RegisterType;
  unit: string;
  unitOfMeasurement: number;
  isSystem: boolean;
  sequenceNumber?: number;
  isVirtualRegister: boolean;
  dialCount: number,
  isBilling: boolean,
  obisCode: string
}

export interface RegisterEditViewModel {
  id: string;
  name: string;
  description: string;
  supplyTypes: SupplyType[];
  timeOfUse: TimeOfUse;
  registerType: RegisterType;
  sequenceNumber?: number;
  unitOfMeasurement: number;
  isSystem: boolean;
  obisCode: string;
}

export interface UnitOfMeasurement {
  defaultName: string;
  unitType: number;
  supplyTypes: SupplyType[];
  scales: UnitOfMeasurementScale[];
}

export interface UnitOfMeasurementScale {
  id: string;
  name: string;
  scale: number;
  isDefault: boolean;
}

export interface Scale {
  id: string;
  name: string;
  unit: string;
  scale: number;
}

export interface AssignedRegister {
  id: string;
  factor: number;
}

export interface TotalRegister {
  unitName: string;
  name: string;
  unitOfMeasurement: UnitOfMeasurementType;
  registerId: string;
  timeOfUse: TimeOfUse;
  calculationFactor: number;
  isBilling: boolean;
  isRemoved: boolean;
  registerIds: string[];
  virtualRegisterInfo?: VirtualRegisterInfo;
}

//Registertype
export enum RegisterType {
  Consumption,
  ResetMax,
  Reset
}
export const RegisterTypeText = {
  [RegisterType.Consumption]: 'Cumulative',
  [RegisterType.Reset]: 'Resetted',
  [RegisterType.ResetMax]: 'Resetted Max'
};
export const RegisterTypeDropdownItems = [
  {name: RegisterTypeText[RegisterType.Consumption], id: RegisterType.Consumption},
  {name: RegisterTypeText[RegisterType.Reset], id: RegisterType.Reset},
  {name: RegisterTypeText[RegisterType.ResetMax], id: RegisterType.ResetMax}
];

export interface VirtualRegisterInfo {
  virtualType: VirtualRegisterType;
  signalMeterRegisterType?: SignalMeterRegisterType;
}

export enum SignalMeterRegisterType {
  Normal,
  Alternate
}

export const RegisterSuffix = {
  [`${VirtualRegisterType.SignalMeter}${SignalMeterRegisterType.Normal}`]: '-N',
  [`${VirtualRegisterType.SignalMeter}${SignalMeterRegisterType.Alternate}`]: '-A',
  [`${VirtualRegisterType.MeterTotal}`]: '-T',
};

