import {SupplyType} from './supply-type.model';

export interface EquipmentTreeModel {
  index?: number;
  ageInDays: number;
  attributes: EquipmentTreeAttributeModel[];
  description: string;
  supplyType: SupplyType;
  equipmentModel: string;
  equipmentGroup: string;
  meterId: string;
  parentMeters: string[];
  serialNumber: string;
  isDummy: boolean;
  isFaulty: boolean;
  reasonOfFaulty: string;
  lastReadingSource: string;
  meterType: number;
  shops: EquipmentTreeShopModel[];
  commonAreas: EquipmentTreeShopModel[];
  children: EquipmentTreeModel[];
  nodes: EquipmentTreeNodeModel[];
  location: EquipmentTreeLocationModel;
  parentLocation?: EquipmentTreeLocationModel;
  highlight?: boolean;
  level?: number;
}

export interface EquipmentTreeLocationModel {
  locationId: string;
  locationName: string;
  locationType: string;
  supplyTo: string;
}

export interface EquipmentTreeNodeModel {
  id: string;
  name: string;
}


export interface EquipmentTreeShopModel {
  area: number;
  floor: number;
  id: string;
  isSpare: boolean;
  name: string;
  tenant: TenantModel;
}

export interface EquipmentTreeAttributeModel {
  fieldType: number;
  id: string;
  name: string;
  unitName: string;
  value: string;
}

export interface TenantModel {
  contactInformations: any;
  email: string;
  id: string;
  name: string;
  phone: string;
  shops: any;
  totalGLA: number;
}

export enum BreakerPhases {
  OnePhase = '1 Phase',
  TwoPhases = '2 Phases',
  ThreePhases = '3 Phases',
}

export enum EquipmentTypes {
  Breaker,
  WholeCurrentMeter,
  HighVoltageMeter,
  CTMeter
}
