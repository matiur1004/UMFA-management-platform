import {
  AssignedVirtualRegister,
  VirtualRegisterType
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

export const isTargetMeterExist = (vr: AssignedVirtualRegister, registerId: string) => vr.signalMeterAssignment
  && vr.signalMeterAssignment.targetRegisterId === registerId;


export const meterTotal = (vr: AssignedVirtualRegister[], registerId: string) => vr.find(v => v.type === VirtualRegisterType.MeterTotal
  && v.meterTotalAssignment.assignedRegisters.find(ar => ar.id === registerId));
