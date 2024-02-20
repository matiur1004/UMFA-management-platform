import {ShopLiabilityViewModel} from './shop-liability.model';
import {SupplyType} from './supply-type.model';

export class LiabilityViewModel {
  ownerLiable = false;
  defaultSettings = true;
  includeVacantShopSqM = true;
  includeNotLiableShops = true;
  splitType: SplitType = SplitType.Proportional;
  serviceType: SupplyType;
  shopLiabilities = new Array<ShopLiabilityViewModel>();
  totalSquare = 0;
  totalLiableShops = 0;
  totalNotLiableShops = 0;
  totalVacantShops = 0;
  totalShops = 0;
}

export enum SplitType {
  Equal = 0,
  Proportional = 1,
  Custom = 2,
  Consumption = 3
}

export const SplitTypeList = [
  {value: 0, label: 'Equal'},
  {value: 1, label: 'Proportional'},
  {value: 2, label: 'Custom'},
  {value: 3, label: 'Consumption'},
];
