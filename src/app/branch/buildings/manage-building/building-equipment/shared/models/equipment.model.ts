import {
  BrandViewModel,
  Dictionary,
  EquipmentGroupViewModel,
  EquipmentTemplateAttributeViewModel,
  RegisterViewModel,
  SupplyType,
  SupplyTypeCheck
} from '@models';
import {NodeViewModel} from './node.model';

export class EquipmentViewModel {
  id: string;
  sequenceNumber: number;
  serialNumber: string;
  equipmentModel: string;
  supplyType: SupplyType;
  equipmentGroup: EquipmentGroupViewModel;
  numberOfUnits: number;
  node: NodeViewModel;
  brand: BrandViewModel;
  registers: RegisterViewModel[];
}

export interface UnitViewModel {
  id: string;
  name: string;
}

export class BuildingEquipTemplateFilterViewModel {
  equipmentGroupId: string;
  brandId: string;
  equipmentModel: string;
  isOldModel: boolean = true;
  supplyTypes: SupplyType[] = new Array<SupplyType>();
  attributes: EquipmentTemplateAttributeViewModel[] = new Array<EquipmentTemplateAttributeViewModel>();
}

export class BuildingEquipTemplateFilterDetailViewModel {
  models: string[] = new Array<string>();
  checkedModel: string;
  supplyTypes: SupplyTypeCheck[] = new Array<SupplyTypeCheck>();
  equipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  checkedEquipmentGroup: EquipmentGroupViewModel;
  brands: BrandViewModel[] = new Array<BrandViewModel>();
  checkedBrand: BrandViewModel;
  equipmentAttributes: EquipmentTemplateAttributeViewModel[] = new Array<EquipmentTemplateAttributeViewModel>();
  equipmentTemplateAttributes: Dictionary<string[]> = {};
  isOldModel: boolean = true;
  isAllSupplyTypes: boolean = true;
}

export enum AssignFilter {
  AllEquipment = -1,
  NotAddedEquipment,
  OnlyAddedEquipment
}

export enum OrderEquipmentTemplate {
  BrandModelDesc = -1,
  BrandModelAsc = 1,
  SupplyTypeDesc = -2,
  SupplyTypeAsc = 2,
  EquipmentGroupDesc = -3,
  EquipmentGroupAsc = 3
}

export enum OrderEquipment {
  SequenceNumberDesc = -1,
  SequenceNumberAsc = 1,
  SerialNumberDesc = -2,
  SerialNumberAsc = 2,
  BrandModelDesc = -3,
  BrandModelAsc = 3,
  SupplyTypeDesc = -4,
  SupplyTypeAsc = 4,
  NumberOfUnitsDesc = -5,
  NumberOfUnitsAsc = 5,
  SupplyToDesc = -6,
  SupplyToAsc = 6
}

export enum ElectricityAttributeType {
  Phase,
  OnePhase,
  ThreePhases,
  Voltage,
  Amperage,
  CbSize
}

export const electricityAttributes = {
  [ElectricityAttributeType.OnePhase]: '1 phase',
  [ElectricityAttributeType.ThreePhases]: '3 phases',
  [ElectricityAttributeType.Phase]: 'phase',
  [ElectricityAttributeType.Amperage]: 'amperage',
  [ElectricityAttributeType.Voltage]: 'voltage',
  [ElectricityAttributeType.CbSize]: 'cb size',
};
