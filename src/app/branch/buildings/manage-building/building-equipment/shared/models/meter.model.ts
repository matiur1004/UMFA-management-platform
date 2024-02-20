import {AssignedVirtualRegister,} from '@app/branch/buildings/manage-building/building-equipment/shared/models/virtual-register.model';
import {EquipmentAttributeValueViewModel, EquipmentGroupViewModel, SupplyType, TimeOfUse} from '@models';
import {ReadingViewModel} from '../../../meter-readings/billing-readings/shared/models';
import {ReplaceMeterNodeViewModel} from './replace-meter-node.model';
import {SearchFilterAssignedMetersModel} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/shared/models/filter-meter.model';

export interface MeterDetailViewModel {
  baseFormId: string;
  id: string;
  parentMeters: string[];
  isSelected: boolean;
  serialNumber: string;
  manufactureDate: string;
  actualPhoto: File;
  logoUrl: string;
  isOwner: boolean;
  isAssigned: boolean;
  location: any;
  registers: MeterRegisterViewModel[];
  equipment: MeterEquipmentViewModel;
  virtualRegisters: AssignedVirtualRegister[];
  shopIds: string[];
  commonAreaIds: string[];

  isDummy: boolean;
  isFaulty: boolean;
  reasonOfFaulty: string;

  isSmartModel: boolean;
  breakerState: BreakerState;
  amrImportDate: string;
  isConnectedToAmr: boolean;
}

export class MeterWriteViewModel {
  id: string;
  buildingId: string;
  parentMeters: string[];
  isSelected: boolean = false;
  serialNumber: string;
  manufactureDate: string;
  actualPhoto: File;
  logoUrl: string;
  isOwner: boolean = false;
  isAssigned: boolean = false;
  location: any;
  equipmentTemplateId: string;
  equipmentGroup: EquipmentGroupViewModel;
  isDisplayOBISCode: boolean;
  isOldModel: boolean;

  equipmentModel: string;
  registers: MeterRegisterViewModel[];
  virtualRegisters: AssignedVirtualRegister[];
  attributes: EquipmentAttributeValueViewModel[];
  supplyType: number;

  shopIds: string[];
  commonAreaIds: string[];

  isDummy: boolean;
  isFaulty: boolean;
  reasonOfFaulty: string;

  isSmartModel: boolean;
  breakerState: BreakerState;

  amrImportDate: string;
  isConnectedToAmr: boolean;
  deviceTypeName: string;
}

export class MeterEquipmentViewModel {
  id: string;
  parentMeters: string[];
  serialNumber: string;
  manufactureDate: string;
  equipmentGroup: EquipmentGroupViewModel;
  actualPhoto: File;
  logoUrl: string;
  isDisplayOBISCode: boolean;
  equipmentPhotoUrl: string;
  equipmentModel: string;
  registers: MeterRegisterViewModel[];
  attributes: EquipmentAttributeValueViewModel[];
  supplyType: number;
  isDummy: boolean;
  isFaulty: boolean;
  reasonOfFaulty: string;

  photos: File[];
}

export interface AddClosingReadingViewModel {
  registerId: string;
  registerTouKey: string;
  name: string;
  readings: string;
  notes: string;
  date: string | Date;
  confirmed: boolean;
  file: File;
}

export interface ReplaceMeterViewModel {
  closingReadings: ReadingViewModel[];
  meter: MeterWriteViewModel;
  nodes: ReplaceMeterNodeViewModel[];
}

export interface MeterRegisterViewModel extends BaseMeterRegisterModel {
  obisCode: string;
  photo: File;
  photoUrl: string;
  calculationFactor: number;
  readings: string;
  timeOfUse: TimeOfUse;
  date: any;
  registerScaleId: string;
  sequenceNumber: number;
  registerType: number;
}

export interface BaseMeterRegisterModel {
  id: string;
  name: string;
  description: string;
  useForBilling: boolean;
  ratio: string;
  unitOfMeasurement: number;
  dialCount: number;
  isBilling: boolean;
}


