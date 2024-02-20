import {ShopViewModel} from "./shop.model";

export class ShopLiabilityViewModel {
  shopId: string;
  shop: ShopViewModel;
  isLiable: boolean = true;
  proportion: string;
  allocation: number;
  status: LiableShopStatus;
}

export enum LiableShopStatus {
  AllShops,
  LiableShops,
  NotLiableShops,
  VacantShops
}

export enum ComplexLiabilityShopFilter {
  AllShops,
  ConnectedShops,
  NotConnectedShops,
  LiableShops,
  NotLiableShops,
  VacantShops
}
