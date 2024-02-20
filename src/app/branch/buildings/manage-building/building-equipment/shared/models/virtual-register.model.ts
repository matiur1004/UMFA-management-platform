import {AssignedRegister} from '@models';

export interface BaseVirtualRegisterForm {
  name: string;
  description: string;
  unitOfMeasurement?: number;
}

export interface BaseVirtualRegisterModel {
  id: string;
  name: string;
  buildingId?: string;
  description: string;
  type: VirtualRegisterType;
  unitOfMeasurement?: number;
}

export enum VirtualRegisterType {
  MeterTotal,
  SignalMeter
}

export interface SignalMeterVirtualRegisterDetails extends BaseVirtualRegisterForm {
  signalMeterConfig: SignalMeterConfiguration;
}

export interface VirtualRegisterDetail extends BaseVirtualRegisterModel, SignalMeterVirtualRegisterDetails {
  assignedMeters: Array<VirtualRegisterMeter>;
}

export interface VirtualRegisterListItem extends BaseVirtualRegisterModel {
  metersCount: number;
  modifyDate: Date;
}

export enum AssignedStatus {
  All,
  Assigned,
  'Not Assigned'
}

export interface AssignedVirtualRegister extends BaseVirtualRegisterModel {
  useForBilling: boolean;
  isExpanded: boolean;
  sequenceNumber: number;
  bulkRegisters: AssignedRegister[];
  signalMeterConfig: SignalMeterConfiguration;
  meterTotalAssignment: MeterTotalAssignmentConfig;
  signalMeterAssignment: SignalMeterAssignmentConfig;
}

export interface MeterTotalAssignmentConfig {
  assignedRegisters: AssignedRegister[];
}

export interface SignalMeterAssignmentConfig {
  targetRegisterId: string;
}

export interface SignalMeterConfiguration {
  nameOn: string;
  nameOff: string;
  descriptionOn: string;
  descriptionOff: string;
  signalMeterId: string;
  triggerValue: number;
  signalRegisterId: string;
  registerOnId: string;
  registerOffId: string;
}

export interface VirtualRegisterMeter {
  meterId: string;
  useForBilling: boolean;
}

export const vrTypes = [
  {
    label: 'Meter Total',
    value: VirtualRegisterType.MeterTotal
  }, {
    label: 'Signal Meter',
    value: VirtualRegisterType.SignalMeter
  }
];
