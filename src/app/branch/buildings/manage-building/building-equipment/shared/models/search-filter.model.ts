import {BuildingFilter, SupplyType} from '@models';

export interface SearchFilterModel {
  name: string;
  nodeType: string;
  areaId: string;
  tariffIds: string[];
  supplyToId: string;
  locationTypeId: string;
  attributeValueFilter: CbSizeFilterModel;
}

export interface FilterAttribute {
  category: BuildingFilter;
  supplyType?: SupplyType;
  searchTerm?: string;
  location?: string | number;
  equipmentGroup?: string | number;
  device?: string | number;
}

export interface CbSizeFilterModel {
  attributeId: string;
  min: number;
  max: number;
}
