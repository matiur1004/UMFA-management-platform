import {FieldType} from './field-type.enum';
import {RegisterViewModel} from './register.model';
import {SupplyType} from './supply-type.model';
import {Dictionary} from '@models';

export class EquipmentGroupViewModel {
  id: string;
  name: string;
  supplyType: number;
  isSystem: boolean;
}

export interface EquipmentOptionsViewModel {
  comboSettings: EquipmentComboSettingsViewModel[];
  units: EquipmentUnitViewModel[];
  groups: EquipmentGroupViewModel[];
}

export interface EquipmentUnitViewModel {
  id: string;
  name: string;
}

export interface EquipmentComboSettingsViewModel {
  id: string;
  equipmentAttributeId: string;
  value: string;
  sequence: number;
}

export interface EquipmentAttributeUnitsViewModel {
  units: EquipmentUnitViewModel[];
  comboSettings: EquipmentComboSettingsViewModel[];
}

export class EquipmentAttributeViewModel {
  id: string;
  name: string;
  isImportant: boolean;
  canAddPhoto: boolean;
  fieldType: FieldType;
  unit: EquipmentUnitViewModel;
  comboSettings: EquipmentComboSettingsViewModel[];
  unitValues: string[];
  equipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  isSystem: boolean;
  isAvailableForTariff: boolean;
  isRequired: boolean;
}

export class BrandViewModel {
  id: string;
  name: string;
  equipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
}

export class EquipmentTemplateRegisterViewModel {
  register: RegisterViewModel;
  sequenceNumber?: number;
  isBilling = false;
  dialCount = 5;
  registerType = 0;
  obisCode = '';
}

export class EquipmentTemplateAttributeViewModel {
  attribute: EquipmentAttributeViewModel = new EquipmentAttributeViewModel();
  value: string;
  numberValue: string;
}

export class EquipmentAttributeValueViewModel {
  attribute: EquipmentAttributeViewModel = new EquipmentAttributeViewModel();
  value: string;
  numberValue: string;
  photoUrl: string;
  newPhotoUrl?: string;
  photo: File;
}

export class EquipmentTemplateAttributeFilterViewModel extends EquipmentTemplateAttributeViewModel {
  unitValues: string[];
}

export class TemplateListItemViewModel {
  id: string;
  model: string;
  supplyType: SupplyType = SupplyType.Electricity;
  logoUrl: string;
  brand: string;
  equipmentGroup: string;
  equipmentGroupId: string;
}

export class EquipmentTemplateListItemViewModel extends TemplateListItemViewModel {
  isAssigned: boolean;
  attributes: EquipmentTemplateListItemAttributeViewModel[] = new Array<EquipmentTemplateListItemAttributeViewModel>();
}

export class EquipmentTemplateListItemAttributeViewModel {
  name: string;
  value: string;
  numberValue: number;
  unitOfMeasurement: string;
  fieldType: FieldType;
}

export class EquipmentTemplateViewModel {
  id: string;
  equipmentModel: string;
  supplyType: SupplyType = SupplyType.Electricity;
  isOldModel = false;
  isDisplayOBISCode = true;
  isFixedRegister = false;
  logo: File;
  logoUrl: string;
  brand: BrandViewModel = new BrandViewModel();
  equipmentGroup: EquipmentGroupViewModel = new EquipmentGroupViewModel();
  registers: RegisterViewModel[] = new Array<RegisterViewModel>();
  attributes: EquipmentTemplateAttributeViewModel[] = new Array<EquipmentTemplateAttributeViewModel>();
}

export class EquipmentTemplateFilterViewModel {
  equipmentGroupId: string;
  brandId: string;
  equipmentModel: string;
  isOldModel = true;
  supplyTypes: SupplyType[] = new Array<SupplyType>();
  attributes: EquipmentTemplateAttributeFilterViewModel[] = new Array<EquipmentTemplateAttributeFilterViewModel>();
}

export class EquipmentTemplateFilterDetailViewModel {
  models: string[] = new Array<string>();
  checkedModel: string;
  supplyTypes: SupplyTypeCheck[] = new Array<SupplyTypeCheck>();
  equipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  checkedEquipmentGroup: EquipmentGroupViewModel;
  brands: BrandViewModel[] = new Array<BrandViewModel>();
  checkedBrand: BrandViewModel;
  equipmentAttributes: EquipmentTemplateAttributeFilterViewModel[] = new Array<EquipmentTemplateAttributeFilterViewModel>();
  equipmentTemplateAttributes: Dictionary<string[]> = {};
}

export class SupplyTypeCheck {
  supplyType: SupplyType;
  isChecked = true;
}

export class SupplyToViewModel {
  id: string;
  name: string;
  locationTypes?: SupplyToLocationViewModel[];
  supplyTypes: SuppliesToSupplyTypeViewModel[] = new Array<SuppliesToSupplyTypeViewModel>();
}

export class SuppliesToSupplyTypeViewModel {
  id: string;
  supplyType: SupplyType;
  supplyToLocations: SupplyToLocationViewModel[] = new Array<SupplyToLocationViewModel>();
}

export class SupplyToLocationViewModel {
  id: string;
  name: string;
  categoryIds: string[] = new Array<string>();
  categoriesText: string;
}

export enum BuildingFilter {
  SupplyType,
  Location,
  EquipmentGroup,
  DeviceType,
  SerialNumber
}
export const BuildingFilterText = {
  [BuildingFilter.SupplyType]: 'Supply type',
  [BuildingFilter.Location]: 'Location',
  [BuildingFilter.EquipmentGroup]: 'Equipment group',
  [BuildingFilter.DeviceType]: 'Device Type',
  [BuildingFilter.SerialNumber]: 'Serial number'
};
export const BuildingFilterTypeDropdownItems = [
  {label: BuildingFilterText[BuildingFilter.SupplyType], value: BuildingFilter.SupplyType},
  {label: BuildingFilterText[BuildingFilter.Location], value: BuildingFilter.Location},
  {label: BuildingFilterText[BuildingFilter.EquipmentGroup], value: BuildingFilter.EquipmentGroup},
  {label: BuildingFilterText[BuildingFilter.DeviceType], value: BuildingFilter.DeviceType},
  {label: BuildingFilterText[BuildingFilter.SerialNumber], value: BuildingFilter.SerialNumber}
]
