import {TenantViewModel} from "./tenant.model";
import {SupplyType} from './supply-type.model';
import {UnitType} from "./unit-type.enum";

export interface IShopViewModel {
  tenant: TenantViewModel;
  isSpare: boolean;
}

export class ShopViewModel implements IShopViewModel {
  id: string;
  name: string;
  tenant: TenantViewModel = new TenantViewModel();
  area: number;
  floor: number;
  isSpare: boolean;
  isSelected: boolean;
  isSelectedPartly: boolean;
  tenantShopHistory: TenantShopHistoryViewModel[];
  isExpanded: boolean;
  shopNodes: ShopNodes[];
  unitType?: UnitType;
}

export class TenantShopHistoryViewModel {
  date: Date;
  tenant: TenantViewModel;
  comment: string;
}

export class ShopNodes {
  supplyType: SupplyType;
  nodes: ShopNodeDetails[];
}

export class ShopNodeDetails {
  id: string;
  name: string;
}

export enum ShopStatus {
  Occupied = 0,
  Vacant,
  Spare
}

export const shopStatuses = [ShopStatus.Occupied, ShopStatus.Spare, ShopStatus.Vacant];

export enum ShopFilter {
  AllShops,
  ConnectedShop,
  NotConnectedShop
}

export enum ShopStatusFilter {
  AllShops,
  ActiveShops,
  InactiveShops,
  Vacant,
  Occupied
}

export enum ShopOrder {
  ShopNameAsc = 1,
  ShopNameDesc = -1,
  TenantNameAsc = 2,
  TenantNameDesc = -2,
  AreaAsc = 3,
  AreaDesc = -3,
  StatusAsc = 4,
  StatusDesc = -4,
  FloorAsc = 5,
  FloorDesc = -5
}