export interface MeterEquipmentAttributeViewModel {
  id: string;
  name: string;
  value: string;
}

export interface TableAssignedViewModel extends MeterViewModel {
  isSelected: boolean;
  useForBilling: boolean;
  isAssigned: boolean;
}

export interface MeterViewModel {
  id: string;
  location: any;
  photoUrl: string;
  name?: string;
  serialNumber: string;
  sequenceNumber: string;
  supplyType: number;
  registers: MeterRegisterViewModel[];
  equipmentModel: string;
  shops: any[];
  commonAreas: any[];
  nodes: any[];
}

export enum OrderMeter {
  LocationDesc = -1,
  LocationAsc = 1,
  SequenceNumberDesc = -2,
  SequenceNumberAsc = 2,
  SerialNumberDesc = -3,
  SerialNumberAsc = 3,
  SupplyTypeDesc = -4,
  SupplyTypeAsc = 4,
  EquipmentModelDesc = -5,
  EquipmentModelAsc = 5,
  NumberOfUnitsDesc = -6,
  NumberOfUnitsAsc = 6
}

export enum RegisterStatusType {
  AllTypes = 0,
  Billing = 1,
  Readonly = 2
}

export enum RegisterRemovedStatus {
  All = 0,
  Removed = 1,
  NotRemoved = 2
}

export enum MeterPhotoType {
  ActualPhoto,
  CircuitBreaker,
  CTRatio,
  MainPhoto,
  AttributePhoto
}

export enum BulkDropdownType {
  SelectedEquipmentGroup,
  EquipmentGroups,
  SelectDevice,
  EquipmentTemplates,
  SelectedLocation,
  Locations,
  SelectedSupplyTo,
  Supplies,
  SelectedLocationType,
  LocationTypes,
  SelectParentMeter
}

export const registerStatusTypeText = {
  [RegisterStatusType.AllTypes]: 'All',
  [RegisterStatusType.Billing]: 'Yes',
  [RegisterStatusType.Readonly]: 'No'
};

export const registerRemovedStatusText = {
  [RegisterRemovedStatus.All]: 'All',
  [RegisterRemovedStatus.Removed]: 'No',
  [RegisterRemovedStatus.NotRemoved]: 'Yes'
};

export const registerStatusTypes = [RegisterStatusType.AllTypes, RegisterStatusType.Billing, RegisterStatusType.Readonly];

export const registerRemovedStatuses = [RegisterRemovedStatus.All, RegisterRemovedStatus.Removed, RegisterRemovedStatus.NotRemoved];

export enum BreakerState {
  None,
  On,
  Off
}

export interface SelectedStatusFilter {
  isBilling: RegisterStatusType;
  isRemoved: RegisterRemovedStatus;
}

export class MeterListFilterParameters {
  searchKey: string;
  buildingId: string;
  versionId: string;
  unitOfMeasurement: number;
  nodeId: string;
  locationId: string;
  unitId: string;
  supplyType: number;
  order: number;
  onlyAMRSource: boolean;
  excludeMeterIds: string[];
  filter?: SearchFilterAssignedMetersModel;
}

export interface ParentMeterValueModel {
  id: string;
  name: string;
  supplyType: SupplyType;
  parentMeters: string[];
}

export interface MeterWithParentsModel {
  id: string;
  parentMeters: string[];
}

export const getTreesLookup = (meters: MeterWithParentsModel[]) => {
  const treeLookup = {};

  meters.forEach(meter => {
    treeLookup[meter.id] = {
      ...meter,
      children: []
    };
  });

  meters.forEach(meter => {
    meter.parentMeters.forEach(parentMeterId => {
      let parent = treeLookup[parentMeterId];
      if (parent) {
        parent.children.push(meter);
      }
    });
  });

  // any element with 0 parents will be a root of tree
  return treeLookup;
};
