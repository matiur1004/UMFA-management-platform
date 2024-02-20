import {ShopViewModel, SplitType, SupplyType, TimeOfUse, UnitOfMeasurementType, UnitType} from '@models';
import {MeterDetailViewModel} from './meter.model';
import {AllocatedTariffDetailViewModel} from './node-allocated-tariff.model';

export interface NodeViewModel {
  id: string;
  name: string;
  nodeType: NodeType;
  supplyType: SupplyType;
  supplyLocationType: string;
  supplyLocationName: string;
  description: string;
  equipmentGroup: string;
  numberOfMeters: number;
  numberOfUnits: number;
  shops: ShopViewModel[];
  commonAreaNames: string[];
}

export interface NodeSetsViewModel {
  id?: string;
  name: string;
  description: string;
  supplyType: any;
  nodeIds?: any;
}

export interface AllocatedUnitViewModel extends AllocatedUnit {
  tenantName: string;
  isLiable: boolean;
  allocationShare?: number;
  isSelected?: boolean;
  showNodeInfo?: boolean;
  registersCount?: number;
  isNew?: boolean;
}

export interface NodeEditViewModel {
  id: string;
  buildingId: string;
  name: string;
  nodeType: NodeType;
  supplyType: SupplyType;
  supplyToId: string;
  supplyToLocationId: string;
  description: string;
  meterOwnerId: string;
  ownersLiability: boolean;
  includeVacant: boolean;
  includeNotLiable: boolean;
  splitType: SplitType;
  costAllocationRegisterId?: string;
  costProvider: NodeCostProviderModel;
  nodes: AllocatedNodeEditViewModel[];
  meterAllocation: AllocatedNodeEditViewModel;
  tariffs: AllocatedTariffDetailViewModel[];
  allocatedUnits: AllocatedUnitViewModel[];
  attributeValues: NodeAttributeValueViewModel[];
}

export class CostAllocationNodeModel {
  nodeId: string;
  splitType: SplitType;
  consumptionSplitTypeUnitOfMeasurement?: UnitOfMeasurementType;
  ownersLiability: boolean;
  includeVacant: boolean;
  includeNotLiable: boolean;
  allocatedUnits: AllocatedUnitModel[];
}

export interface AllocatedNodeEditViewModel {
  nodeId: string;
  calculationFactor: number;
  registers: {
    registerId: string,
    calculationFactor: number,
    timeOfUse: TimeOfUse,
    unitOfMeasurement: UnitOfMeasurementType
  }[];
}

export interface ConsumptionCostNodeInfo {
  id: string;
  name: number;
  unitId?: string;
  registerId: string;
}

interface AllocatedUnit {
  id: string;
  meterIds: string[];
  unitType: UnitType;
  consumptionCostNodeInfo?: Array<ConsumptionCostNodeInfo>;
}

export interface AllocatedUnitModel extends AllocatedUnit {
  allocationShare: number;
  isLiable: boolean;
}

export interface NodeCostProviderModel {
  costFactor: number;
  registerId: string;
  isActive?: boolean;
}

export interface NodeDetailViewModel {
  id: string;
  buildingId: string;
  name: string;
  displayName: string;
  nodeType: NodeType;
  supplyType: SupplyType;
  supplyToId: string;
  supplyToLocationId: string;
  description: string;
  ownersLiability: boolean;
  includeVacant: boolean;
  includeNotLiable: boolean;
  costAllocationRegisterId?: string;
  costProvider: NodeCostProviderModel;
  meterOwner: MeterDetailViewModel;
  allocatedUnits: AllocatedUnitViewModel[];
  nodes: AllocatedNodeDetailViewModel[];
  meterAllocation: AllocatedNodeDetailViewModel;
  tariffs: AllocatedTariffDetailViewModel[];
  shopIds: string[];
  commonAreaIds: string[];
  attributeValues: NodeAttributeValueViewModel[];
  splitType: SplitType;
  consumptionSplitTypeUnitOfMeasurement?: UnitOfMeasurementType;
  registers: any[];
  tariffApplyType?: NodeTariffApplyType;
  isSelected?: boolean;
}

export interface ChildNodeAssignmentViewModel {
  nodeId: string;
  name: string;
  displayName: string;
  description: string;
  nodeType: NodeType;
  supplyToId: string;
  shopIds: string[];
  commonAreaIds: string[];
  supplyToLocationId: string;
  attributes: any[];
  registers: ChildNodeRegisterViewModel[];
  isSelected?: boolean;
}

export interface AllocatedNodeDetailViewModel extends ChildNodeAssignmentViewModel {
  calculationFactor: number;
  allocatedRegisters: AllocatedNodeRegisterViewModel[];
}

interface NodeRegisters {
  id: string;
  description: string;
  unitOfMeasurement: number;
  isSelected?: boolean;
}

interface NodeInfo {
  id: string;
  name: string;
  type: number;
  supplyType: number;
  registers: NodeRegisters[];
  supplyToInfo: {
    id: string;
    name: string;
  };
}

export interface SearchFilterUnitsModel {
  unitId: string;
  unitName: string;
  nodesInfo: NodeInfo[];
}

export class SearchFilterUnits {
  unitIds: Array<string>;
  unitAll: Array<string>;
  searchKey: string;
  unitOfMeasurementFilter: number;
  supplyTypeFilter: number;
  nodeTypeFilter: number;
  supplyToIdFilter: string;
  timeOfUseFilter: number;
  selectedData: ConsumptionCostNodeInfo[];

  constructor(unitOfMeasurement?: UnitOfMeasurementType, selectedData?: ConsumptionCostNodeInfo[]) {
    this.unitIds = [];
    this.searchKey = '';
    this.unitAll = [];
    this.unitOfMeasurementFilter = unitOfMeasurement || -1;
    this.supplyTypeFilter = -1;
    this.nodeTypeFilter = -1;
    this.timeOfUseFilter = -1;
    this.supplyToIdFilter = null;
    this.selectedData = selectedData || [];
  }
}

export interface ChildNodeRegisterViewModel {
  registerId: string;
  timeOfUse: TimeOfUse;
  unitOfMeasurement: UnitOfMeasurementType;
  useForBilling: boolean;
}

export interface AllocatedNodeRegisterViewModel {
  registerId: string;
  calculationFactor: number;
}

export interface NodeAllocatedRegister {
  nodeId: string;
  registerIds: string[];
}

export interface NodeAttributeValueViewModel {
  attributeId: string;
  recommendedValue: any;
  billingValue: any;
  value: any;
  comment: string;
  fileUrl: string;
  file?: File;
  attribute?: any;
}

export enum NodeType {
  Single,
  Multi
}

export enum NodeTariffApplyType {
  PerNode = 0,
  PerMeter = 1
}

export enum OrderNodeType {
  NameDesc = -1,
  NameAsc = 1,
  NodeTypeDesc = -2,
  NodeTypeAsc = 2,
  SupplyTypeDesc = -3,
  SupplyTypeAsc = 3,
  EquipmentGroupDesc = -4,
  EquipmentGroupAsc = 4,
  AllocatedUnitsDesc = -5,
  AllocatedUnitsAsc = 5,
  AllocatedEquipmentsDesc = -6,
  AllocatedEquipmentsAsc = 6,
  DescriptionDesc = -7,
  DescriptionAsc = 7,
  SupplyToDesc = -8,
  SupplyToAsc = 8,
  MeterSerialNumberDesc = 9,
  MeterSerialNumberAsc = -9,
  MeterBrandModelDesc = -10,
  MeterBrandModelAsc = 10,
}
