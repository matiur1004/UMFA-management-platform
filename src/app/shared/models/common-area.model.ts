import {CommonAreaLiabilityViewModel, Dictionary} from '@models';
import {SplitType} from "./liability.model";
import {SupplyType} from "./supply-type.model";

export class UpdateCommonAreaViewModel {
  commonAreas: CommonAreaViewModel[];
  commonAreaLiabilities: CommonAreaLiabilityViewModel[];
}

export interface SupplyTypeLiabilityModel {
  areaOfActiveShops: number;
  includeNotLiableShops: boolean;
  includeVacantShops: boolean;
  ownerLiable: boolean;
  splitType: SplitType
  supplyType: SupplyType
}

export class CommonAreaViewModel {
  id: string;
  name: string;
  floor: number;
  isActive: boolean = true;
  isSelected?: boolean;
  isSelectedPartly: boolean;
  services: CommonAreaServiceViewModel = new CommonAreaServiceViewModel();
  supplyTypeLiabilities: SupplyTypeLiabilityModel[];
  supplyTypeNodes: Dictionary<Dictionary<string>>;
}

export class CommonAreaServiceViewModel {
  isElectricityEnable: boolean = true;
  isWaterEnable: boolean = true;
  isSewerageEnable: boolean = true;
  isGasEnable: boolean = true;
  isOtherEnable: boolean = true;
}

export enum CommonAreaOrder {
  CommonAreaNameAsc = 1,
  CommonAreaNameDesc = -1,
  FloorAsc = 2,
  FloorDesc = -2
}
